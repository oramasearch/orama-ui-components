/* eslint-disable */
import { create, insertMultiple } from "@orama/orama";
import { pluginSecureProxy } from "@orama/plugin-secure-proxy";

export const createOSSInstance = () => {
	try {
		const db = create({
			schema: {
				title: "string",
				description: "string",
				embeddings: "vector[384]",
			},
			plugins: [
				pluginSecureProxy({
					apiKey: "uir4ywya-ufD86TQr6RpEp6zFeux_79N",
					embeddings: {
						defaultProperty: "embeddings",
						model: "orama/gte-small",
						onInsert: {
							generate: true,
							properties: ["title", "description"],
							verbose: false,
						},
					},
					chat: {
						model: "openai/gpt-4o",
					},
				}),
			],
		});

		insertMultiple(db, [
			{ title: "Hello world", description: "This is a test" },
			{ title: "Hello world 2", description: "This is a test 2" },
			{ title: "Hello world 3", description: "This is a test 3" },
			{ title: "Hello world 4", description: "This is a test 4" },
			{ title: "Hello world 5", description: "This is a test 5" },
			{ title: "Hello world 6", description: "This is a test 6" },
		]);

		return db
	} catch (e: any) {
		console.error(e);
	}
}