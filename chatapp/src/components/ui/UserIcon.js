import { useMemo } from "react";

function UserIcon({ user }) {
	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 48,
					height: 48,
					// backgroundColor: "#FEFAE0",
					backgroundColor: "#CCD5AE",
					borderRadius: "50%",
					color: "white",
					border: "1px solid #ccc",
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="100%"
					height="100%"
					fill="currentColor"
					className="bi bi-person-circle"
					viewBox="0 0 16 16"
				>
					<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
					<path
						fillRule="evenodd"
						d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
					/>
				</svg>
				{/* {user?.username[0]?.toUpperCase()} */}
			</div>
		),
		[user]
	);
}

export default UserIcon;
