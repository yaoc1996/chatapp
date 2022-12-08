const { Op, UniqueConstraintError } = require("sequelize");

module.exports = (WSARouter, sequelize) => {
	const userRouter = WSARouter();
	const { User, Message, Conversation } = sequelize.models;

	userRouter.on("/friend/request/send", (data, api, next) => {
		const { user, body } = data;
		const { id: targetId } = body;

		user.reload().then(() => {
			const { id } = user;

			if (id === targetId) {
				next("Failed to send request; Cannot target self.");
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
								id,
							},
							required: false,
						},
					],
				}).then((target) => {
					if (!target) {
						next("Failed to send request; Target user not found.");
					} else {
						if (target.friends.length === 1) {
							next(
								"Failed to send request; Already friends with target user."
							);
						} else {
							user.addSentRequest(target)
								.then(() => {
									api.send(
										"/user/friend/request/received/add",
										target.id,
										{
											user: user.publicProfile,
										}
									);

									api.send(
										"/user/friend/request/sent/add",
										id,
										{
											user: target.publicProfile,
										}
									);
									next();
								})
								.catch((e) => {
									next(e.message);
								});
						}
					}
				});
			}
		});
	});

	userRouter.on("/friend/request/respond", (data, api, next) => {
		const { user, body } = data;
		const { id: targetId, accept } = body;

		user.getReceivedRequests({
			where: {
				id: targetId,
			},
			plain: true,
			required: false,
		})
			.then((target) => {
				if (!target) {
					throw new Error(
						"Failed to respond to request; Request not found."
					);
				} else {
					return target
						.removeSentRequest(user)
						.then(() => {
							if (accept) {
								return Promise.all([
									user.addFriend(target),
									target.addFriend(user),
									user.removeSentRequest(target),
								]).then(() => {
									api.send("/user/friend/add", targetId, {
										user: user.publicProfile,
									});
									api.send("/user/friend/add", user.id, {
										user: target.publicProfile,
									});
								});
							} else {
								// rejected request;
							}
						})
						.then(() => {
							api.send(
								"/user/friend/request/received/remove",
								user.id,
								{
									user: target.publicProfile,
								}
							);
							api.send(
								"/user/friend/request/sent/remove",
								target.id,
								{
									user: user.publicProfile,
								}
							);
						});
				}
			})
			.catch((e) => {
				next(e.message);
			});
	});

	userRouter.on("/convo/message/send", async (data, api, next) => {
		const { user, body } = data;
		const { targetIds, convoId, content } = body;

		let conversation;

		if (!content) {
			next("Invalid message content.");
		} else {
			if (!convoId) {
				if (targetIds) {
					const targets = await User.findAll({
						where: {
							id: {
								[Op.in]: targetIds,
							},
						},
					});

					if (!targets || targets.length !== targetIds.length) {
						next("Invalid targetId.");
					} else {
						const convos = (
							await user.getConversations({
								include: [
									{
										model: User,
										as: "users",
										attributes: ["id", "username"],
										through: {
											attributes: [],
										},
									},
								],
							})
						).filter((convo) => {
							return (
								convo.users.length - 1 === targetIds.length &&
								new Set([
									...convo.users
										.map((u) => u.id)
										.filter((id) => id !== user.id),
									...targetIds,
								]).size === targetIds.length
							);
						});

						if (convos.length === 0) {
							convo = await Conversation.create({
								type:
									targetIds.length === 1 ? "single" : "multi",
							});

							await convo.addUsers([user, ...targets]);
							convo = await Conversation.findOne({
								where: { id: convo.id },
								include: [
									{
										model: User,
										as: "users",
										where: {
											id: {
												[Op.in]: [
													user.id,
													...targetIds,
												],
											},
										},
										attributes: ["id", "username"],
										through: {
											attributes: [],
										},
									},
								],
							});
						} else {
							convo = convos[0];
						}

						conversation = convo;
					}
				}
			} else {
				const convo = await Conversation.findOne({
					where: {
						id: convoId,
					},
					include: [
						{
							model: User,
							as: "users",
							attributes: ["id", "username"],
							through: {
								attributes: [],
							},
						},
					],
				});

				if (await convo.hasUser(user)) {
					conversation = convo;
				}
			}

			if (!conversation) {
				next("Invalid conversation.");
			} else {
				conversation.changed("updatedAt", true);
				await conversation.update({
					updatedAt: new Date(),
				});

				const message = await Message.create({ content });
				await message.setUser(user);
				await message.setConversation(conversation);

				conversation.users.forEach((target) => {
					api.send("/user/convo/message/add", target.id, {
						convo: conversation,
						from: user.publicProfile,
						message,
					});
				});

				next();
			}
		}
	});

	return userRouter;
};
