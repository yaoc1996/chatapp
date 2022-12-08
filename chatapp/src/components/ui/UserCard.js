import { useMemo } from "react";
import styled from "styled-components";
import UserIcon from "./UserIcon";

const UserCardDiv = styled.div`
	display: flex;
	flex-direction: row;
	padding: 8px;
	gap: 8px;
	align-items: center;
`;

function UserCard({ user, iconStyles, labelStyles, ...props }) {
	return (
		<UserCardDiv {...props}>
			<UserIcon user={user} style={iconStyles} />
			<label
				style={{
					...labelStyles,
				}}
			>
				{user?.username}
			</label>
		</UserCardDiv>
	);
}

export default UserCard;
