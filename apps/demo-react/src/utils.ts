/* eslint-disable */
import {AnyOrama, AnySchema, create, insert, insertMultiple, search} from "@orama/orama";
import {pluginSecureProxy} from "@orama/plugin-secure-proxy";

const DOCS_PRESET_SCHEMA: AnySchema = {
	title: 'string',
	content: 'string',
	path: 'string',
	section: 'string',
	category: 'enum',
	version: 'enum'
}

/*export const createOSSInstance = async () => {
	const response = await fetch('./orama-search-index-current.json.gz')
	const buffer = await response.arrayBuffer()
	const decoder = new TextDecoder();
	const deflated = decoder.decode(buffer);
	const parsedDeflated = JSON.parse(deflated)

	const db: AnyOrama = create({
		schema: {...DOCS_PRESET_SCHEMA, version: 'enum'},
		plugins: [
			pluginSecureProxy({
				apiKey: "uir4ywya-ufD86TQr6RpEp6zFeux_79N",
				embeddings: {
					model: "orama/gte-small",
					defaultProperty: "embeddings",
				},
				chat: {
					model: "openai/gpt-3.5-turbo",
				},
			})
		]
	})

	insertMultiple(db, Object.values(parsedDeflated.docs.docs))

	console.log("===DEBUG===", db)

	const searchResult = await search(db, {
		term: "tutorial",
	});

	console.log(searchResult.hits.map((hit) => hit.document));

	return db
}*/

export const createOSSInstance = async () => {
	const db = create({
		schema: {
			name: "string",
			description: "string",
			price: "number",
			meta: {
				rating: "number",
			},
		},
		plugins: [
			pluginSecureProxy({
				apiKey: "uir4ywya-ufD86TQr6RpEp6zFeux_79N",
				embeddings: {
					model: "orama/gte-small",
					defaultProperty: "embeddings",
				},
				chat: {
					model: "openai/gpt-3.5-turbo",
				},
			})
		]
	});

	insert(db, {
		name: "Wireless Headphones",
		description:
			"Experience immersive sound quality with these noise-cancelling wireless headphones.",
		price: 99.99,
		meta: {
			rating: 4.5,
		},
	});

	const searchResult = await search(db, {
		term: "headphones",
	});

	console.log("===DEBUG===", searchResult)

	console.log(searchResult.hits.map((hit) => hit.document));

	return null
}
