## Getting Started

First, we need some env variables as follows:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="some_value"
```

Get the `DATABASE_URL` from neon, after creating a new database in neon, and then

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
