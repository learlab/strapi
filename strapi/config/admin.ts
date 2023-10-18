export default ({ env }) => ({
  host: "0.0.0.0", // only used along with `strapi develop --watch-admin` command
  port: 3000, // only used along with `strapi develop --watch-admin` command
  url: '/',
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
