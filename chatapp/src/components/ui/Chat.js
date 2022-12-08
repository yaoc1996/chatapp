import { wrap } from "lodash";
import {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import contexts from "src/contexts";
import useFetchConversationHistory from "src/js/hooks/useFetchConversationHistory";
import useSearchUsers from "src/js/hooks/useSearchUsers";
import useSendMessage from "src/js/hooks/useSendMessage";
import styled from "styled-components";

const charCode_0 = "0".charCodeAt(0);
const charCode_9 = "9".charCodeAt(0);
const charCode_a = "a".charCodeAt(0);
const charCode_z = "z".charCodeAt(0);
const charCode_A = "A".charCodeAt(0);
const charCode_Z = "Z".charCodeAt(0);
const charCode_Space = " ".charCodeAt(0);

const TextBubble = styled.label.attrs(({ children }) => {
	if (children instanceof String || typeof children === "string") {
		const parsed = [];
		let currentStartIndex = 0;
		let countWithoutSpace = 0;

		for (let i = 0; i < children.length; ++i) {
			const code = children.charCodeAt(i);
			if (
				countWithoutSpace > 20
				// !(
				// 	(code >= charCode_0 && code <= charCode_9) ||
				// 	(code >= charCode_a && code <= charCode_z) ||
				// 	(code >= charCode_A && code <= charCode_Z) ||
				// 	code === charCode_Space
				// )
			) {
				if (currentStartIndex < i) {
					parsed.push(children.slice(currentStartIndex, i));
					currentStartIndex = i + 1;
					parsed.push(children[i]);
				}

				countWithoutSpace = 0;
			}

			if (code === charCode_Space) {
				countWithoutSpace = 0;
			} else {
				countWithoutSpace += 1;
			}
		}

		if (currentStartIndex < children.length) {
			parsed.push(children.slice(currentStartIndex, children.length));
		}

		return {
			children: parsed.map((s, i) => (
				<Fragment key={i}>{s}&#8203;</Fragment>
			)),
		};
	} else {
		throw new Error("TextBubble only accepts strings as children.");
	}
})`
	display: inline-flex;
	position: relative;
	align-items: center;
	justify-content: center;
	max-width: 80%;
	float: ${({ align }) => align};
	background-color: ${({ align }) => (align === "right" ? "#e9edc9" : "#eee")};
	margin: 8px 16px;
	padding: 6px 12px;
	border-radius: 8px;
	border-top-${({ align }) => align}-radius: 0;
	text-align: left;
	overflow-wrap: break-word;
	
	&::before {
		content: "";
		border: 6px solid ${({ align }) => (align === "right" ? "#e9edc9" : "#eee")};
		border-bottom-color: transparent;
		border-${({ align }) => align}-color: transparent;
		position: absolute;
		${({ align }) => align}: -12px;
		top: 0;
	}
`;

const SendButton = styled.button`
	display: flex;
	border: 0;
	align-self: stretch;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	padding: 0px 16px 0 12px;
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;

	transition: background-color 0.3s, color 0.3s;

	&:hover {
		cursor: pointer;
		background-color: #e9edc9;
	}

	&:active {
		background-color: #ccd5ae;
	}

	${({ disabled }) =>
		disabled
			? `
			background-color: transparent !important;
			cursor: not-allowed !important;
			color: #ccc !important;
		`
			: ""};
`;

const LocalTargetEntryDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border: 1px solid #eee;
	padding: 4px 8px;
	border-radius: 4px;
	align-self: stretch;
	color: #aaa;
	gap: 4px;

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

const SearchResultDiv = styled.div`
	transition: background-color 0.3s;

	&:nth-child(odd) {
		background-color: white;
	}

	&:nth-child(even) {
		background-color: #f7f7f7;
	}

	&:hover {
		background-color: #fefae0;
		cursor: pointer;
	}

	&:active {
		background-color: #e9edc9;
	}

	& * {
		pointer-events: none;
	}
`;

function ChatInput({ convo, chatTargetUsers, clearLocalTargets }) {
	const [content, setContent] = useState("");

	const sendMessage = useSendMessage();

	useEffect(() => {
		setContent("");
	}, [convo && convo.id]);

	const onSubmit = useCallback(
		(e) => {
			e.preventDefault();

			if (convo) {
				sendMessage(convo, null, content);
			} else {
				if (chatTargetUsers.length > 0) {
					sendMessage(null, chatTargetUsers, content);
				}
			}

			clearLocalTargets();
			setContent("");
		},
		[convo, chatTargetUsers, content, clearLocalTargets]
	);

	const onInput = useCallback((e) => {
		setContent(e.target.value);
	}, []);

	return useMemo(
		() =>
			(convo || chatTargetUsers.length > 0) && (
				<form
					onSubmit={onSubmit}
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						padding: "8px",
						gap: 8,
						backgroundColor: "white",
					}}
				>
					<input
						style={{
							flex: 1,
							padding: "8px 16px",
							border: 0,
							backgroundColor: "#eee",
						}}
						value={content}
						onInput={onInput}
					/>
					<SendButton type="submit" disabled={content === ""}>
						Send
					</SendButton>
				</form>
			),
		[convo, chatTargetUsers, onSubmit, content, onInput]
	);
}

