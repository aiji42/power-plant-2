declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/api/bookmark/:code": { "code": string };
    "/api/torrent/:code": { "code": string };
    "/api/casts/:code": { "code": string };
    "/product/:code": { "code": string };
    "/stock/:page": { "page": string };
    "/cast/:cast": { "cast": string };
    "/fana/:page": { "page": string };
    "/fanc/:page": { "page": string };
    "/mgs/:page": { "page": string };
    "/dev/null": Record<string, never>;
    "/login": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/api/bookmark/:code", RouteParams["/api/bookmark/:code"]]
      | ["/api/torrent/:code", RouteParams["/api/torrent/:code"]]
      | ["/api/casts/:code", RouteParams["/api/casts/:code"]]
      | ["/product/:code", RouteParams["/product/:code"]]
      | ["/stock/:page", RouteParams["/stock/:page"]]
      | ["/cast/:cast", RouteParams["/cast/:cast"]]
      | ["/fana/:page", RouteParams["/fana/:page"]]
      | ["/fanc/:page", RouteParams["/fanc/:page"]]
      | ["/mgs/:page", RouteParams["/mgs/:page"]]
      | ["/dev/null"]
      | ["/login"]
  >(...args: T): typeof args[0];
}
