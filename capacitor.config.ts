import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.easyco.app',
  appName: 'EasyCo',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // En dev, pointer vers localhost pour tester
    // Commentez cette ligne pour une vraie app qui charge les fichiers locaux
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  ios: {
    contentInset: 'always',
    scheme: 'EasyCo',
    allowsLinkPreview: true,
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#7c3aed',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
