import { reject } from "lodash";
import { apiRoutes, apiUrl } from "./config";

function getAddress() {
	return fetch(apiRoutes.getAddress).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw new Error("Failed to get server address.");
		}
	});
}

function login(username, password) {
	return fetch(apiRoutes.login, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	}).then((res) => {
		if (res.ok) {
			return res.text();
		} else {
			return res.text().then((err) => {
				throw new Error(err);
			});
		}
	});
}

function signup(username, password) {
	return fetch(apiRoutes.signup, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	}).then((res) => {
		if (res.ok) {
			return res.text();
		} else {
			return res.text().then((err) => {
				throw new Error(err);
			});
		}
	});
}

function searchUsers(searchString) {
	return fetch(apiRoutes.searchUsers + `?searchString=${searchString}`).then(
		(res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw new Error("Failed to search users.");
			}
		}
	);
}

function getUser(token) {
	return fetch(apiRoutes.getUser, {
		headers: {
			Authorization: token,
		},
	}).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw new Error("Failed to get user information.");
		}
	});
}

function authenticate(token) {
	return fetch(apiRoutes.authenticate, {
		headers: {
			Authorization: token,
		},
	}).then((res) => {
		if (res.ok) {
			return token;
		} else {
			throw new Error("Invalid token.");
		}
	});
}

function getFriends(token) {
	return fetch(apiRoutes.getFriends, {
		headers: {
			Authorization: token,
		},
	}).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw new Error("Failed to get friends.");
		}
	});
}

function getFriendRequests(token) {
	return fetch(apiRoutes.getFriendRequests, {
		headers: {
			Authorization: token,
		},
	}).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw new Error("Failed to get friend requests.");
		}
	});
}

function getConversation(token, convo) {
	return fetch(apiRoutes.getConversation, {
		method: "POST",
		headers: {
			Authorization: token,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			convoId: convo.id,
			beforeMessageId: convo.messages[convo.messages.length - 1].id,
		}),
	}).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw new Error("Failed to get conversation.");
		}
	});
}

function getConversations(token) {
	return fetch(apiRoutes.getConversations, {
		headers: {
			Authorization: token,
		},
	}).then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw new Error("Failed to get conversations.");
		}
	});
}

export {
	getAddress,
	login,
	signup,
	searchUsers,
	getUser,
	authenticate,
	getFriends,
	getFriendRequests,
	getConversation,
	getConversations,
};
