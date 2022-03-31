require("dotenv").config();
const { makeQueryRunner } = require("./QueryRunner.js");

async function main() {
  const runner = await makeQueryRunner(
    //"postgres:///graphile_cookbook",
    process.env.DATABASE_URL,
    "app_public"
  );

  const result = await runner.query(
    //"query PostsByAuthor($username: String!) { userByUsername(username: $username) { postsByAuthorId { nodes { id body topicByTopicId { id title } } } } }",
    "query MyQuery {allLocales {nodes {name}}}"
  );

  console.log(JSON.stringify(result, null, 2));

  await runner.release();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});










// const express = require('express');
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