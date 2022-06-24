/* eslint-disable @typescript-eslint/no-explicit-any */
import { StackActions, createNavigationContainerRef } from '@react-navigation/native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { ExtractParams, RouteWithParamsInterface } from '../types/navigations';
import AuthManager from './AuthManager';

export const navigationRef = createNavigationContainerRef<any>();
export const staticNavigation: StaticNavigation<string, { route: any; params: any }> = {
  navigate(name, params) {
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute?.name === name) {
        navigationRef.dispatch(StackActions.replace(name, params));
      } else {
        navigationRef.navigate(name, params);
      }
    }
  },
  push(name, params) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params));
    }
  },
  goBack() {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  },
};

interface StaticNavigation<Routes extends string, RouteWithParams extends RouteWithParamsInterface> {
  navigate<Route extends Routes>(
    ...args: [name: Route, params: ExtractParams<Route, RouteWithParams>] | [name: Route]
  ): void;
  push<Route extends Routes>(
    ...args: [name: Route, params: ExtractParams<Route, RouteWithParams>] | [name: Route]
  ): void;
  goBack(): void;
}

export const RunAfterAppReady = <Routes extends string, RouteWithParams extends { route: Routes; params: any }>(
  callback: (navigation: StaticNavigation<Routes, RouteWithParams>) => void,
) => {
  const id = setInterval(async () => {
    if (navigationRef.isReady() && AuthManager.isAuthenticated() && SendbirdCalls.currentUser) {
      clearInterval(id);
      callback(staticNavigation);
    }
  }, 250);
};
