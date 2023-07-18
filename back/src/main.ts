
import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@^4.1/standalone";
;
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Match } from "./resolvers/match.ts";
import { Player } from "./resolvers/player.ts";
import { Team } from "./resolvers/team.ts";
import { typeDefs } from "./schema.ts";

const resolvers = {
  Query,
  Mutation,
  Match,
  Player,
  Team,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: false,
});

console.log("Starting server on http://localhost:8080");
const { url } = await startStandaloneServer(server, {
  listen: { port: 8080 },
});
console.log(`Server ready at ${url}`);