import styled from "styled-components";

const InputContent = styled.input`
	flex: 1 1 auto;
	min-width: 0;
	outline: none;
	border: 0;
	padding: calc(6px + 0.25rem);
	border-radius: 4px;
	font-size: inherit;
	transition: background 0.3s, color 0.3s, border 0.3s;
	z-index: 1;
	background-color: transparent;

	border: 1px solid #aaa;

	&:focus {
		outline: none;
		border: 1px solid #ccd5ae;
	}
`;

const Input = styled.div.attrs(({ value, placeholder, ...props }) => ({
	value,
	children: <InputContent {...props} />,
}))`
	display: flex;
	position: relative;
	flex: 1 1 auto;
	font-size: calc(10px + 0.25em);

	&::after {
		content: attr(placeholder);
		position: absolute;
		// transform: translate(-2px, 0px);
		transition: background 0.3s, color 0.3s, bottom 0.3s, font-size 0.3s,
			z-index 0.3s;
		pointer-events: none;
	}

	${({ value }) =>
		value
			? `
                &::after {
                    font-size: 0.9em;
                    bottom: calc(100% - 0.5em);
                    left: calc(6px + 0.25rem);
                    padding: 0 2px;
                    transform: translate(-2px, 0);
                    background: white;
                    color: #333;
                    z-index: 1;
                }
            `
			: `
                &::after {
                    bottom: calc(6px + 0.25rem);
                    left: calc(6px + 0.25rem);
                    padding: 0;
                    color: #ccc;
                    z-index: 0;
                }
    `}// background-color: ${({ value }) => (value ? "blue" : "red")};
`;

export default Input;
