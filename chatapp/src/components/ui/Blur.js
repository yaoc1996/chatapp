import { useMemo } from "react";

function Blur({ active, children }) {
	return useMemo(
		() => (
			<div
				style={{
					filter: `blur(${active ? 4 : 0}px)`,
					overflow: "auto",
					// transition: "filter ease-in 0.3s",
				}}
			>
				{active && (
					<div
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							backgroundColor: "black",
							opacity: 0.7,
							zIndex: 1,
						}}
					></div>
				)}
				{children}
			</div>
		),
		[active]
	);
}

export default Blur;
