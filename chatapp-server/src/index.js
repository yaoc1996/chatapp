const { exec } = require("child_process");
const path = require("path");

const express = require("express");
const cors = require("cors");
const { Server } = require("ws");
const { WSARouter, WebSocketApp } = require("./ws-api-server");

const clientDir = path.join(__dirname, "..", "client");

const app = express();
const webSocketApp = WebSocketApp();

const { PORT, NODE_ENV } = process.env;
const sequelize = require("./sequelize")(express);
const passport = require("./middlewares/passport")(express, sequelize);

let publicIP;

exec("curl ip-adresim.app", function (error, stdout, stderr) {
	if (error) return;
	publicIP = stdout;
});

const routers = {
	auth: require("./controllers/auth")(express, sequelize),
	user: require("./controllers/user")(express, sequelize),
	search: require("./controllers/search")(express, sequelize),
};

const wsRouters = {
	user: require("./controllers/ws/user")(WSARouter, sequelize),
};

app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

app.use(express.json());

app.use(express.static(clientDir));

app.use(
	/^\/api\/(?!auth)(?!search)(?!address).*/,
	passport.authenticate("jwt", { session: false })
);

app.get("/api/address", (req, res) => {
	res.status(200).send({
		address:
			NODE_ENV === "production"
				? `http://${publicIP}:${PORT}`
				: `http://localhost:${PORT}`,
	});
});

Object.entries(routers).forEach(([name, router]) => {
	app.use(`/api/${name}`, router);
});

Object.entries(wsRouters).forEach(([name, router]) => {
	webSocketApp.use(`/${name}`, router);
});

app.get("/*", (req, res) => {
	res.sendFile(path.join(clientDir, "index.html"));
});

const server = app.listen(PORT, () => {
	sequelize
		.authenticate()
		.then(() => {
			console.log(`SequelizeInfo: Successfully connected to database`);
		})
		.catch((err) => {
			console.error(`SequelizeError: Unable to connect to database`);
		})
		.then(() =>
			sequelize
				.sync({
					// force: true,
				})
				.then(() => {
					console.log("SequelizeInfo: Successfully synced database.");
				})
				.catch((err) => {
					console.log("SequelizeInfo: Failed to sync database.", err);
				})
		)
		.then(() => {
			const wss = new Server({ server });

			wss.on("connection", (socket, req) => {
				webSocketApp.authenticate(
					socket,
					req,
					passport.authenticate("jwt", { session: false })
				);
			});

			console.log(`Chatapp Server is listening on port ${PORT}`);
		});
});
