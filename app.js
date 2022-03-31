require("dotenv").config();










//const express = require('express');
// const { postgraphile } = require("postgraphile");
// const knowledgeBaseRouter = require('./api/apiKnowledgeBase');

// const app = express();

// app.use(
//     postgraphile(process.env.DATABASE_URL, {
//         watchPg: true,
//         graphiql: true,
//         enhanceGraphiql: true
//     })
// );

// app.use(express.json());
    
// app.use('/knowledgebase', knowledgeBaseRouter);

// let port = process.env.PORT || 1000;
// var server = app.listen(port, function() {
//     console.log("Listening on port %s...", server.address().port);
// });

// app.get("/", (req, res) => {
//     res.json({ 
//         status: "success", 
//         message: "Welcome to the Knowledgebase app"
//     });
// });



const pg = require("pg");
const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { stitchSchemas } = require('@graphql-tools/stitch');
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

const app = express();

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
 

async function main() {

  const schema1 = new GraphQLSchema({
    query: new GraphQLObjectType({
		name: "helloworld",
		fields: () => ({
			message: {
				type: GraphQLString,
				resolve: () => "hello world"
			}
		})
    })
  });

  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    'public', // PostgreSQL schema to use
    {
      // PostGraphile options, see:
      // https://www.graphile.org/postgraphile/usage-library/
    }
  );
 
  const barsResolver = {
	Query: {
	  message(parent, args, context, info) {
		return "hello world";
	  }
	}
  }

  let schema2 = makeExecutableSchema({
	typeDefs: /* GraphQL */ ` 
		schema {
			query: Query
	  	} 
	  
		type Query {
			message: String
	  	}
	`,
	resolvers: [barsResolver]
  });

  	const postsSubschema = { schema: schema };
	const usersSubschema = { schema: schema2 };

	// build the combined schema
	const gatewaySchema = stitchSchemas({
		subschemas: [
			postsSubschema,
			usersSubschema,
		]
	});

  const server = new ApolloServer({
    gatewaySchema,
    plugins: [plugin]
  });
 
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);


  app.use('/graphql', graphqlHTTP({
      schema: gatewaySchema,
      graphiql: true,
  }));
  
  let port = process.env.PORT || 1000;
  var lesServer = app.listen(port, function() {
      console.log("Listening on port %s...", lesServer.address().port);
  });
}





main().catch(e => {
  console.error(e);
  process.exit(1);
});