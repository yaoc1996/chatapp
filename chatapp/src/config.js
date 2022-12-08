const apiRoutes = {
	getAddress: "/api/address",
	login: "/api/auth/login",
	signup: "/api/auth/signup",
	searchUsers: "/api/search/users",
	getUser: "/api/user",
	authenticate: "/api/user/authenticate",
	getFriends: "/api/user/friends",
	getFriendRequests: "/api/user/friend/requests",
	getConversation: "/api/user/convo",
	getConversations: "/api/user/convos",
};

const clientRoutes = {
	root: "/",
	login: "/login",
	signup: "/signup",
	dashboard: "/dashboard",
};

const publicClientRoutes = [
	clientRoutes.root,
	clientRoutes.login,
	clientRoutes.signup,
];

const tokenStorageKey = "Chatapp_JWT";

export { apiRoutes, clientRoutes, tokenStorageKey, publicClientRoutes };
