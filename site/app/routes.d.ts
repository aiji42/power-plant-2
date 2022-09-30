declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/mgs/show/:code": { "code": string };
    "/fana/:page": { "page": string };
    "/fanc/:page": { "page": string };
    "/mgs/:page": { "page": string };
    "/login": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/mgs/show/:code", RouteParams["/mgs/show/:code"]]
      | ["/fana/:page", RouteParams["/fana/:page"]]
      | ["/fanc/:page", RouteParams["/fanc/:page"]]
      | ["/mgs/:page", RouteParams["/mgs/:page"]]
      | ["/login"]
  >(...args: T): typeof args[0];
}
