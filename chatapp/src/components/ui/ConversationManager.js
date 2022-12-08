import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import contexts from "src/contexts";
import useRedirect from "src/js/hooks/useRedirect";
import styled from "styled-components";

const ConversationEntryDiv = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: start;
	width: 100%;
	color: #333;
	text-align: left;
	padding: 8px;
	gap: 8px;
	transition: background-color 0.3s;
	overflow: hidden;

	${({ selected }) =>
		selected
			? `
				background-color: #FAEDCD;
			`
			: `
				&:nth-child(odd) {
					background-color: white;
				}

				&:nth-child(even) {
					background-color: #f7f7f7;
				}

				&:hover {
					background-color: #fdf8ec;
					cursor: pointer;
				}

				&:active {
					background-color: #faedcd;
				}
			`}

	& * {
		pointer-events: none !important;
	}
`;

const StartConversationButton = styled.button`
	display: flex;
	flex-direction: row;
	align-items: center;
	align-self: stretch;
	justify-content: center;
	border: 0;
	padding: 16px;
	transition: background-color 0.3s;
	background-color: white;
	gap: 8px;

	&:hover {
		background-color: #fdf8ec;
		cursor: pointer;
	}

	&:active {
		background-color: #faedcd;
	}

	& * {
		pointer-events: none;
	}
`;

function ConversationEntry({ convo, user, onClick }) {
	const uiContext = useContext(contexts.UI);
	const { focusedConvoId, isMobile } = uiContext;

	const getTimeDiff = useCallback((updatedDate) => {
		const currentDate = new Date();
		return (currentDate - updatedDate) / (1000 * 60);
	}, []);

	const getTimeString = useCallback(
		(updatedAt) => {
			const updatedDate = new Date(Date.parse(updatedAt));
			const timeDiff = getTimeDiff(updatedDate);

			if (timeDiff < 1) {
				return "Now";
			} else if (timeDiff < 60) {
				return parseInt(Math.floor(timeDiff)) + " min";
			} else if (timeDiff < 60 * 24) {
				return updatedDate.toLocaleTimeString();
			} else {
				return updatedDate.toLocaleDateString();
			}
		},
		[getTimeDiff]
	);

	const [timeString, setTimeString] = useState();

	useEffect(() => {
		let timeoutId;

		function queueRefresh() {
			setTimeString(getTimeString(convo.updatedAt));

			timeoutId = setTimeout(() => {
				const timeDiff = getTimeDiff(convo.updatedAt);

				if (timeDiff < 60) {
					queueRefresh();
				}
			}, 1000 * 60);
		}

		queueRefresh();

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [convo, getTimeDiff, getTimeString]);

	return useMemo(
		() => (
			<ConversationEntryDiv
				onClick={onClick}
				selected={!isMobile && convo.id === focusedConvoId}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						fontSize: "calc(0.25em + 6px)",
						overflow: "hidden",
						gap: 8,
					}}
				>
					<label
						style={{
							flex: 1,
							minWidth: 0,
							textOverflow: "ellipsis",
							overflow: "hidden",
							whiteSpace: "nowrap",
							color: "#B3C186",
						}}
					>
						{
							convo.users
								.filter((u) => user && u.id !== user.id)
								.map((u) => u.username)
								.join(", ")

							// convo.users.filter(
							// 	(u) => u.id === convo.messages[0].userId
							// )[0].username
						}
					</label>
					<div
						style={{
							minWidth: "auto",
						}}
					>
						<label>{timeString}</label>
					</div>
				</div>
				<div
					style={{
						// display: "flex",
						display: "inline-block",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						fontSize: "calc(0.25em + 10px)",
					}}
				>
					{
						convo.users.filter(
							(u) => u.id === convo.messages[0].userId
						)[0].username
					}
					:&nbsp;{convo.messages[0].content}
				</div>
			</ConversationEntryDiv>
		),
		[focusedConvoId, isMobile, convo, user, timeString, onClick]
	);
}

function ConversationManager() {
	const redirect = useRedirect();

	const userContext = useContext(contexts.User);
	const uiContext = useContext(contexts.UI);

	const { user, conversations } = userContext;

	const setFocusedConversation = useCallback((convo) => {
		uiContext.setState({
			focusedConvoId: convo.id,
		});

		redirect("chat");
	}, []);

	const onNewChatButtonClicked = useCallback(() => {
		uiContext.setState({
			focusedConvoId: null,
			focusedUserId: null,
		});

		redirect("chat");
	}, [redirect]);

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					position: "relative",
					flexDirection: "column",
					backgroundColor: "#eee",
					overflow: "auto",
					gap: 1,
					flex: "1 1 256px",
				}}
			>
				<div
					style={{
						flex: 1,
						width: "100%",
					}}
				>
					{conversations.length > 0 ? (
						conversations.map((convo, i) => (
							<ConversationEntry
								key={i}
								convo={convo}
								user={user}
								onClick={setFocusedConversation.bind(
									null,
									convo
								)}
							/>
						))
					) : (
						<label>No conversations.</label>
					)}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<StartConversationButton onClick={onNewChatButtonClicked}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							className="bi bi-plus-circle"
							viewBox="0 0 16 16"
						>
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
							<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
						</svg>

						<label>New Chat</label>
					</StartConversationButton>
				</div>
			</div>
		),
		[conversations, user, setFocusedConversation, onNewChatButtonClicked]
	);
}

export default ConversationManager;
