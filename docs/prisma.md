## prisma migrate

```sh
npx prisma migrate dev --schema=./prisma/mysql.schema.prisma --name init_mysql

# * 삭제
rmdir /s /q prisma\migrations

npx prisma migrate dev --schema=./prisma/sqlite.schema.prisma --name init_sqlite
```

## prisma studio

```sh
npx prisma studio --schema=./prisma/mysql.schema.prisma

npx prisma studio --schema=./prisma/sqlite.schema.prisma
```

## prisma pull

```sh
npx prisma db pull --schema=./prisma/sqlite.schema.prisma
```

