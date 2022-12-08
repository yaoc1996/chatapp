import { useContext, useEffect } from "react";
import { getFriendRequests, getFriends } from "src/api";
import contexts from "src/contexts";

function GetFriends() {
	const authContext = useContext(contexts.Auth);
	const userContext = useContext(contexts.User);

	const { token } = authContext;

	useEffect(() => {
		if (token) {
			getFriends(token)
				.then((friends) => {
					userContext.setState({
						friends,
					});
				})
				.catch((err) => {});
		}
	}, [token]);
}

function GetFriendRequests() {
	const authContext = useContext(contexts.Auth);
	const userContext = useContext(contexts.User);

	const { token } = authContext;

	useEffect(() => {
		if (token) {
			getFriendRequests(token)
				.then(({ sent, received }) => {
					userContext.setState({
						sentFriendRequests: sent,
						receivedFriendRequests: received,
					});
				})
				.catch(console.log);
		}
	}, [token]);
}

function FriendRequestManager() {
	return (
		<>
			<GetFriends />
			<GetFriendRequests />
		</>
	);
}

export default FriendRequestManager;
