const http = require("http");

const WSARouter = require("./ws-api-router");

class WebSocketAPI {
	constructor(activeUsers) {
		this.activeUsers = activeUsers;
	}

	send(route, id, body) {
		const connections = this.activeUsers[id];

		if (connections) {
			connections.forEach((conn) => {
				conn.send(
					JSON.stringify({
						route,
						body,
					})
				);
			});
		}
	}
}

class WebSocketApp extends WSARouter {
	constructor() {
		super();

		this.activeUsers = {};
		this.connect = this.connect.bind(this);
	}

	authenticate(socket, req, strategy) {
		const connect = this.connect;

		return new Promise((resolve, reject) => {
			function authenticateToken(message) {
				const token = message.toString();

				req.headers.authorization = token;

				strategy(req, new http.ServerResponse(req), (error) => {
					if (error) {
						reject(error);
					} else {
						socket.off("message", authenticateToken);
						connect(socket, req);
						resolve();
					}
				});
			}

			socket.on("message", authenticateToken);
		});
	}

	connect(socket, req) {
		const { user } = req;
		const { id } = user;

		let existingConnections = this.activeUsers[id];

		if (!existingConnections) {
			existingConnections = [];
			this.activeUsers[id] = existingConnections;
		}

		existingConnections.push(socket);

		const context = new WebSocketAPI(this.activeUsers);

		socket.on("message", (message) => {
			const { route, body } = JSON.parse(message);
			this.recv(context, route, {
				body,
				user,
			});
		});

		socket.on("close", () => {
			existingConnections.splice(
				existingConnections.findIndex((s) => s === socket),
				1
			);
		});

		socket.send("Success");
	}
}

module.exports = {
	WSARouter: (...args) => new WSARouter(...args),
	WebSocketApp: (...args) => new WebSocketApp(...args),
};
