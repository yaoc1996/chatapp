import { useContext, useEffect } from "react";
import { getConversations } from "src/api";
import contexts from "src/contexts";

function GetConversations() {
	const authContext = useContext(contexts.Auth);
	const userContext = useContext(contexts.User);

	const { token } = authContext;

	useEffect(() => {
		if (token) {
			getConversations(token).then((conversations) => {
				userContext.setState({
					conversations,
				});
			});
		}
	}, [token]);
}

export default GetConversations;
