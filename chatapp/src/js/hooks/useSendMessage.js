const { useContext, useCallback } = require("react");
const { default: contexts } = require("src/contexts");

function useSendMessage() {
	const authContext = useContext(contexts.Auth);

	const { socketAPI } = authContext;

	const sendMessage = useCallback(
		(convo, targets, content) => {
			if (socketAPI && content && (convo || targets)) {
				socketAPI.send("/user/convo/message/send", {
					convoId: convo?.id,
					targetIds: targets ? targets.map((t) => t.id) : [],
					content,
				});
			}
		},
		[socketAPI]
	);

	return sendMessage;
}

export default useSendMessage;
