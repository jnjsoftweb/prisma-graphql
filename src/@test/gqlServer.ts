import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

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


async function startApolloServer() {
  // Express 앱 생성
  const app = express();

  // Apollo Server 인스턴스 생성
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Apollo Server 시작
  await server.start();

  // Express에 미들웨어 적용
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // 서버 시작
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

// 서버 시작
startApolloServer().catch(console.error);
