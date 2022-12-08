const { useContext, useCallback } = require("react");
const { default: contexts } = require("src/contexts");

function useSendFriendRequest() {
	const authContext = useContext(contexts.Auth);

	const { socketAPI } = authContext;

	const addFriend = useCallback(
		(user) => {
			if (socketAPI) {
				const { id } = user;
				socketAPI.send("/user/friend/request/send", { id });
			}
		},
		[socketAPI]
	);

	return addFriend;
}

export default useSendFriendRequest;
