import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  appId: 'io.ionic.starter',
  appName: 'StrEssen',
  webDir: 'www'
};

export default config;