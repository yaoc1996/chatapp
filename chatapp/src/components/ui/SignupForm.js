import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "src/api";
import { clientRoutes, tokenStorageKey } from "src/config";
import contexts from "src/contexts";
import { setStorage } from "src/js/cache";
import Button from "./Button";
import Input from "./Input";

function SignupForm() {
	const authContext = useContext(contexts.Auth);

	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState("");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");

	const onSignupButtonClicked = useCallback(
		(e) => {
			e.preventDefault();

			setIsPending(true);

			new Promise((resolve, reject) => {
				if (password !== confirm) {
					reject(new Error("Password confirmation failed."));
				} else if (!username || !password) {
					reject(new Error("Username or password cannot be empty."));
				} else {
					resolve(
						signup(username, password).then((res) => {
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
		[username, password, confirm]
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
				<div style={{ width: 256 }}>
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
							<Input
								placeholder="Confirm Password"
								type="password"
								value={confirm}
								disabled={isPending}
								onInput={(e) => setConfirm(e.target.value)}
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
								onClick={onSignupButtonClicked}
								disabled={isPending}
							>
								Signup
							</Button>
						</div>
					</form>
					<div>
						<Link to={clientRoutes.login}>
							Login with existing account.
						</Link>
					</div>
				</div>
			</div>
		),
		[error, isPending, onSignupButtonClicked, username, password, confirm]
	);
}

export default SignupForm;
