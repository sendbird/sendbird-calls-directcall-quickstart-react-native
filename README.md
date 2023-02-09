# Sendbird Calls for React-Native Quickstart

![Platform](https://img.shields.io/badge/platform-React--Native-black.svg)
![Languages](https://img.shields.io/badge/language-Typescript-blue.svg)

## Introduction

This Sendbird Calls Quickstart for React-Native can be used to initialize, configure, and build voice and video calling functionality into your React-Native client app. In this readme, you will find the steps you need to take before implementing the Calls SDK into a project, as well as a sample app that contains the code for implementing voice and video calling features.

### More about Sendbird Calls for React-Native

Find out more about Sendbird Calls for React-Native on Calls for React-Native doc. If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

## Before getting started

This section outlines the prerequsites for building a sample app using Sendbird Calls for React-Native.

### Requirements

The minimum requirements for Sendbird Calls Quickstart for React-Native are as follows:

- React-Native 0.60 +
- yarn or npm
- Xcode
- Android Studio
- Physical device (Android 21+, iOS 11+)
- [Sendbird Calls SDK for iOS](https://github.com/sendbird/sendbird-calls-ios)
- [Sendbird Calls SDK for Android](https://github.com/sendbird/sendbird-calls-android)


### Environment setup

Install dependencies (`node_modules` and `Pods`)

```shell
$ npm install
$ npx pod-install
```

<br />

## Getting started

These steps detail how to set up the backend for a Sendbird-enabled application.

### Create a Sendbird application

1. Login or Sign-up for an account on [Sendbird Dashboard](https://dashboard.sendbird.com).
2. Create or select a calls-enabled application on the dashboard.
3. Note your Sendbird application ID for future reference.

### Create test users

1. On the Sendbird dashboard, navigate to the **Users** menu.
2. Create at least two new users: one as a `caller`, and the other as a `callee`.
3. Note the `user_id` of each user for future reference.

### Specify the Application ID

To link your sample React-Native app to the Sendbird application specified in the previous steps, your newly created Sendbird application ID must be included in the code base. In the sample client app’s source code, replace `SAMPLE_APP_ID` with the application id generated in the first step.

```ts
SendbirdCalls.initialize('SAMPLE_APP_ID');
```

### Additional Configuration

1. To enable push notifications, replace the `applicationId` (Android Studio) and the `bundleId` (XCode) with the values from your own project.
2. Download your project’s `google-services.json` from Google Firebase, and replace the default one with it.

### Build and run the sample app

1. Open IDE (Xcode or Android Studio)
2. Build and run the sample app on your device.
3. Install the application onto at least two separate devices for each test created previously.
4. If two devices are available, repeat these steps to install the sample app on each device.

<br />

## Making your first call

### How to make a call

1. Log in to the sample app on the primary device with the user ID set as the `caller`.
2. Log in to the sample app on the secondary device using the ID of the user set as the `callee`. Alternatively, you can also use the Calls widget found on the Calls dashboard to log in as the `callee`.
3. On the primary device, specify the user ID of the `callee` and initiate a call.
4. If all steps are followed correctly, an incoming call notification will appear on the device of the `callee`.
5. Reverse the roles. Initiate a call from the other device.
6. If the two testing devices are near each other, use headphones to make a call to prevent audio feedback.

<br />

## Advanced

### Sound Effects

You can use different sound effects to enhance the user experience for events that take place while using Sendbird Calls.

To add sound effects, use the SendBirdCall.addDirectCallSound(_:forType:) method for the following events: dialing, ringing, reconnecting, and reconnected. Remember to set sound effects before the mentioned events occur. To remove sound effects, use the SendBirdCall.removeDirectCallSound(_:forType:) method.

```ts
// Play on a caller’s side when making a call.
SendbirdCalls.addDirectCallSound(SoundType.DIALING, 'dialing.mp3');

// Play on a callee’s side when receiving a call.
SendbirdCalls.addDirectCallSound(SoundType.RINGING, 'ringing.mp3');

// Play when a connection is lost, but the SDK immediately attempts to reconnect.
SendbirdCalls.addDirectCallSound(SoundType.RECONNECTING, 'reconnecting.mp3');

// Play when the connection is re-established.
SendbirdCalls.addDirectCallSound(SoundType.RECONNECTED, 'reconnected.mp3');
```

If you’re using Apple’s CallKit framework, use ringtoneSound instead to add sound effects as ringtones.  For example:

```ts
RNCallKeep.setup({
  ios: {
    // ...
    ringtoneSound: 'ringing.mp3',
  },
});
```

For more information about sound effects, see the Sendbird Calls iOS Quickstart [README for Sound effects](https://github.com/sendbird/quickstart-calls-directcall-ios#sound-effects).

### Add push notifications

### Android

#### Remote notification (FCM)

You can either handle [Remote Message](https://firebase.google.com/docs/reference/android/com/google/firebase/messaging/FirebaseMessagingService#public-void-onmessagereceived-remotemessage-message) on the Native side,
or you can use [`react-native-firebase`](https://github.com/invertase/react-native-firebase) to handle it in Javascript.

```java
// java
public class MyFirebaseMessagingService extends FirebaseMessagingService {
  ...
  @Override
  public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
    SendBirdCall.handleFirebaseMessageData(remoteMessage.getData())
  }
}
```

or

```ts
// typescript
messaging().setBackgroundMessageHandler(async (message: FirebaseMessagingTypes.RemoteMessage) => {
  SendbirdCalls.android_handleFirebaseMessageData(message.data);
});
```

### iOS

Handle notifications natively.

import headers to `AppDelegate.m` (or `AppDelegate.mm`)

```objc
#import <CoreMedia/CoreMedia.h>
#import <WebRTC/WebRTC.h>
#import <PushKit/PushKit.h>
#import <AVKit/AVKit.h>
#import <SendBirdCalls/SendBirdCalls-Swift.h>
```

#### VoIP Notification

Before starting, install native modules for using [`CallKit`](https://developer.apple.com/documentation/callkit) and [`PushKit`](https://developer.apple.com/documentation/pushkit).<br/>
At this moment, we are using [`react-native-voip-push-notification`](https://github.com/react-native-webrtc/react-native-voip-push-notification) and [`react-native-callkeep`](https://github.com/react-native-webrtc/react-native-callkeep)

implement `PKPushRegistryDelegate` to `AppDelegate.h`

```objc
#import <PushKit/PushKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, PKPushRegistryDelegate>
```

implement Delegate methods to `AppDelegate.m`

```objc
#import <RNVoipPushNotificationManager.h>
#import <RNCallKeep.h>
// ...
// ...

// MARK: - VoIP Notification - Receive token
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(PKPushType)type
{
  [RNVoipPushNotificationManager didUpdatePushCredentials:pushCredentials forType:(NSString *)type];
}

// MARK: - VoIP Notification - Receive token
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(PKPushType)type
{
  [RNVoipPushNotificationManager didUpdatePushCredentials:pushCredentials forType:(NSString *)type];
}

// MARK: - VoIP Notification - Receive incoming call
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)())completion
{
  // WARN: If you don't report to CallKit, the app will be shut down.
  [SBCSendBirdCall pushRegistry:registry didReceiveIncomingPushWith:payload for:type completionHandler:^(NSUUID * _Nullable uuid) {
    if(uuid != nil) {
      // Report valid call
      SBCDirectCall* call = [SBCSendBirdCall callForUUID: uuid];
      [RNCallKeep reportNewIncomingCall: [uuid UUIDString]
                                 handle: [[call remoteUser] userId]
                             handleType: @"generic"
                               hasVideo: [call isVideoCall]
                    localizedCallerName: [[call remoteUser] nickname]
                        supportsHolding: YES
                           supportsDTMF: YES
                       supportsGrouping: YES
                     supportsUngrouping: YES
                            fromPushKit: YES
                                payload: [payload dictionaryPayload]
                  withCompletionHandler: completion];
    } else {
      // Report and end invalid call
      NSUUID* uuid = [NSUUID alloc];
      NSString* uuidString = [uuid UUIDString];

      [RNCallKeep reportNewIncomingCall: uuidString
                                 handle: @"invalid"
                             handleType: @"generic"
                               hasVideo: NO
                    localizedCallerName: @"invalid"
                        supportsHolding: NO
                           supportsDTMF: NO
                       supportsGrouping: NO
                     supportsUngrouping: NO
                            fromPushKit: YES
                                payload: [payload dictionaryPayload]
                  withCompletionHandler: completion];
      [RNCallKeep endCallWithUUID:uuidString reason:1];
    }
  }];
}
```

> `didReceiveIncomingPushWithPayload` is called after voip registration,
> so you should register voip on the JS side, after `SendbirdCalls.initialize`, `SendbirdCallListener.onRinging` and `RNCallKeep.addListener`

> 0. voip notification wake your app
> 1. [Native] App started  >> **DO NOT CALL [RNVoipPushNotificationManager voipRegistration] on launch in AppDelegate, it will trigger didReceiveIncomingPushWithPayload before sdk initializing**
> 2. [JS] JS bridge created and your React-Native app is mounted
> 3. [JS] run SendbirdCalls.initialize()
> 4. [JS] set SendbirdCalls.setListener({onRinging})
> 5. [JS] set RNCallKeep.addListener(...)
> 6. [JS] run RNVoipPushNotification.registerVoipToken() -> it will trigger step 7
> 7. [Native] didReceiveIncomingPushWithPayload called -> it will trigger step 8
> 8. [Native] [SBCSendBirdCall didReceiveIncomingPushWith] called >> it will trigger onRinging event
> 9. [Native] report to CallKit
> 10. [JS] onRinging listener called

#### Remote Notification (APNs)

implement `didReceiveRemoteNotification` to `AppDelegate.m`

```objc
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [SBCSendBirdCall application:application didReceiveRemoteNotification:userInfo];
}
```

## Reference

For further detail on Sendbird Calls functions, please refer to Sendbird Calls SDK documentation for [iOS](https://sendbird.com/docs/calls/v1/ios/quickstart/make-first-call) and [Android](https://sendbird.com/docs/calls/v1/android/quickstart/make-first-call).

<br />
