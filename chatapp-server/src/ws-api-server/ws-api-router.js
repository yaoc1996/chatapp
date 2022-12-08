function normalizeRoute(route) {
	if (route.length > 0 && route[0] !== "/") {
		route = "/" + route;
	}

	if (route.length > 0 && route[route.length - 1] === "/") {
		route = route.slice(0, -1);
	}

	return route;
}

const MiddlewareType = {
	Bridge: 0,
	Endpoint: 1,
};

function* ArrayIterator(array) {
	for (const item of array) {
		yield item;
	}
}

function isString(obj) {
	return typeof obj === "string" || obj instanceof String;
}

class WSARouter {
	constructor() {
		this.middlewares = [];
	}

	use(...middleware) {
		this.middlewares.push([MiddlewareType.Bridge, ...middleware]);
	}

	on(route, ...middleware) {
		this.middlewares.push([MiddlewareType.Endpoint, route, ...middleware]);
	}

	recvMiddlewaresHelper(middlewareIterator, socket, route, data, next) {
		const { value, done } = middlewareIterator.next();

		if (!done) {
			this.recvMiddlewareCallback(value, socket, route, data, (error) => {
				if (error) {
					console.error("ChatappError: ", error);
				} else {
					this.recvMiddlewaresHelper(
						middlewareIterator,
						socket,
						route,
						data,
						next
					);
				}
			});
		} else {
			if (next) {
				next();
			}
		}
	}

	recvMiddlewareCallback(middleware, socket, route, data, next) {
		if (Array.isArray(middleware)) {
			if (isString(middleware[1])) {
				const [type, middlewareRoute, ...middlewares] = middleware;

				switch (type) {
					case MiddlewareType.Endpoint:
						if (route === middlewareRoute) {
							this.recvMiddlewaresHelper(
								ArrayIterator(middlewares),
								socket,
								"",
								data,
								next
							);
						} else {
							next();
						}
						break;
					case MiddlewareType.Bridge:
						if (
							middlewareRoute.length <= route.length &&
							route.slice(0, middlewareRoute.length) ===
								middlewareRoute &&
							(route.length === middlewareRoute.length ||
								route[middlewareRoute.length] === "/")
						) {
							this.recvMiddlewaresHelper(
								ArrayIterator(middlewares),
								socket,
								route.slice(middlewareRoute.length),
								data,
								next
							);
						} else {
							next();
						}
						break;
				}
			} else {
				this.recvMiddlewaresHelper(
					ArrayIterator(middleware.slice(1)),
					socket,
					route,
					data,
					next
				);
			}
		} else {
			if (middleware instanceof WSARouter) {
				middleware.recv(socket, route, data, next);
			} else {
				middleware(data, socket, next);
			}
		}
	}

	recv(socket, route, data, next) {
		route = normalizeRoute(route);

		this.recvMiddlewaresHelper(
			ArrayIterator(this.middlewares),
			socket,
			route,
			data,
			next
		);
	}
}

module.exports = WSARouter;
