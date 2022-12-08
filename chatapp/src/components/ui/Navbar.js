import { useCallback, useContext, useMemo } from "react";
import { tokenStorageKey } from "src/config";
import contexts from "src/contexts";
import { removeStorage } from "src/js/cache";
import styled from "styled-components";
import UserCard from "./UserCard";

const LogoutButton = styled.div.attrs(({}) => ({
	children: (
		<>
			<label>Logout</label> &nbsp;
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				className="bi bi-box-arrow-right"
				viewBox="0 0 16 16"
			>
				<path
					fillRule="evenodd"
					d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
				/>
				<path
					fillRule="evenodd"
					d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
				/>
			</svg>
		</>
	),
}))`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	align-self: center;
	border: none;
	background-color: white;
	color: #333;
	transition: background-color 0.3s;
	padding: 4px 16px;
	border-top-right-radius: 26px;
	border-bottom-right-radius: 26px;

	&:hover {
		cursor: pointer;
		background-color: #e9edc9;
	}

	&:active {
		background-color: #ccd5ae;
	}

	& > * {
		pointer-events: none;
	}
`;

function Navbar() {
	const authContext = useContext(contexts.Auth);
	const userContext = useContext(contexts.User);

	const { user } = userContext;

	const onLogoutButtonClicked = useCallback(() => {
		removeStorage(tokenStorageKey);

		window.location.reload();
	}, []);

	return useMemo(() => {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					backgroundColor: "white",
					// backgroundColor: "#CCD5AE",
					alignItems: "center",
					padding: "8px",
				}}
			>
				<label
					style={{
						display: "flex",
						fontSize: "20px",
						color: "#B3C186",
						padding: "10px 16px",
						alignSelf: "stretch",
						borderRadius: 8,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					Chatapp
				</label>
				<div style={{ flex: 1 }} />
				<div
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							backgroundColor: "#ddd",
							gap: 1,
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "white",
								padding: "4px 16px",
							}}
						>
							<label
								style={{
									color: "#B3C186",
								}}
							>
								{user?.username}
							</label>
						</div>
						<div style={{ backgroundColor: "white" }}>
							<LogoutButton onClick={onLogoutButtonClicked} />
						</div>
					</div>
				</div>
			</div>
		);
	}, [onLogoutButtonClicked, user]);
}

export default Navbar;