function InfoChatHeader({ chatTargetUsers }) {
	return useMemo(
		() => (
			<label
				style={{
					display: "inline-block",
					padding: "12px 16px",
					minHeight: 52,
					lineHeight: "28px",
					backgroundColor: "white",
					color: "#99AC5D",
					textAlign: "left",
					textOverflow: "ellipsis",
					overflow: "hidden",
					whiteSpace: "nowrap",
				}}
			>
				{chatTargetUsers.map((u) => u.username).join(", ")}
			</label>
		),
		[chatTargetUsers]
	);
}

function LocalTargetEntry({ user, onClick }) {
	return useMemo(
		() => (
			<LocalTargetEntryDiv onClick={onClick}>
				<label
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#B3C186",
						alignSelf: "stretch",
					}}
				>
					{user.username}
				</label>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="bi bi-x-lg"
					viewBox="0 0 16 16"
				>
					<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
				</svg>
			</LocalTargetEntryDiv>
		),
		[user, onClick]
	);
}

function CreationChatHeader({
	chatTargetUsers,
	addLocalTarget,
	removeLocalTarget,
}) {
	const [searchString, setSearchString] = useState("");

	const userContext = useContext(contexts.User);
	const uiContext = useContext(contexts.UI);

	const { friends } = userContext;
	const { isMobile } = uiContext;

	const friendMap = useMemo(
		() =>
			friends.reduce((map, friend) => {
				map[friend.id] = friend;
				return map;
			}, {}),
		[friends]
	);

	const onSearchInput = useCallback((e) => {
		setSearchString(e.target.value);
	}, []);

	const [searchResults, isSearching] = useSearchUsers(searchString);

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					justifyContent: "center",
					backgroundColor: "#eee",
					gap: 1,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "start",
						padding: "8px",
						gap: 8,
						flexWrap: "wrap",
						backgroundColor: "white",
					}}
				>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#eee",
							padding: "4px 8px",
							borderRadius: 4,
							alignSelf: "stretch",
						}}
					>
						to:
					</label>
					{chatTargetUsers.map((user, i) => (
						<LocalTargetEntry
							key={i}
							user={user}
							onClick={removeLocalTarget.bind(null, user)}
						/>
					))}
					<input
						style={{
							flex: 1,
							// minWidth: 0,
							border: "none",
							padding: 0,
							fontSize: "calc(10px + 0.25em)",
							backgroundColor: "#eee",
							padding: "4px 8px",
							alignSelf: "stretch",
							borderRadius: 4,
						}}
						placeholder={
							isMobile
								? "Search by username."
								: "Search by username or drag from friend list."
						}
						value={searchString}
						onInput={onSearchInput}
					/>
				</div>

				{isSearching ? (
					<label
						style={{
							backgroundColor: "white",
							padding: 8,
						}}
					>
						Searching...
					</label>
				) : searchResults.length > 0 ? (
					<div
						style={{
							display: "flex",
							position: "relative",
							flexDirection: "column",
							alignItems: "stretch",
							justifyContent: "center",
							backgroundColor: "white",
							// padding: "8px",
							overflow: "auto",
						}}
					>
						<div
							style={{
								display: "flex",
								position: "relative",
								flexDirection: "column",
								alignItems: "stretch",
								justifyContent: "center",
							}}
						>
							{searchResults.map((user, i) => (
								<SearchResultDiv
									key={i}
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "start",
										justifyContent: "start",
									}}
									onClick={addLocalTarget.bind(null, user)}
								>
									<label
										style={{
											flex: 1,
											padding: "8px",
											textAlign: "left",
										}}
									>
										{user.username}
									</label>

									{friendMap[user.id] && (
										<label
											style={{
												backgroundColor: "#B3C186",
												padding: "4px 8px",
												fontSize: "calc(6px + 0.25em)",
												margin: 8,
												borderRadius: 4,
											}}
										>
											Friend
										</label>
									)}
								</SearchResultDiv>
							))}
						</div>
					</div>
				) : searchString ? (
					<label
						style={{
							backgroundColor: "white",
							padding: 8,
						}}
					>
						No results.
					</label>
				) : null}
			</div>
		),
		[
			chatTargetUsers,
			isMobile,
			searchString,
			searchResults,
			isSearching,
			friendMap,
			addLocalTarget,
			removeLocalTarget,
		]
	);
}

