import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, StatusBar } from 'react-native';

import { SendbirdCalls, SoundType } from '@sendbird/calls-react-native';

import {
  setFirebaseMessageHandlers,
  setNotificationForegroundService,
  startRingingWithNotification,
} from './src/callHandler/android';
import { setupCallKit, startRingingWithCallKit } from './src/callHandler/ios';
import { AuthProvider, useAuthContext } from './src/contexts/AuthContext';
import { CALL_PERMISSIONS, usePermissions } from './src/hooks/usePermissions';
import AuthManager from './src/libs/AuthManager';
import CallHistoryManager from './src/libs/CallHistoryManager';
import { navigationRef } from './src/libs/StaticNavigation';
import { DirectRoutes } from './src/navigations/routes';
import DirectCallHomeTab from './src/screens/DirectCallHomeTab';
import DirectCallSignInScreen from './src/screens/DirectCallSignInScreen';
import DirectCallVideoCallingScreen from './src/screens/DirectCallVideoCallingScreen';
import DirectCallVoiceCallingScreen from './src/screens/DirectCallVoiceCallingScreen';
import Palette from './src/styles/palette';
import { AppLogger } from './src/utils/logger';

// SendbirdCalls.Logger.setLogLevel('debug');
SendbirdCalls.initialize('SAMPLE_APP_ID');

// For iOS, use ringtoneSound of callkit
if (Platform.OS === 'android') {
  SendbirdCalls.addDirectCallSound(SoundType.RINGING, 'ringing.mp3');
}
SendbirdCalls.addDirectCallSound(SoundType.DIALING, 'dialing.mp3');
SendbirdCalls.addDirectCallSound(SoundType.RECONNECTED, 'reconnected.mp3');
SendbirdCalls.addDirectCallSound(SoundType.RECONNECTING, 'reconnecting.mp3');
// SendbirdCalls.setDirectCallDialingSoundOnWhenSilentOrVibrateMode(true);

// Setup android message & notification handlers
if (Platform.OS === 'android') {
  setFirebaseMessageHandlers();
  setNotificationForegroundService();
}

// Setup ios callkit
if (Platform.OS === 'ios') {
  setupCallKit();
}

// Setup onRinging
SendbirdCalls.setListener({
  onRinging: async (call) => {
    const directCall = await SendbirdCalls.getDirectCall(call.callId);

    if (!SendbirdCalls.currentUser) {
      const credential = await AuthManager.getSavedCredential();

      if (credential) {
        // Authenticate before accept
        await SendbirdCalls.authenticate(credential);
      } else {
        // Invalid user call
        return directCall.end();
      }
    }

    const unsubscribe = directCall.addListener({
      onEnded({ callId, callLog }) {
        AppLogger.info('[onRinging/onEnded] add to call history manager');
        callLog && CallHistoryManager.add(callId, callLog);
        unsubscribe();
      },
    });

    // Show interaction UI (Accept/Decline)
    if (Platform.OS === 'android') {
      await startRingingWithNotification(call);
    }
    if (Platform.OS === 'ios') {
      await startRingingWithCallKit(call);
    }
  },
});

export const Stack = createNativeStackNavigator();

const App = () => {
  usePermissions(CALL_PERMISSIONS);

  return (
    <AuthProvider>
      <NavigationContainer
        ref={navigationRef}
        theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: Palette.background50 } }}
      >
        <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

const Navigation = () => {
  const { currentUser } = useAuthContext();
  return (
    <Stack.Navigator>
      {!currentUser ? (
        <Stack.Screen
          name={DirectRoutes.SIGN_IN}
          component={DirectCallSignInScreen}
          options={{ headerTitleAlign: 'center', headerTitle: 'Sign in' }}
        />
      ) : (
        <>
          <Stack.Screen name={DirectRoutes.HOME_TAB} component={DirectCallHomeTab} options={{ headerShown: false }} />
          <Stack.Group screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name={DirectRoutes.VIDEO_CALLING} component={DirectCallVideoCallingScreen} />
            <Stack.Screen name={DirectRoutes.VOICE_CALLING} component={DirectCallVoiceCallingScreen} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
