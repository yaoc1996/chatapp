const { Op } = require("sequelize");

module.exports = (express, sequelize) => {
	const searchRouter = express.Router();
	const { User } = sequelize.models;

	searchRouter.get("/users", (req, res) => {
		const { searchString } = req.query;

		if (searchString) {
			User.findAll({
				where: {
					username: {
						[Op.substring]: searchString,
					},
				},
				attributes: ["id", "username"],
				limit: 30,
				raw: true,
			}).then((users) => {
				res.send(users);
			});
		} else {
			res.status(400).send("Query string cannot be empty.");
		}
	});

	return searchRouter;
};
