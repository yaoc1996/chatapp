const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, BCRYPT_SALTROUNDS } = process.env;

module.exports = (express, sequelize) => {
	const userRouter = express.Router();

	function credentialPrecheck(req, res, next) {
		const { username, password } = req.body;

		if (!username || !password) {
			res.status(406).send("Username or password cannot be empty.");
		} else {
			next();
		}
	}

	userRouter.post("/signup", credentialPrecheck, (req, res) => {
		const { username, password } = req.body;
		const { User } = sequelize.models;

		if (username.length < 6 || username.length > 24) {
			res.status(400).send(
				"Username must be between 6 to 24 characters."
			);
			h;
		} else if (!username.match(/^[0-9a-z]+$/)) {
			res.status(400).send("Username must be alphanumeric.");
		} else if (
			!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/)
		) {
			res.status(400).send(
				"Password must be between 6 to 24 characters with at least one letter, and one number."
			);
		} else {
			User.findOne({
				where: {
					username,
				},
			}).then((user) => {
				if (user) {
					res.status(409).send("Username already exists.");
				} else {
					bcrypt
						.hash(password, parseInt(BCRYPT_SALTROUNDS))
						.then((password) => {
							User.create({
								username,
								password,
							}).then((user) => {
								const jwtToken = jwt.sign(
									{ id: user.id },
									JWT_SECRET
								);
								res.status(201).send(jwtToken);
							});
						});
				}
			});
		}
	});

	userRouter.post("/login", credentialPrecheck, (req, res, next) => {
		const { username, password } = req.body;
		const { User } = sequelize.models;

		const errorMessage = "Username or password is incorrect.";

		User.findOne({
			where: {
				username,
			},
		}).then((user) => {
			if (!user) {
				res.status(404).send(errorMessage);
			} else {
				bcrypt.compare(password, user.password).then((isCorrect) => {
					if (isCorrect) {
						const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET);
						res.status(201).send(jwtToken);
					} else {
						res.status(404).send(errorMessage);
					}
				});
			}
		});
	});

	return userRouter;
};
