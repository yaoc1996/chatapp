import { useContext, useEffect } from "react";
import contexts from "src/contexts";

function ResolveFocusedConversation() {
	const userContext = useContext(contexts.User);
	const uiContext = useContext(contexts.UI);

	const { conversations } = userContext;
	const { focusedConvoId, focusedUserId, isMobile } = uiContext;

	// useEffect(() => {
	// 	if (!focusedConvoId && !focusedUserId && conversations.length > 0) {
	// 		uiContext.setState({
	// 			focusedConvoId: conversations[0].id,
	// 		});
	// 	}
	// }, [conversations, focusedConvoId, focusedUserId]);

	useEffect(() => {
		if (focusedUserId) {
			const convo = conversations.find(
				(convo) =>
					convo.type === "single" &&
					convo.users.find((user) => user.id === focusedUserId)
			);

			if (convo) {
				uiContext.setState({
					focusedConvoId: convo.id,
				});
			} else {
				uiContext.setState({
					focusedConvoId: null,
				});
			}
		}
	}, [focusedUserId, conversations]);

	useEffect(() => {
		if (focusedConvoId) {
			uiContext.setState({
				focusedUserId: null,
			});
		}
	}, [focusedConvoId]);

	useEffect(() => {}, [isMobile, focusedConvoId, focusedUserId]);
}

function ResolveDeviceType() {
	const uiContext = useContext(contexts.UI);

	const { selectedTab, isMobile } = uiContext;

	useEffect(() => {
		let timeoutId = null;

		function onResize() {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				const { innerWidth, innerHeight } = window;

				uiContext.setState({
					isMobile: innerWidth / innerHeight < 0.9,
				});
				timeoutId = null;
			}, 30);
		}

		window.addEventListener("resize", onResize);

		onResize();

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	useEffect(() => {
		if (!isMobile) {
			if (selectedTab === "conversations" || selectedTab === "chat") {
				uiContext.setState({
					selectedTab: "friends",
				});
			}
		}
	}, [isMobile, selectedTab]);
}

function UIServices() {
	return (
		<>
			<ResolveFocusedConversation />
			<ResolveDeviceType />
		</>
	);
}

export default UIServices;
