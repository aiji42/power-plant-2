declare module "routes-gen" {
  export type RouteParams = {
    "/mgs/:page": { "page": string };
    "/mgs": Record<string, never>;
  };

  export function route<
    T extends
      | ["/mgs/:page", RouteParams["/mgs/:page"]]
      | ["/mgs"]
  >(...args: T): typeof args[0];
}
