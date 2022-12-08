import { useContext, useMemo } from "react";
import contexts from "src/contexts";
import useAddConversation from "src/js/hooks/useAddConversation";
import { WSARouter } from "src/js/ws-api-client";

function useUserRouter() {
	const userContext = useContext(contexts.User);
	const uiContext = useContext(contexts.UI);

	const addConversation = useAddConversation();

	const { user } = userContext;

	return useMemo(() => {
		const userRouter = new WSARouter();

		userRouter.on(
			"/friend/request/received/add",
			(data, socketAPI, next) => {
				const { body } = data;
				const { user } = body;

				userContext.setState(({ receivedFriendRequests }) => ({
					receivedFriendRequests: [...receivedFriendRequests, user],
				}));

				next();
			}
		);

		userRouter.on("/friend/request/sent/add", (data, socketAPI, next) => {
			const { body } = data;
			const { user } = body;

			userContext.setState(({ sentFriendRequests }) => ({
				sentFriendRequests: [...sentFriendRequests, user],
			}));

			next();
		});

		userRouter.on(
			"/friend/request/received/remove",
			(data, socketAPI, next) => {
				const { body } = data;
				const { user } = body;

				userContext.setState(({ receivedFriendRequests }) => ({
					receivedFriendRequests: receivedFriendRequests.filter(
						(req) => req.id !== user.id
					),
				}));

				next();
			}
		);

		userRouter.on(
			"/friend/request/sent/remove",
			(data, socketAPI, next) => {
				const { body } = data;
				const { user } = body;

				userContext.setState(({ sentFriendRequests }) => ({
					sentFriendRequests: sentFriendRequests.filter(
						(req) => req.id !== user.id
					),
				}));

				next();
			}
		);

		userRouter.on("/friend/add", (data, socketAPI, next) => {
			const { body } = data;
			const { user } = body;

			userContext.setState(({ friends }) => ({
				friends: [...friends, user],
			}));

			next();
		});

		userRouter.on("/convo/message/add", (data, socketAPI, next) => {
			const { body } = data;
			const { message, convo, from } = body;

			addConversation(convo, [message]);

			if (from.id === user.id) {
				uiContext.setState({
					focusedConvoId: convo.id,
				});
			}

			next();
		});

		return userRouter;
	}, [user, addConversation]);
}

export default useUserRouter;
