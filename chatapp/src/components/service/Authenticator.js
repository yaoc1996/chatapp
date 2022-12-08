import { useContext, useEffect } from "react";
import { authenticate } from "src/api";
import { clientRoutes, tokenStorageKey } from "src/config";
import contexts from "src/contexts";
import { getStorage } from "src/js/cache";

function Authenticator() {
	const authContext = useContext(contexts.Auth);

	useEffect(() => {
		authContext.setState({
			isAuthenticating: true,
		});

		const token = getStorage(tokenStorageKey);

		new Promise((resolve, reject) => {
			if (token) {
				resolve(
					authenticate(token).then(() => {
						authContext.setState({
							token,
						});
					})
				);
			} else {
				reject(new Error("Failed to authenticate."));
			}
		})
			.catch(() => {})
			.finally(() => {
				authContext.setState({
					isAuthenticating: false,
				});
			});
	}, []);
}

export default Authenticator;
