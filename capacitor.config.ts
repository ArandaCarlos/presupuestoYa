import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.presupuestoya.app',
  appName: 'PresupuestoYa',
  webDir: 'out',
  server: {
    url: 'https://presupuestosya.app',
    cleartext: true
  }
};

export default config;
