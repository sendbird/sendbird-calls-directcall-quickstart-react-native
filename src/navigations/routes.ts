export enum DirectRoutes {
  SIGN_IN = 'sign-in',
  HOME_TAB = 'home-tab',
  DIAL = 'dial',
  HISTORY = 'history',
  SETTINGS_STACK = 'settings-stack',
  SETTINGS = 'settings',
  APP_INFO = 'app-info',
  VIDEO_CALLING = 'video-calling',
  VOICE_CALLING = 'voice-calling',
}

export type DirectRouteWithParams =
  | {
      route: DirectRoutes.SIGN_IN;
      params: undefined;
    }
  | {
      route: DirectRoutes.HOME_TAB;
      params: undefined;
    }
  | {
      route: DirectRoutes.DIAL;
      params: undefined;
    }
  | {
      route: DirectRoutes.HISTORY;
      params: undefined;
    }
  | {
      route: DirectRoutes.SETTINGS_STACK;
      params: undefined;
    }
  | {
      route: DirectRoutes.SETTINGS;
      params: undefined;
    }
  | {
      route: DirectRoutes.APP_INFO;
      params: undefined;
    }
  | {
      route: DirectRoutes.VIDEO_CALLING;
      params: {
        callId: string;
      };
    }
  | {
      route: DirectRoutes.VOICE_CALLING;
      params: {
        callId: string;
      };
    };
