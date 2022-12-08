import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { searchUsers, sendFriendRequest } from "src/api";
import contexts from "src/contexts";
import useSearchUsers from "src/js/hooks/useSearchUsers";
import useSendFriendRequest from "src/js/hooks/useSendFriendRequest";
import styled from "styled-components";
import UserCard from "./UserCard";

const SearchEntry = styled.div`
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

const RequestButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: calc(6px + 0.25em);
	padding: 4px;
	margin: 8px;
	border: 2px solid #f6dea2;
	background-color: transparent;
	border-radius: 4px;

	transition: background-color 0.3s;

	&:hover {
		background-color: #faedcd;
		cursor: pointer;
	}
	&:active {
		background-color: #f6dea2;
	}
`;

const Input = styled.input.attrs(({}) => ({}))`
	font-size: calc(10px + 0.25em);
	outline: none;
	text-align: left;
	color: #333;
	display: flex;
	padding: 8px 16px;
	border: 0;
	background-color: #eee;
`;

function UserSearch() {
	const [searchString, setSearchString] = useState("");
	const sendFriendRequest = useSendFriendRequest();

	const userContext = useContext(contexts.User);

	const { user, friends, sentFriendRequests } = userContext;

	const friendMap = useMemo(
		() =>
			friends.reduce((map, friend) => {
				map[friend.id] = friend;
				return map;
			}, {}),
		[friends]
	);

	const sentFriendRequestMap = useMemo(
		() =>
			sentFriendRequests.reduce((map, friendRequest) => {
				map[friendRequest.id] = friendRequest;
				return map;
			}, {}),
		[sentFriendRequests]
	);

	const onSearchStringInput = useCallback((e) => {
		setSearchString(e.target.value);
	}, []);

	const [searchResults, isSearching] = useSearchUsers(searchString);

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					position: "relative",
					flexDirection: "column",
					overflow: "auto",
					gap: 1,
					backgroundColor: "#eee",
				}}
			>
				<div
					style={{
						display: "flex",
						position: "relative",
						flexDirection: "column",
						padding: 8,
						backgroundColor: "white",
					}}
				>
					<Input
						placeholder={"Search Users"}
						onInput={onSearchStringInput}
						value={searchString}
					/>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						color: "black",
						overflow: "auto",
					}}
				>
					<div>
						{isSearching ? (
							<label>Searching...</label>
						) : searchResults.length > 0 ? (
							searchResults
								.filter(
									(resultUser) =>
										user && user.id !== resultUser.id
								)
								.map((user, i) => {
									const { id } = user;
									return (
										<SearchEntry key={i}>
											<UserCard
												user={user}
												style={{
													flex: 1,
												}}
											/>
											<div
												style={{
													display: "flex",
													flexDirection: "row",
												}}
											>
												{Object.hasOwn(
													friendMap,
													id
												) ? (
													<label
														style={{
															backgroundColor:
																"#B3C186",
															padding: "4px 8px",
															fontSize:
																"calc(6px + 0.25em)",
															margin: 8,
															borderRadius: 4,
														}}
													>
														Friend
													</label>
												) : Object.hasOwn(
														sentFriendRequestMap,
														id
												  ) ? (
													<label
														style={{
															backgroundColor:
																"#f6dea2",
															padding: "4px 8px",
															fontSize:
																"calc(6px + 0.25em)",
															margin: 8,
															borderRadius: 4,
														}}
													>
														Requested
													</label>
												) : (
													<RequestButton
														onClick={sendFriendRequest.bind(
															null,
															user
														)}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															fill="currentColor"
															className="bi bi-plus-lg"
															viewBox="0 0 16 16"
														>
															<path
																fillRule="evenodd"
																d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
															/>
														</svg>
													</RequestButton>
												)}
											</div>
										</SearchEntry>
									);
								})
						) : searchString ? (
							<label>No results.</label>
						) : null}
					</div>
				</div>
			</div>
		),
		[
			onSearchStringInput,
			sendFriendRequest,
			searchString,
			searchResults,
			isSearching,
			user,
			friendMap,
			sentFriendRequestMap,
		]
	);
}

export default UserSearch;
