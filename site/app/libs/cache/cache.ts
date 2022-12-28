import { HeadersFunction } from "@remix-run/node";

export const cacheHeaders = ({
  swr,
  smax,
}: { swr?: number; smax?: number } = {}) => ({
  "Cache-Control": `max-age=0, s-maxage=${
    smax ?? 300
  }, stale-while-revalidate=${swr ?? 3600 * 24}`,
  "X-Powered-By": "Remix",
});

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders;
};
