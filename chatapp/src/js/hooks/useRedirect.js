import { useCallback, useContext } from "react";
import contexts from "src/contexts";

function useRedirect() {
	const uiContext = useContext(contexts.UI);

	const { isMobile } = uiContext;

	return useCallback(
		(type) => {
			switch (type) {
				case "chat":
					if (isMobile) {
						uiContext.setState({
							selectedTab: "chat",
						});
					}

					break;
				case "search":
					uiContext.setState({
						selectedTab: "search",
					});

					break;
				default:
					throw new Error("Invalid redirect type.");
			}
		},
		[isMobile]
	);
}

export default useRedirect;
