import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.hospitalmap.angular',
  appName: 'map-mobile-app',
  webDir: 'dist/map-mobile-app',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
      resizeOnFullScreen: false,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
