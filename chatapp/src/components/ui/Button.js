import styled from "styled-components";

const Button = styled.button`
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
	border: 1px solid #ccc;
	border-radius: 4px;

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

export default Button;
