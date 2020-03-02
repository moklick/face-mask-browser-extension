const pkg = require('../../package.json');

const manifestInput = {
  manifest_version: 2,
  name: 'face mask',
  version: pkg.version,

  icons: {
    '16': 'assets/icons/favicon-16.png',
    '32': 'assets/icons/favicon-32.png',
    '48': 'assets/icons/favicon-48.png',
    '128': 'assets/icons/favicon-128.png'
  },

  description: pkg.description,
  homepage_url: 'https://github.com/abhijithvijayan/web-extension-starter',
  short_name: 'mask',

  permissions: ['activeTab', 'http://*/*', 'https://*/*'],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

  '__chrome|firefox__author': 'moklick',
  __opera__developer: {
    name: 'moklick'
  },

  __chrome__minimum_chrome_version: '49',
  __opera__minimum_opera_version: '36',

  browser_action: {
    default_icon: {
      '16': 'assets/icons/favicon-16.png',
      '32': 'assets/icons/favicon-32.png',
      '48': 'assets/icons/favicon-48.png',
      '128': 'assets/icons/favicon-128.png'
    },
    default_title: 'mask',
    '__chrome|opera__chrome_style': false,
    __firefox__browser_style: false
  },

  background: {
    scripts: ['js/background.bundle.js'],
    '__chrome|opera__persistent': false
  },

  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['js/contentScript.bundle.js']
    }
  ]
};

module.exports = manifestInput;
