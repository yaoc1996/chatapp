import "./App.css";

import { Routes, Route } from "react-router-dom";
import { clientRoutes, tokenStorageKey } from "src/config";
import LoginForm from "src/components/ui/LoginForm";
import SignupForm from "src/components/ui/SignupForm";
import contexts, { GlobalContextProvider } from "./contexts";
import Dashboard from "./components/ui/Dashboard";
import Services from "./components/service";
import Blur from "./components/ui/Blur";
import { useContext, useEffect, useMemo } from "react";
import { WebSocketApp, WSARouter } from "./js/ws-api-client";
import { getStorage } from "./js/cache";

function withGlobalContextProvider(App) {
	return (props) => (
		<GlobalContextProvider>
			<App {...props} />
		</GlobalContextProvider>
	);
}

function App() {
	const authContext = useContext(contexts.Auth);
	const { isAuthenticating } = authContext;

	return useMemo(
		() => (
			<div className="App">
				<Blur active={isAuthenticating}>
					<header className="App-header">
						<Services />
						<Routes>
							<Route
								path={clientRoutes.login}
								element={<LoginForm />}
							></Route>
							<Route
								path={clientRoutes.signup}
								element={<SignupForm />}
							></Route>
							<Route
								path={clientRoutes.dashboard}
								element={<Dashboard />}
							></Route>
							<Route path="*" element={<LoginForm />}></Route>
						</Routes>
					</header>
				</Blur>
			</div>
		),
		[isAuthenticating]
	);
}

export default withGlobalContextProvider(App);
