import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";

function Logon() {
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [isLoggingOn, setIsLoggingOn] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setAuthError("");
		setIsLoggingOn(true);

		try {
			const result = await login(email, password);

			if (!result.success) {
				setAuthError(result.error);
			}
		} catch (error) {
			setAuthError("Unable to log in.");
		} finally {
			setIsLoggingOn(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{authError && <p>{authError}</p>}

			<label htmlFor="email">Email</label>
			<input
				id="email"
				type="email"
				value={email}
				onChange={(event) => setEmail(event.target.value)}
				required
			/>

			<label htmlFor="password">Password</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
				required
			/>

			<button
				type="submit"
				disabled={isLoggingOn}
			>
				{isLoggingOn ? "Logging in..." : "Log In"}
			</button>
		</form>
	);
}

export default Logon;
