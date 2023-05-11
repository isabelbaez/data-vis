export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.236255f6.js","app":"_app/immutable/entry/app.776faf66.js","imports":["_app/immutable/entry/start.236255f6.js","_app/immutable/chunks/index.1a7c1a28.js","_app/immutable/chunks/singletons.d7c61bb9.js","_app/immutable/entry/app.776faf66.js","_app/immutable/chunks/index.1a7c1a28.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
