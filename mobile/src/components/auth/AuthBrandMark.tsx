import { AppLogo } from '../brand/AppLogo';

/** Brand presence for auth and splash — uses `assets/app-logo.png` */
export function AuthBrandMark({ size = 64 }: { size?: number }) {
  return <AppLogo size={size} variant="plain" />;
}
