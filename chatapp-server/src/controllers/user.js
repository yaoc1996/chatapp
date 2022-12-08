const { Op, fn, col } = require("sequelize");

module.exports = (express, sequelize) => {
	const userRouter = express.Router();
	const { User, Message } = sequelize.models;

	userRouter.get("/", (req, res) => {
		const { user } = req;

		res.status(200).send(user.publicProfile);
	});

	userRouter.get("/authenticate", (req, res) => {
		res.status(200).end();
	});

	userRouter.get("/friends", (req, res) => {
		const { user } = req;

		user.getFriends({
			joinTableAttributes: [],
		})
			.then((friends) => {
				res.status(200).send(friends.map((user) => user.publicProfile));
			})
			.catch((err) => {
				res.status(400).send(err.message);
			});
	});

	userRouter.get("/friend/requests", (req, res) => {
		const { user } = req;

		Promise.all([
			user.getSentRequests({
				joinTableAttributes: [],
			}),
			user.getReceivedRequests({
				joinTableAttributes: [],
			}),
		])
			.then(([sent, received]) => {
				res.status(200).send({
					sent: sent.map((user) => user.publicProfile),
					received: received.map((user) => user.publicProfile),
				});
			})
			.catch((err) => {
				res.status(400).send(err.message);
			});
	});

	userRouter.post("/convo", (req, res) => {
		const { user, body } = req;
		const { convoId, beforeMessageId } = body;

		user.getConversations({
			joinTableAttributes: [],
			where: {
				id: convoId,
			},
			order: [["updatedAt", "DESC"]],
			plain: true,
		}).then((convo) => {
			if (!convo) {
				res.status(400).send("Invalid conversation.");
			} else {
				convo
					.getMessages({
						where: {
							id: {
								[Op.lt]: beforeMessageId,
							},
						},
						order: [["createdAt", "DESC"]],
						limit: 20,
					})
					.then((messages) => {
						res.status(200).send({
							convo,
							messages,
						});
					});
			}
		});
	});

	userRouter.get("/convos", (req, res) => {
		const { user } = req;

		user.getConversations({
			joinTableAttributes: [],
			include: [
				{
					model: User,
					as: "users",
					attributes: ["id", "username"],
					through: {
						attributes: [],
					},
				},
				{
					model: Message,
					as: "messages",
					order: [["createdAt", "DESC"]],
					limit: 20,
					separate: true,
					required: false,
				},
			],
			order: [
				["updatedAt", "DESC"],
				// [{ model: Message, as: "messages" }, "createdAt", "DESC"],
			],
		})
			.then((convos) => {
				res.status(200).send(convos);
			})
			.catch((e) => {
				console.log(e.message);
				res.status(400).send(e.message);
			});
	});

	userRouter.post("/friend/request/send", (req, res) => {
		const { user } = req;
		const { id: targetId } = req.body;

		if (user.id == targetId) {
			res.status(400).send("Failed to send request; Cannot target self.");
		} else {
			User.findOne({
				where: {
					id: targetId,
				},
				include: [
					{
						model: User,
						as: "friends",
						where: {
							id: user.id,
						},
						required: false,
					},
				],
			})
				.then((target) => {
					if (!target) {
						res.status(404).send(
							"Failed to send request; Target user not found."
						);
					} else {
						if (target.friends.length == 1) {
							res.status(400).send(
								"Failed to send request; Already friends with target user."
							);
						} else {
							user.addSentRequest(target).then(() => {
								res.status(200).end();
							});
						}
					}
				})
				.catch((err) => {
					res.status(400).send(err.message);
				});
		}
	});

	userRouter.post("/friend/request/respond", (req, res) => {
		const { user } = req;
		const { id: targetId, accept } = req.body;

		user.getReceivedRequests({
			where: {
				id: targetId,
			},
			plain: true,
			required: false,
		})
			.then((target) => {
				if (!target) {
					res.status(404).send(
						"Failed to respond to request; Request not found."
					);
				} else {
					return new Promise((resolve) => {
						if (accept) {
							resolve(
								Promise.all([
									user.addFriend(target),
									target.addFriend(user),
									user.removeSentRequest(target),
									target.removeSentRequest(user),
								])
							);
						} else {
							resolve(user.removeReceivedRequest(target));
						}
					}).then(() => {
						res.status(200).end();
					});
				}
			})
			.catch((err) => {
				res.status(400).send(err.message);
			});
	});

	return userRouter;
};
