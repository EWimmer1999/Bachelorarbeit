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
  appName: 'Bachelorarbeit',
  webDir: 'www'
};

export default config;