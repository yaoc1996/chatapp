import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

const TabButton = styled.div.attrs(({ selected }) => ({
	style: {
		flexGrow: selected ? 4 : 1,
	},
}))`
	display: flex;
	align-items: center;
	justify-content: center;
	color: #333;
	background-color: ${({ selected }) => (selected ? "#FAEDCD" : "#f0f0f0")};
	transition: flex-grow 0.3s, background-color 0.3s;
	padding: 16px;

	${({ selected }) =>
		!selected &&
		`
		&:hover {
			background-color: #fdf8ec;
			cursor: pointer;
		}
		&:active {
			background-color: #faedcd;
			cursor: pointer;
		}
	`}
`;

function TabControl({ defaultTab, value, tabs, icons, components, onSelect }) {
	const [localSelected, setLocalSelected] = useState(defaultTab || tabs[0]);

	console.log(value);

	const selected = useMemo(
		() => value || localSelected,
		[value, localSelected]
	);

	console.log("selected", selected);

	const options = useMemo(() => {
		const options = {};

		for (let i = 0; i < tabs.length; ++i) {
			options[tabs[i]] = components[i];
		}

		return options;
	}, [tabs, components]);

	// const values = useMemo(() => options.values(), [options]);

	const selectedComponent = useMemo(
		() => options[selected],
		[options, selected]
	);

	const onTabClicked = useCallback((tab) => {
		setLocalSelected(tab);
		onSelect?.call(null, tab);
	}, []);

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					overflow: "auto",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						backgroundColor: "white",
						gap: 1,
						overflow: "auto",
					}}
				>
					{tabs.map((tab, i) => (
						<TabButton
							key={i}
							selected={tab === selected}
							onClick={onTabClicked.bind(null, tab)}
						>
							{(icons && icons[i]) || tab}
						</TabButton>
					))}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						overflow: "auto",
						flex: 1,
					}}
				>
					{selectedComponent}
				</div>
			</div>
		),
		[selected, tabs, icons, selectedComponent, onTabClicked]
	);
}

export default TabControl;
