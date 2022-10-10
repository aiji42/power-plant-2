declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/api/download-task/:code": { "code": string };
    "/api/bookmark/:code": { "code": string };
    "/api/torrent/:code": { "code": string };
    "/api/casts/:code": { "code": string };
    "/fana/show/:code": { "code": string };
    "/fanc/show/:code": { "code": string };
    "/mgs/show/:code": { "code": string };
    "/fana/:page": { "page": string };
    "/fanc/:page": { "page": string };
    "/mgs/:page": { "page": string };
    "/login": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/api/download-task/:code", RouteParams["/api/download-task/:code"]]
      | ["/api/bookmark/:code", RouteParams["/api/bookmark/:code"]]
      | ["/api/torrent/:code", RouteParams["/api/torrent/:code"]]
      | ["/api/casts/:code", RouteParams["/api/casts/:code"]]
      | ["/fana/show/:code", RouteParams["/fana/show/:code"]]
      | ["/fanc/show/:code", RouteParams["/fanc/show/:code"]]
      | ["/mgs/show/:code", RouteParams["/mgs/show/:code"]]
      | ["/fana/:page", RouteParams["/fana/:page"]]
      | ["/fanc/:page", RouteParams["/fanc/:page"]]
      | ["/mgs/:page", RouteParams["/mgs/:page"]]
      | ["/login"]
  >(...args: T): typeof args[0];
}
