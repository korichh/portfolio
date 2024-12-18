import "dotenv/config"
import { S3Client } from "@aws-sdk/client-s3";
import vars from "./vars";

export default new S3Client({
  region: "auto",
  endpoint: `https://${vars.account_id}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: vars.access_key_id,
    secretAccessKey: vars.secret_access_key,
  },
});
