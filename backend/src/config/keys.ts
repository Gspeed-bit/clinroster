const env = process.env;

export enum AppEnv {
  Dev = "development",
  Prod = "production",
  Test = "test",
}

export interface Keys {
  port: string;
  host: string;
  appEnv: string;
  mongoUri: string;
  webAppLink: string;
  secretKey: string;
  serverUsername: string;
  serverPassword: string;
  discordKey: string;
  resendApiKey: string;
  resendFrom: string;
  publicBaseUrl: string;
}

export const getKeys = (): Keys => ({
  port: env.PORT || "5000",
  host: env.HOST || "0.0.0.0",
  appEnv: env.APP_ENV || AppEnv.Dev,
  mongoUri: env.MONGO_URI || "",
  webAppLink: env.WEB_APP_LINK || "http://localhost:3000",
  secretKey: env.SECRET_KEY || "dev-secret",
  serverUsername: env.SERVER_USERNAME || "docs",
  serverPassword: env.SERVER_PASSWORD || "docs123",
  discordKey: env.DISCORD_KEY || "",
  resendApiKey: env.RESEND_API_KEY || "",
  resendFrom: env.RESEND_FROM || "",
  publicBaseUrl: env.PUBLIC_BASE_URL || "http://localhost:5000",
});
