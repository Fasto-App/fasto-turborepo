import { defineConfig } from "cypress";

export default defineConfig({
	video: false,
	projectId: "wtruhx",
	e2e: {
		baseUrl: process.env.FRONTEND_URL || "http://localhost:3000",
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},

	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
	},
});
