const env = process.env["NODE_ENV"];

if (env === undefined) throw new Error("undefined environment");

const inDevelopment = env === "development";
const inStaging = env === "test";
const inProduction = env === "production";

interface AppConfiguration {
  OakApiHost: string;
}

const devConfig: AppConfiguration = { OakApiHost: "http://localhost:8080" };
const stgConfig: AppConfiguration = { OakApiHost: "https://example.com:8080" };
const prdConfig: AppConfiguration = { OakApiHost: "https://example.com:8080" };

let AppConfig: AppConfiguration;

if (inDevelopment) AppConfig = devConfig;
else if (inStaging) AppConfig = stgConfig;
else if (inProduction) AppConfig = prdConfig;
else throw new Error("invalid environment");

export default AppConfig;
