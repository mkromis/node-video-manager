import { createCookieSessionStorage } from "@remix-run/node";

export function getCookieSessionStorage(sessionSecret: string) {
	return createCookieSessionStorage({
		cookie: {
			name: "nvm_session",
			sameSite: "lax",
			path: "/",
			httpOnly: true,
			secrets: [sessionSecret],
			//TODO: enable if your nas has a signed cert, else cookies wont save
			// secure: import.meta.env.PROD,
			secure: false,
		},
	});
}
