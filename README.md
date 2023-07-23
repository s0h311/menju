### Starten

1. Sichergehen, dass `node 18.16.1`, `npm 9.7.2` und `yarn 3.6.1` installiert und benutzt werden.
2. `corepack enable` ausführen für `yarn`
3. Damit die richtige `yarn` Version installiert wird: `yarn set version berry`
4. Die `postgres` Datenbank starten: `docker-compose up -d`
5. Dann das Datenbank Schema in `schema.prisma` pushen: `npx prisma db push`
6. Packages installieren: `yarn install`
7. Next starten: `yarn dev`

TEST CODEOWNERS
