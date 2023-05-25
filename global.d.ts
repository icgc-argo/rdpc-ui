declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TEST: string;
    }
  }
}

export {};
