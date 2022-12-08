const { DataTypes } = require("sequelize");

module.exports = (express, sequelize) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			publicProfile: {
				type: DataTypes.VIRTUAL,
				get() {
					return {
						id: this.id,
						username: this.username,
					};
				},
			},
		},
		{}
	);

	return User;
};
