import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  
};

export default config;

