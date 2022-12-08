const { DataTypes } = require("sequelize");

module.exports = (express, sequelize) => {
	const Conversation = sequelize.define(
		"Conversation",
		{
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			// content: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// },
		},
		{}
	);

	return Conversation;
};
