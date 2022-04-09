import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
	type Query {
		hello: String
	}
`;

// Provide resolver functions for your schema fields
const resolvers = {
	Query: {
		hello: () => 'Hello world!',
	},
};

async function startApolloServer(typeDefs, resolvers) {
	// Required logic for integrating with Express
	const app = express();
	const httpServer = http.createServer(app);

	// Same ApolloServer initialization as before, plus the drain plugin.
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	// More required logic for integrating with Express
	await server.start();
	server.applyMiddleware({
		app,

		// By default, apollo-server hosts its GraphQL endpoint at the
		// server root. However, *other* Apollo Server packages host it at
		// /graphql. Optionally provide this to match apollo-server.
		path: '/',
	});

	// Modified server startup
	await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
