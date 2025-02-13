/* eslint-disable */
import {AnyOrama, AnySchema, create, insertMultiple} from "@orama/orama";
import {pluginSecureProxy} from "@orama/plugin-secure-proxy";

const DOCS_PRESET_SCHEMA: AnySchema = {
	title: 'string',
	content: 'string',
	path: 'string',
	section: 'string',
	category: 'enum',
	version: 'enum'
}

export const createOSSInstance = async () => {
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
					onInsert: {
						generate: true,
						properties: ['title', 'content'],
						verbose: false
					},
				},
				chat: {
					model: "openai/gpt-4o",
				},
			})
		]
	})

	await insertMultiple(db, Object.values(parsedDeflated.docs.docs))

	return db
}