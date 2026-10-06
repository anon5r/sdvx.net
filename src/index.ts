import { isStaticAssetPath } from './pages';
import { getRedirectUrl } from './redirect';

export interface Env {
  ASSETS?: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Direct match for known static files if ASSETS binding is present
    if (env.ASSETS && isStaticAssetPath(pathname)) {
      return env.ASSETS.fetch(request);
    }

    const redirectUrl = getRedirectUrl(pathname);
    return Response.redirect(redirectUrl, 302);
  },
};
