/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { en, ru } from "vuetify/locale";
import { createI18n, useI18n } from "vue-i18n";

import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";

const messages = {
  en: {
    $vuetify: {
      ...en,
      dataIterator: {
        rowsPerPageText: "Items per page:",
        pageText: "{0}-{1} of {2}",
        open: "Open",
      },
    },
  },
  ru: {
    $vuetify: {
      ...ru,
      dataIterator: {
        rowsPerPageText: "Element per sida:",
        pageText: "{0}-{1} av {2}",
        open: "Open",
      },
    },
  },
};

export const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: "ru",
  fallbackLocale: "en",
  messages,
});

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
