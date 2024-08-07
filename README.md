# 🚀 iTELL Content Management System

This repository contains a Content Management System (CMS) for iTELL, built from Strapi. It includes several custom or modified plugins in ./src/plugins. Each plugin has been added to the top-level `package.json`, so all `npm` commands may be run from the top-level directory. We are using `npm` for development and deployment.

### `develop`

Start the application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
```

### `start`

Start the application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
```

### `build`

Build the admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
```

## ⚙️ Deployment

Our deployment is hosted on [Render](https://itell-strapi-um5h.onrender.com/admin/).

## Development

We use prettier for code formatting. Please run `npm run format` before committing your changes.

Linting is not strictly enforced, but we are working towards a more consistent codebase. Please run `npm run lint` before committing your changes.