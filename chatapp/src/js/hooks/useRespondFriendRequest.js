import { useCallback, useContext } from "react";
import contexts from "src/contexts";

function useRespondFriendRequest() {
	const authContext = useContext(contexts.Auth);

	const { socketAPI } = authContext;

	return useCallback(
		(user, accept) => {
			if (socketAPI) {
				const { id } = user;

				socketAPI.send("/user/friend/request/respond", {
					id,
					accept,
				});
			}
		},
		[socketAPI]
	);
}

export default useRespondFriendRequest;
