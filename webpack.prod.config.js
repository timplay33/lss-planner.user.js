const path = require("path");

module.exports = {
	mode: "production", // Set mode to 'development' or 'production'
	entry: "./src/core.ts", // Entry point of your TypeScript code
	output: {
		filename: "core.js", // Output bundle file
		path: path.resolve(__dirname, "dist"), // Output directory
	},
	resolve: {
		extensions: [".ts", ".js", ".html"], // Resolve TypeScript, JavaScript and template files
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				type: "asset/source",
			},
			{
				test: /\.ts$/, // Apply ts-loader for .ts files
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
