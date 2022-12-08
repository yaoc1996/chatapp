const { DataTypes } = require("sequelize");

module.exports = (express, sequelize) => {
	const Message = sequelize.define(
		"Message",
		{
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{}
	);

	return Message;
};
