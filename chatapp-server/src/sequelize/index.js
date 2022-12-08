const Sequelize = require("sequelize");
const UserModel = require("./models/user");
const MessageModel = require("./models/message");
const ConversationModel = require("./models/conversation");

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DBNAME } = process.env;

module.exports = (express) => {
	const sequelize = new Sequelize(MYSQL_DBNAME, MYSQL_USER, MYSQL_PASS, {
		host: MYSQL_HOST,
		dialect: "mysql",
	});

	const User = UserModel(express, sequelize);
	const Message = MessageModel(express, sequelize);
	const Conversation = ConversationModel(express, sequelize);

	User.belongsToMany(User, {
		as: "friends",
		foreignKey: "userId",
		through: "Friends",
	});

	User.belongsToMany(User, {
		as: "sentRequests",
		foreignKey: "senderId",
		otherKey: "receiverId",
		through: "FriendRequests",
	});

	User.belongsToMany(User, {
		as: "receivedRequests",
		foreignKey: "receiverId",
		otherKey: "senderId",
		through: "FriendRequests",
	});

	User.hasMany(Message, {
		foreignKey: "userId",
		as: "messages",
	});

	Conversation.hasMany(Message, {
		foreignKey: "conversationId",
		as: "messages",
	});

	Message.belongsTo(User, {
		foreignKey: "userId",
	});

	Message.belongsTo(Conversation, {
		foreignKey: "conversationId",
	});

	User.belongsToMany(Conversation, {
		as: "conversations",
		foreignKey: "userId",
		otherKey: "conversationId",
		through: "UserConversations",
	});

	Conversation.belongsToMany(User, {
		as: "users",
		foreignKey: "conversationId",
		otherKey: "userId",
		through: "UserConversations",
	});

	return sequelize;
};
