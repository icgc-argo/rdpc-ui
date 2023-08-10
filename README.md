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

Hosting environments that use runtime variables need to be able to send public client env vars to the client.
To do this we create an api route which provides a config `/src/app/api/config/config.ts`
This creates a config object based on a priority of `server process vals` , then `client build time vals` and finally a hardcoded default.

In our UI we provide values via a context provider `AppConfigProvider`. This means that accessing app config variables needs to be done in a "react way" - using context and hooks correctly. Importing from a regular function in a module does not work.

Build time variables are inlined and "frozen" at build time. They are explained here:
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

## Uikit & Styling

In using UIKit we are tied to using a CSS-in-JS paradigm of styling.
Please prefer usage of the `css` prop and functions over the `styled` method.

- it's easier to debug (less wrapping in the browser inspectors)
- typechecking css property values is possible

In an attempt to try and keep things clean and bug free, Emotion functions are used directly from UIKit.
@emotion/react is only installed as a dependency in this project for types.

react + react dom + emotion all versions needs to be in sync with @icgc-argo/uikit
