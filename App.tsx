import React from 'react';
import { SendbirdCalls } from '@sendbird/calls-react-native';
import { AuthProvider, useAuthContext } from './src/contexts/AuthContext';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Palette from './src/styles/palette';
import { Platform, StatusBar } from 'react-native';
import { navigationRef } from './src/libs/StaticNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DirectCallVoiceCallingScreen from './src/screens/DirectCallVoiceCallingScreen';
import DirectCallHomeTab from './src/screens/DirectCallHomeTab';
import { DirectRoutes } from './src/navigations/routes';
import DirectCallSignInScreen from './src/screens/DirectCallSignInScreen';
import DirectCallVideoCallingScreen from './src/screens/DirectCallVideoCallingScreen';
import {
  setFirebaseMessageHandlers,
  setNotificationForegroundService,
  startRingingWithNotification,
} from './src/callHandler/android';
import CallHistoryManager from './src/libs/CallHistoryManager';
import AuthManager from './src/libs/AuthManager';
import { setupCallKit, startRingingWithCallKit } from './src/callHandler/ios';
import { AppLogger } from './src/utils/logger';
import { CALL_PERMISSIONS, usePermissions } from './src/hooks/usePermissions';

// SendbirdCalls.Logger.setLogLevel('debug');
SendbirdCalls.initialize('SAMPLE_APP_ID');

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
SendbirdCalls.onRinging(async (call) => {
  const directCall = await SendbirdCalls.getDirectCall(call.callId);

  if (!SendbirdCalls.currentUser) {
    const credential = await AuthManager.getSavedCredential();

    if (credential) {
      // Authenticate before accept
      await SendbirdCalls.authenticate(credential.userId, credential.accessToken);
    } else {
      // Invalid user call
      return directCall.end();
    }
  }

  const unsubscribe = directCall.addListener({
    onEnded({ callId, callLog }) {
      AppLogger.debug('[onRinging/onEnded] add to call history manager');
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
