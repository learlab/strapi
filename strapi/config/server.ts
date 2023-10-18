export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'SERVER_URL',
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin:{
    "path": "/",
    "serveAdminPanel": false, // http://yourbackend.com will not serve any static admin files
    "build": {
      "backend": " https://strapi-pi-eight.vercel.app/\n"
    }
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
