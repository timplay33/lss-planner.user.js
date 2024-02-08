const path = require("path");

module.exports = {
	mode: "production", // Set mode to 'development' or 'production'
	entry: "./src/core.ts", // Entry point of your TypeScript code
	output: {
		filename: "core.js", // Output bundle file
		path: path.resolve(__dirname, "dist"), // Output directory
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
};
