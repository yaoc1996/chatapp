import { useCallback, useContext, useMemo } from "react";
import contexts from "src/contexts";
import useRedirect from "src/js/hooks/useRedirect";
import styled from "styled-components";
import UserCard from "./UserCard";

const FriendListDiv = styled.div`
	display: flex;
	flex-direction: column;
	overflow: auto;
`;

const FriendUserCard = styled(UserCard)`
	transition: background-color 0.3s;

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

	& * {
		pointer-events: none !important;
	}
`;

const ClickableLabel = styled.label`
	text-decoration: underline;

	&:hover {
		cursor: pointer;
	}
`;

function FriendList() {
	const redirect = useRedirect();

	const userContext = useContext(contexts.User);
	const uiContext = useContext(contexts.UI);

	const { friends } = userContext;
	const { focusedConvoId, focusedUserId } = uiContext;

	const onUserClicked = useCallback(
		(user) => {
			uiContext.setState({
				focusedUserId: user.id,
			});

			redirect("chat");
		},
		[redirect]
	);

	const onUserDragged = useCallback(
		(user, e) => {
			if (focusedConvoId || focusedUserId) {
				e.preventDefault();
			} else {
				e.dataTransfer.setData("user-data", JSON.stringify({ user }));
			}
		},
		[focusedConvoId, focusedUserId]
	);

	const onSearchUserButtonClicked = useCallback(() => {
		redirect("search");
	}, [redirect]);

	return useMemo(
		() => (
			<FriendListDiv>
				<div>
					{friends.length > 0 ? (
						friends.map((friend, i) => (
							<FriendUserCard
								key={i}
								user={friend}
								onClick={onUserClicked.bind(null, friend)}
								onDragStart={onUserDragged.bind(null, friend)}
								draggable={true}
							/>
						))
					) : (
						<ClickableLabel onClick={onSearchUserButtonClicked}>
							Search for users.
						</ClickableLabel>
					)}
				</div>
			</FriendListDiv>
		),
		[friends, onUserClicked, onUserDragged, onSearchUserButtonClicked]
	);
}

export default FriendList;
