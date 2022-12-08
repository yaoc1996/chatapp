import WSARouter from "./ws-api-router";

class WebSocketAPI {
	constructor(socket) {
		this.socket = socket;
	}

	send(route, body) {
		this.socket.send(
			JSON.stringify({
				route,
				body,
			})
		);
	}
}

class WebSocketApp extends WSARouter {
	constructor() {
		super();
	}

	connect(socket, { authentication }) {
		return new Promise((resolve, reject) => {
			socket.onopen = (e) => {
				const context = new WebSocketAPI(socket);

				socket.onmessage = (message) => {
					if (message.data === "Success") {
						socket.onmessage = (message) => {
							const { route, body } = JSON.parse(message.data);
							this.recv(context, route, { body });
						};

						resolve(context);
					} else {
						reject(new Error("Failed to connect to socket."));
					}
				};

				if (authentication) {
					socket.send(authentication);
				}
			};
		});
	}
}

export { WSARouter, WebSocketApp };
