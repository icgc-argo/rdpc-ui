type AppConfig = { TEST_ENV_VAR: string };

export const getAppConfig = (): AppConfig => {
  return {
    TEST_ENV_VAR: process.env.NEXT_PUBLIC_TEST,
  };
};
