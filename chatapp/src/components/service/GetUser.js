import { useContext, useEffect } from "react";
import { getUser } from "src/api";
import contexts from "src/contexts";

function GetUser() {
	const authContext = useContext(contexts.Auth);
	const userContext = useContext(contexts.User);

	const { token } = authContext;

	useEffect(() => {
		if (token) {
			getUser(token)
				.then((user) => {
					userContext.setState({
						user,
					});
				})
				.catch((err) => {});
		}
	}, [token]);
}

export default GetUser;
