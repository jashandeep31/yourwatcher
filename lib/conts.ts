export const KESTRA_URL = process.env.KESTRA_URL as string;
export const KESTRA_AUTHORIZATION = `Basic ${Buffer.from(
  process.env.CREDS as string
).toString("base64")}`;
