import { useContext, useEffect } from "react";
import { getAddress } from "src/api";
import contexts from "src/contexts";
import { WebSocketApp } from "src/js/ws-api-client";
import useUserRouter from "./useUserRouter";
import UserRouter from "./useUserRouter";

function SocketManager() {
	const authContext = useContext(contexts.Auth);

	const { token } = authContext;

	const userRouter = useUserRouter();

	useEffect(() => {
		if (token) {
			const promise = getAddress().then(({ address }) => {
				const ws = new WebSocket(address.replace("http", "ws"));
				const webSocketApp = new WebSocketApp();

				webSocketApp.use("/user", userRouter);

				return webSocketApp
					.connect(ws, {
						authentication: token,
					})
					.then((socketAPI) => {
						authContext.setState({
							socketAPI,
						});

						console.log("Socket connection successful");

						return ws;
					});
			});

			return () => {
				promise.then((ws) => {
					authContext.setState({
						socketAPI: null,
					});
					ws.close();
				});
			};
		}
	}, [token, userRouter]);
}

export default SocketManager;
