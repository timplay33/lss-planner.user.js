const path = require("path");

module.exports = {
	mode: "development", // Set mode to 'development' or 'production'
	entry: "./src/core.ts", // Entry point of your TypeScript code
	devtool: "source-map",
	output: {
		filename: "core.js", // Output bundle file
		path: path.resolve(__dirname, "dist"), // Output directory
		publicPath: "/dist/",
	},
	resolve: {
		extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript files
	},
	module: {
		rules: [
			{
				test: /\.ts$/, // Apply ts-loader for .ts files
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	devServer: {
		host: "127.0.0.1",
		port: 5500,
		allowedHosts: "all",
		static: {
			directory: path.resolve(__dirname),
			publicPath: "/",
		},
		devMiddleware: {
			publicPath: "/dist/",
		},
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
	},
};
