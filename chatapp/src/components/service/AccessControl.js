import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clientRoutes, publicClientRoutes } from "src/config";
import contexts from "src/contexts";

function AccessControl() {
	const authContext = useContext(contexts.Auth);
	const location = useLocation();
	const navigate = useNavigate();

	const { isAuthenticating, token } = authContext;

	useEffect(() => {
		if (!isAuthenticating) {
			const isOnPublicRoute =
				publicClientRoutes.indexOf(location.pathname) >= 0;

			if (token) {
				if (isOnPublicRoute) {
					navigate(clientRoutes.dashboard);
				}
			} else {
				if (!isOnPublicRoute) {
					navigate(clientRoutes.login);
				}
			}
		}
	}, [isAuthenticating, token, location]);
}

export default AccessControl;
