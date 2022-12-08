import { createContext } from "react";
import { SharedContextProvider } from "@yaoc1996/react-tools";

const contextDefinitions = {
	Auth: {
		token: null,
		socketAPI: null,
		isAuthenticating: true,
	},
	User: {
		user: null,
		friends: [],
		sentFriendRequests: [],
		receivedFriendRequests: [],
		conversations: [],
	},
	UI: {
		focusedConvoId: null,
		focusedUserId: null,
		isMobile: true,
		selectedTab: "chat",
	},
};

const contexts = {
	Auth: createContext(contextDefinitions.Auth),
	User: createContext(contextDefinitions.User),
	UI: createContext(contextDefinitions.UI),
};

const GlobalContextProvider = Object.keys(contexts).reduce(
	(PrevComponent, name) => {
		return (props) => (
			<SharedContextProvider
				context={contexts[name]}
				initial={contextDefinitions[name]}
			>
				<PrevComponent {...props} />
			</SharedContextProvider>
		);
	},
	(props) => props.children
);

export default contexts;
export { GlobalContextProvider };
