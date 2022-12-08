import { useContext, useMemo } from "react";
import contexts from "src/contexts";
import useRespondFriendRequest from "src/js/hooks/useRespondFriendRequest";
import styled from "styled-components";
import UserCard from "./UserCard";

const RequestEntry = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	&:nth-child(odd) {
		background-color: white;
	}

	&:nth-child(even) {
		background-color: #f7f7f7;
	}
`;

const ResponseButton = styled.button`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	background-color: transparent;
	padding: 4px;
	border: 2px solid ${({ focusedColor }) => focusedColor};
	border-radius: 4px;

	transition: background-color 0.3s;

	&:hover {
		background-color: ${({ hoveredColor }) => hoveredColor};
		cursor: pointer;
	}
	&:active {
		background-color: ${({ focusedColor }) => focusedColor};
	}
`;

function FriendRequests() {
	const userContext = useContext(contexts.User);
	const { receivedFriendRequests } = userContext;

	const respondFriendRequest = useRespondFriendRequest();

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					overflow: "auto",
				}}
			>
				<div>
					{receivedFriendRequests.length > 0 ? (
						receivedFriendRequests.map((user, i) => (
							<RequestEntry key={i}>
								<UserCard style={{ flex: 1 }} user={user} />
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "stretch",
										justifyContent: "center",
										fontSize: "calc(6px + 0.25em)",
										gap: 8,
										margin: 8,
									}}
								>
									<ResponseButton
										onClick={respondFriendRequest.bind(
											null,
											user,
											true
										)}
										hoveredColor={"#E9EDC9"}
										focusedColor={"#CCD5AE"}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-check-lg"
											viewBox="0 0 16 16"
										>
											<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
										</svg>
									</ResponseButton>
									<ResponseButton
										onClick={respondFriendRequest.bind(
											null,
											user,
											false
										)}
										hoveredColor={"#faedcd"}
										focusedColor={"#f6dea2"}
									>
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
									</ResponseButton>
								</div>
							</RequestEntry>
						))
					) : (
						<label>No friend requests.</label>
					)}
				</div>
			</div>
		),
		[receivedFriendRequests, respondFriendRequest]
	);
}

export default FriendRequests;
