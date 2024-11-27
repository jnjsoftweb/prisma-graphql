## install

```bash
yarn

node init.js -n "prisma-graphql" -d "prisma graphql typescript on playground" -a "JnJ Web" -e "jnjsoftweb@gmail.com"
```


## prisma

### 설치

```sh
yarn add prisma @prisma/client
```


### 환경 설정

```sh
yarn prisma init --datasource-provider sqlite
```

> `.env`

```
DATABASE_URL="file:C:/JnJ-soft/Playground/node-ts/prisma-graphql/db/dev.db"
```

> `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}


model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### migrate

```sh
npx prisma migrate dev --name init
```


### code

> `src/_test/index.ts`

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { email: "user@test1.com", }, }); const users = await prisma.user.findMany(); console.log(users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```


## build

```sh
yarn build:watch
```

## 실행

```sh
cd C:/JnJ-soft/Playground/node-ts/prisma-graphql/esm/_test
node .
```


## prisma studio

```sh
npx prisma studio
```


## github

```sh
cd C:/JnJ-soft/Playground/nodejs/prisma-graphql
github  -u jnjsoftweb -e pushRepo -n prisma-graphql -d "prisma graphql typescript on playground"
```