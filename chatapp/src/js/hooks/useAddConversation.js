import contexts from "src/contexts";

const { useCallback, useContext, useTransition } = require("react");

function useAddConversation() {
	const userContext = useContext(contexts.User);
	const [isPending, startTransition] = useTransition();

	return useCallback((convo, messages) => {
		startTransition(() => {
			userContext.setState(({ conversations }) => {
				const idx = conversations.findIndex((c) => c.id === convo.id);

				let newConvo;

				if (idx >= 0) {
					newConvo = {
						...conversations[idx],
						...convo,
						updatedAt:
							conversations[idx].updatedAt > convo.updatedAt
								? conversations[idx].updatedAt
								: convo.updatedAt,
					};
				} else {
					newConvo = {
						...convo,
						messages: [],
					};
				}

				const newConversations = [newConvo];

				for (let i = 0; i < conversations.length; ++i) {
					if (i !== idx) {
						newConversations.push(conversations[i]);
					}
				}

				newConversations.sort((a, b) => {
					if (a.updatedAt > b.updatedAt) {
						return -1;
					} else if (a.updatedAt < b.updatedAt) {
						return 1;
					} else {
						return 0;
					}
				});

				if (messages.length > 0 && newConvo.messages.length > 0) {
					if (
						messages[0].createdAt > newConvo.messages[0].createdAt
					) {
						newConvo.messages = [...messages, ...newConvo.messages];
					} else {
						newConvo.messages = [...newConvo.messages, ...messages];
					}
				} else {
					newConvo.messages = [...messages, ...newConvo.messages];
				}

				return {
					conversations: newConversations,
				};
			});
		});
	}, []);
}

export default useAddConversation;