function ChatHeader({
	convo,
	friendTarget,
	chatTargetUsers,
	addLocalTarget,
	removeLocalTarget,
}) {
	return useMemo(() => {
		if (convo || friendTarget) {
			return <InfoChatHeader chatTargetUsers={chatTargetUsers} />;
		} else {
			return (
				<CreationChatHeader
					chatTargetUsers={chatTargetUsers}
					addLocalTarget={addLocalTarget}
					removeLocalTarget={removeLocalTarget}
				/>
			);
		}
	}, [
		convo,
		friendTarget,
		chatTargetUsers,
		addLocalTarget,
		removeLocalTarget,
	]);
}

function ChatBody({ convo, user, chatTargetUsers }) {
	const prevFirstMessageRef = useRef();
	const scrollBottomRef = useRef();
	const containerDivRef = useRef();
	const contentDivRef = useRef();

	const fetchConversationHistory = useFetchConversationHistory();

	const applyScrollBottom = useCallback(() => {
		const { height: containerHeight } =
			containerDivRef.current.getBoundingClientRect();
		const { height: contentHeight } =
			contentDivRef.current.getBoundingClientRect();

		containerDivRef.current.scrollTop =
			contentHeight - containerHeight - scrollBottomRef.current;
	}, []);

	const onScroll = useCallback(
		(e) => {
			e.preventDefault();

			const { height: containerHeight } =
				containerDivRef.current.getBoundingClientRect();
			const { height: contentHeight } =
				contentDivRef.current.getBoundingClientRect();

			scrollBottomRef.current =
				contentHeight - containerHeight - e.target.scrollTop;

			applyScrollBottom();

			if (e.target.scrollTop === 0 && contentHeight > containerHeight) {
				fetchConversationHistory(convo);
			}
		},
		[fetchConversationHistory, convo]
	);

	useLayoutEffect(() => {
		scrollBottomRef.current = 0;
		applyScrollBottom();
	}, [convo?.id]);

	useLayoutEffect(() => {
		if (convo) {
			if (convo.messages.length > 0) {
				const firstMessage = convo.messages[convo.messages.length - 1];
				if (
					scrollBottomRef.current < 24 ||
					(prevFirstMessageRef.current &&
						prevFirstMessageRef.current.id !== firstMessage.id)
				) {
					prevFirstMessageRef.current = firstMessage;
					applyScrollBottom();
				}
			}
		}
	}, [convo, applyScrollBottom]);

	return useMemo(
		() => (
			<div
				ref={containerDivRef}
				style={{
					display: "flex",
					position: "relative",
					flexDirection: "column",
					backgroundColor: "white",
					flex: 1,
					overflow: "auto",
				}}
				onScroll={onScroll}
			>
				<div
					ref={contentDivRef}
					style={{
						display: "flex",
						position: "relative",
						flexDirection: "column",
						flex: 1,
					}}
				>
					{convo ? (
						(convo.messages || [])
							.slice()
							.reverse()
							.map((message, i) => (
								<div key={i} style={{ position: "relative" }}>
									<TextBubble
										align={
											user && message.userId === user?.id
												? "right"
												: "left"
										}
									>
										{message.content}
									</TextBubble>
								</div>
							))
					) : chatTargetUsers.length > 0 ? (
						<label
							style={{
								flex: 1,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							Send a message to start the conversation.
						</label>
					) : (
						<label
							style={{
								flex: 1,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "#eee",
							}}
						></label>
					)}
				</div>
			</div>
		),
		[convo, user, onScroll, chatTargetUsers]
	);
}

function Chat() {
	const userContext = useContext(contexts.User);
	const uiContext = useContext(contexts.UI);

	const [localTargets, setLocalTargets] = useState([]);

	const { user, conversations, friends } = userContext;
	const { focusedConvoId, focusedUserId } = uiContext;

	const convo = useMemo(
		() => conversations.find((c) => c.id === focusedConvoId),
		[conversations, focusedConvoId]
	);

	const friendTarget = useMemo(
		() => friends.find((user) => user.id === focusedUserId),
		[friends, focusedUserId]
	);

	const chatTargetUsers = useMemo(
		() =>
			(convo && convo.users.filter((u) => u.id !== user.id)) ||
			(friendTarget && [friendTarget]) ||
			localTargets,
		[convo, friendTarget, localTargets]
	);

	const addLocalTarget = useCallback((user) => {
		setLocalTargets((chatTargetUsers) => {
			if (!chatTargetUsers.find((u) => u.id === user.id)) {
				return [...chatTargetUsers, user];
			} else {
				return chatTargetUsers;
			}
		});
	}, []);

	const removeLocalTarget = useCallback((user) => {
		setLocalTargets((chatTargetUsers) =>
			chatTargetUsers.filter((u) => u.id !== user.id)
		);
	}, []);

	const clearLocalTargets = useCallback(() => {
		setLocalTargets(() => []);
	}, []);

	const onUserDropped = useCallback(
		(e) => {
			const { user } = JSON.parse(e.dataTransfer.getData("user-data"));
			addLocalTarget(user);
		},
		[addLocalTarget]
	);

	const preventDragOverDefault = useCallback(
		(e) => {
			if (!convo && !friendTarget) {
				e.preventDefault();
			}
		},
		[convo, friendTarget]
	);

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					position: "relative",
					flexDirection: "column",
					backgroundColor: "#eee",
					gap: 1,
					flex: "10 1 256px",
					overflow: "auto",
				}}
				onDragOver={preventDragOverDefault}
				onDrop={onUserDropped}
			>
				<ChatHeader
					convo={convo}
					friendTarget={friendTarget}
					chatTargetUsers={chatTargetUsers}
					addLocalTarget={addLocalTarget}
					removeLocalTarget={removeLocalTarget}
				/>
				<ChatBody
					convo={convo}
					chatTargetUsers={chatTargetUsers}
					user={user}
				/>
				<ChatInput
					convo={convo}
					chatTargetUsers={chatTargetUsers}
					clearLocalTargets={clearLocalTargets}
				/>
			</div>
		),
		[
			convo,
			chatTargetUsers,
			user,
			onUserDropped,
			addLocalTarget,
			removeLocalTarget,
			clearLocalTargets,
			preventDragOverDefault,
			ChatHeader,
		]
	);
}

export default Chat;
