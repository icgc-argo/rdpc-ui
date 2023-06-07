This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Env vars

https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

## Local dev

docker compose file for local development
created an `.env` file based on `.env.schema`
in `compose` folder, run `docker-compose up` command

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Uikit

react + react dom + emotion all versions needs to be in sync

tied to a lot of uikit choices
sooo
prefer css prop over "styled" usage

- easier to debug
- "cleaner"

to try and keep things clean and bug free, Emotion is used directly from UIKit
it is only installed as a dependency in this project for types
note it should still appear in node_modules as a peer dependency for uikit
