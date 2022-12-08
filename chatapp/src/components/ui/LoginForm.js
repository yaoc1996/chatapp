import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { login } from "src/api";
import { clientRoutes, tokenStorageKey } from "src/config";
import contexts from "src/contexts";
import { setStorage } from "src/js/cache";
import Button from "./Button";
import Input from "./Input";

function LoginForm() {
	const authContext = useContext(contexts.Auth);

	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onLoginButtonClicked = useCallback(
		(e) => {
			e.preventDefault();
			setIsPending(true);

			new Promise((resolve, reject) => {
				if (!username || !password) {
					reject(new Error("Username or password cannot be empty."));
				} else {
					resolve(
						login(username, password).then((res) => {
							setStorage(tokenStorageKey, res);
							authContext.setState({
								token: res,
							});
						})
					);
				}
			})
				.catch((err) => {
					setError(err.message);
				})
				.finally(() => {
					setIsPending(false);
				});
		},
		[username, password]
	);

	return useMemo(
		() => (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<h1
					style={{
						display: "flex",
						// border: "2px solid #ccd5ae",
						color: "#B3C186",
						padding: "10px 16px",
						alignSelf: "stretch",
						borderRadius: 8,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					Chatapp
				</h1>
				<div
					style={{
						width: 256,
					}}
				>
					<form
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 16,
						}}
					>
						<div>
							<Input
								placeholder="Username"
								type="text"
								value={username}
								disabled={isPending}
								onInput={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div>
							<Input
								placeholder="Password"
								type="password"
								value={password}
								disabled={isPending}
								onInput={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div>
							<label style={{ color: "red" }}>{error}</label>
						</div>
						<div
							style={{
								alignSelf: "center",
							}}
						>
							<Button
								type="submit"
								onClick={onLoginButtonClicked}
								disabled={isPending}
							>
								Login
							</Button>
						</div>
					</form>
					<div>
						<Link to={clientRoutes.signup}>
							Register as a new user.
						</Link>
					</div>
				</div>
			</div>
		),
		[isPending, error, username, password, onLoginButtonClicked]
	);
}

export default LoginForm;
