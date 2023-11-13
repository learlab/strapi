import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import ContentGeneratorIcon from "./components/ContentGenerator/ContentGeneratorIcon";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
    app.customFields.register([{
      name: "question",
      pluginId: "auto-content",
      type: "text",
      intlLabel: {
        id: "auto-content.auto-content.label",
        defaultMessage: "Question Content",
      },
      intlDescription: {
        id: "auto-content.auto-content.description",
        defaultMessage: "Generate Question using AI",
      },
      icon: ContentGeneratorIcon,
      components: {
        Input: async () =>
          import("./components/ContentGenerator/ContentGeneratorInput"),
      },
      options: {
        base: [],
        advanced: [],
      },
    },
    {
      name: "keyPhrase",
      pluginId: "auto-content",
      type: "text",
      intlLabel: {
        id: "keyPhrase.keyPhrase.label",
        defaultMessage: "Key Phrases",
      },
      intlDescription: {
        id: "keyPhrase.keyPhrase.description",
        defaultMessage: "Generate key phrases using AI",
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import("./components/KeyPhraseGenerator/KeyPhraseGeneratorInput"),
      },
      options: {
        base: [],
        advanced: [],
      },
    }]);

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
