const fs = require('fs');
const path = require('path');
const appJson = require('./app.json');

const googleServicesPath = path.join(__dirname, 'google-services.json');

/**
 * Merges static `app.json` with `EXPO_PUBLIC_API_URL` for native `expo-constants` `extra.apiUrl`
 * (in addition to Metro inlining the same var for `process.env.EXPO_PUBLIC_API_URL` in JS).
 */
module.exports = {
  expo: {
    ...appJson.expo,
    plugins: [...(appJson.expo.plugins || []), '@react-native-community/datetimepicker'],
    android: {
      ...appJson.expo.android,
      ...(fs.existsSync(googleServicesPath)
        ? { googleServicesFile: './google-services.json' }
        : {})
    },
    extra: {
      ...(appJson.expo.extra || {}),
      apiUrl: process.env.EXPO_PUBLIC_API_URL || ''
    }
  }
};
