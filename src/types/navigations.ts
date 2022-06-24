/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RouteWithParamsInterface {
  route: string;
  params: any;
}

export type AsParamListBase<T extends RouteWithParamsInterface> = {
  [k in T['route']]: T extends { route: k; params: infer P } ? P : never;
};

export type ExtractParams<Route extends string, U extends RouteWithParamsInterface> = U extends {
  route: Route;
  params: infer P;
}
  ? P
  : never;
