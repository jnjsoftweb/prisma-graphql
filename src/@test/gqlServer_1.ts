import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground'; // Playground 플러그인 임포트
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const GRAPHQL_PORT = 4000;

// GraphQL 스키마 정의
const typeDefs = `#graphql
  scalar DateTime

  type Channel {
    id: ID!
    channelId: String!
    title: String!
    customUrl: String
    publishedAt: DateTime
    description: String
    thumbnail: String
    uploadsPlaylistId: String
    viewCount: Int
    subscriberCount: Int
    videoCount: Int
  }

  type Query {
    Channels: [Channel]
  }
`;

const resolvers = {
  Query: {
    Channels: (_parent: any, _args: any, _context: any) => { 
      return client.channels.findMany()
    } 
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        'editor.theme': 'dark', // 기본 테마
        'request.credentials': 'include', // credentials 설정
      },
    }),
  ],
  introspection: true, // Introspection 활성화
});

const app = express();
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Express json 미들웨어 추가
app.use(express.json());

await server.start();
app.use('/graphql', expressMiddleware(server));

app.listen(GRAPHQL_PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${GRAPHQL_PORT}/graphql`);
});
