declare module "routes-gen" {
  export type RouteParams = {
    "/fana/:page": { "page": string };
    "/fana": Record<string, never>;
    "/fanc/:page": { "page": string };
    "/fanc": Record<string, never>;
    "/mgs/:page": { "page": string };
    "/mgs": Record<string, never>;
  };

  export function route<
    T extends
      | ["/fana/:page", RouteParams["/fana/:page"]]
      | ["/fana"]
      | ["/fanc/:page", RouteParams["/fanc/:page"]]
      | ["/fanc"]
      | ["/mgs/:page", RouteParams["/mgs/:page"]]
      | ["/mgs"]
  >(...args: T): typeof args[0];
}
