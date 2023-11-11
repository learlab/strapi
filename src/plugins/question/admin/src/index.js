import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
    app.customFields.register({
      name: "question",
      pluginId: "question",
      type: "text",
      intlLabel: {
        id: "question.question.label",
        defaultMessage: "Question",
      },
      intlDescription: {
        id: "question.question.description",
        defaultMessage: "Write a comprehension question for your text or auto-generate it using the button below.",
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import("./components/QuestionField/QuestionInput"),
      },
      options: {
        base: [],
        advanced: [],
      },
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
