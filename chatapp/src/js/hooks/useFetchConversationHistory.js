import useAddConversation from "./useAddConversation";

const { useCallback, useContext } = require("react");
const { getConversation } = require("src/api");
const { default: contexts } = require("src/contexts");

function useFetchConversationHistory() {
	const authContext = useContext(contexts.Auth);
	const addConversation = useAddConversation();

	const { token } = authContext;

	return useCallback(
		(convo) => {
			if (convo) {
				getConversation(token, convo).then(({ convo, messages }) => {
					addConversation(convo, messages);
				});
			}
		},
		[token, addConversation]
	);
}

export default useFetchConversationHistory;
