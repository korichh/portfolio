import "dotenv/config";

export default {
  port: process.env.PORT || "",
  passkey: process.env.PASSKEY || "",
  node_env: process.env.NODE_ENV || "",
  session_name: process.env.SESSION_NAME || "",
  session_secret: process.env.SESSION_SECRET || "",
  db_name: process.env.DB_NAME || "",
  db_user: process.env.DB_USER || "",
  db_password: process.env.DB_PASSWORD || "",
  db_host: process.env.DB_HOST || "",
  db_port: Number(process.env.DB_PORT) || 3306,
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || "",
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || "",
  account_id: process.env.ACCOUNT_ID || "",
  access_key_id: process.env.ACCESS_KEY_ID || "",
  secret_access_key: process.env.SECRET_ACCESS_KEY || "",
  bucket_name: process.env.BUCKET_NAME || "",
};
