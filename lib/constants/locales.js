/**
 * Define the languages that can be activated by users on Open Collective based
 * on https://crowdin.com/project/opencollective.
 *
 * Only languages completed with 20%+ are currently activated.
 *
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes for a list of language
 * codes with their native names.
 */

// Please keep English at the top, and sort other entries by `name`.
export default {
  en: { name: 'English', nativeName: 'English', completion: '100%' },
  'pt-BR': { name: 'Brazilian Portuguese', nativeName: 'Português brasileiro', completion: '56%' },
  ca: { name: 'Catalan', nativeName: 'Català', completion: '10%' },
  zh: { name: 'Chinese', nativeName: '中文', completion: '34%' },
  cs: { name: 'Czech', nativeName: 'čeština', completion: '10%' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', completion: '10%' },
  fr: { name: 'French', nativeName: 'Français', completion: '81%' },
  de: { name: 'German', nativeName: 'Deutsch', completion: '37%' },
  it: { name: 'Italian', nativeName: 'Italiano', completion: '29%' },
  ja: { name: 'Japanese', nativeName: '日本語', completion: '39%' },
  ko: { name: 'Korean', nativeName: '한국어', completion: '11%' },
  pl: { name: 'Polish', nativeName: 'Polski', completion: '99%' },
  pt: { name: 'Portuguese', nativeName: 'Português', completion: '21%' },
  ru: { name: 'Russian', nativeName: 'Русский', completion: '39%' },
  'sk-SK': { name: 'Slovak', nativeName: 'Slovensky', completion: '86%' },
  es: { name: 'Spanish', nativeName: 'Español', completion: '99%' },
  'sv-SE': { name: 'Swedish', nativeName: 'Svenska', completion: '87%' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', completion: '43%' },
};
