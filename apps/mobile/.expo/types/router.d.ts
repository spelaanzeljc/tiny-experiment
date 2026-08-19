/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/sign-up`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}/create` | `/create`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/account` | `/account`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/feed` | `/feed`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/planets` | `/planets`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(app)"}${"/(tabs)"}/planets/[id]` | `/planets/[id]`;
            params: Router.UnknownInputParams & { id: string | number };
          }
        | {
            pathname: `${"/(app)"}/planets/[id]/edit` | `/planets/[id]/edit`;
            params: Router.UnknownInputParams & { id: string | number };
          };
      hrefOutputParams:
        | { pathname: Router.RelativePathString; params?: Router.UnknownOutputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownOutputParams }
        | { pathname: `/`; params?: Router.UnknownOutputParams }
        | { pathname: `/sign-up`; params?: Router.UnknownOutputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | { pathname: `${"/(app)"}/create` | `/create`; params?: Router.UnknownOutputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/account` | `/account`; params?: Router.UnknownOutputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/feed` | `/feed`; params?: Router.UnknownOutputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}` | `/`; params?: Router.UnknownOutputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/planets` | `/planets`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${"/(app)"}${"/(tabs)"}/planets/[id]` | `/planets/[id]`;
            params: Router.UnknownOutputParams & { id: string };
          }
        | {
            pathname: `${"/(app)"}/planets/[id]/edit` | `/planets/[id]/edit`;
            params: Router.UnknownOutputParams & { id: string };
          };
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/${`?${string}` | `#${string}` | ""}`
        | `/sign-up${`?${string}` | `#${string}` | ""}`
        | `/_sitemap${`?${string}` | `#${string}` | ""}`
        | `${"/(app)"}/create${`?${string}` | `#${string}` | ""}`
        | `/create${`?${string}` | `#${string}` | ""}`
        | `${"/(app)"}${"/(tabs)"}/account${`?${string}` | `#${string}` | ""}`
        | `/account${`?${string}` | `#${string}` | ""}`
        | `${"/(app)"}${"/(tabs)"}/feed${`?${string}` | `#${string}` | ""}`
        | `/feed${`?${string}` | `#${string}` | ""}`
        | `${"/(app)"}${"/(tabs)"}${`?${string}` | `#${string}` | ""}`
        | `/${`?${string}` | `#${string}` | ""}`
        | `${"/(app)"}${"/(tabs)"}/planets${`?${string}` | `#${string}` | ""}`
        | `/planets${`?${string}` | `#${string}` | ""}`
        | { pathname: Router.RelativePathString; params?: Router.UnknownInputParams }
        | { pathname: Router.ExternalPathString; params?: Router.UnknownInputParams }
        | { pathname: `/`; params?: Router.UnknownInputParams }
        | { pathname: `/sign-up`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}/create` | `/create`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/account` | `/account`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/feed` | `/feed`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(app)"}${"/(tabs)"}/planets` | `/planets`; params?: Router.UnknownInputParams }
        | `${"/(app)"}${"/(tabs)"}/planets/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
        | `/planets/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
        | `${"/(app)"}/planets/${Router.SingleRoutePart<T>}/edit${`?${string}` | `#${string}` | ""}`
        | `/planets/${Router.SingleRoutePart<T>}/edit${`?${string}` | `#${string}` | ""}`
        | {
            pathname: `${"/(app)"}${"/(tabs)"}/planets/[id]` | `/planets/[id]`;
            params: Router.UnknownInputParams & { id: string | number };
          }
        | {
            pathname: `${"/(app)"}/planets/[id]/edit` | `/planets/[id]/edit`;
            params: Router.UnknownInputParams & { id: string | number };
          };
    }
  }
}
