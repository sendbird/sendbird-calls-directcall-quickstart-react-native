# Sendbird Calls for React-Native Quickstart

![Platform](https://img.shields.io/badge/platform-React--Native-black.svg)
![Languages](https://img.shields.io/badge/language-Typescript-blue.svg)

## Introduction

Sendbird Calls SDK for React-Native is used to initialize, configure, and build voice and video calling functionality into your React-Native client app. In this repository, you will find the steps you need to take before implementing the Calls SDK into a project, and a sample app which contains the code for implementing voice and video call.

### More about Sendbird Calls for React-Native

Find out more about Sendbird Calls for React-Native on Calls for React-Native doc. If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

## Before getting started

This section shows you the prerequisites you need for testing Sendbird Calls for React-Native sample app.

### Requirements

The minimum requirements for Calls SDK for React-Native sample are:

- React-Native 0.60 +
- yarn or npm
- Xcode
- Android Studio
- Physical device (Android 21+, iOS 11+)

For more details on **installing and configuring the Calls SDK for React-Native**, refer to Calls for React-Native doc.

### Environment setup

Install dependencies (`node_modules` and `Pods`)

```shell
$ npm install
$ npx pod-install
```

<br />

## Getting started

If you would like to try the sample app specifically fit to your usage, you can do so by following the steps below.

### Create a Sendbird application

1. Login or Sign-up for an account on [Sendbird Dashboard](https://dashboard.sendbird.com).
2. Create or select a calls-enabled application on the dashboard.
3. Note your Sendbird application ID for future reference.

### Create test users

1. On the Sendbird dashboard, navigate to the **Users** menu.
2. Create at least two new users: one as a `caller`, and the other as a `callee`.
3. Note the `user_id` of each user for future reference.

### Specify the Application ID

To run the sample React-Native app on the Sendbird application specified earlier, your Sendbird application ID must be specified. On the sample client app’s source code, replace `SAMPLE_APP_ID` with `APP_ID` which you can find on your Sendbird application information.

```ts
SendbirdCalls.initialize('SAMPLE_APP_ID');
```

### Replace app configures

1. Replace the `applicationId` and `bundleId` with yours to receive notifications.
2. Replace the `google-services.json` with yours to receive notifications on Android.

### Build and run the sample app

1. Open IDE (Xcode or Android Studio)
2. Build and run the sample app on your device.
3. Install the application onto at least two separate devices for each test user you created earlier.
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

## Reference

For further detail on Sendbird Calls for React-Native, refer to Sendbird Calls SDK for React-Native README.

<br />

## How to integrate with native module

### iOS

import headers to `AppDelegate.m` (or `AppDelegate.mm`)

```objc
#import <CoreMedia/CoreMedia.h>
#import <WebRTC/WebRTC.h>
#import <PushKit/PushKit.h>
#import <AVKit/AVKit.h>
#import <SendBirdCalls/SendBirdCalls-Swift.h>
```

#### VoIP Notification

Before starts, you should install native modules for using [`CallKit`](https://developer.apple.com/documentation/callkit) and [`PushKit`](https://developer.apple.com/documentation/pushkit).<br/>
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

> `didReceiveIncomingPushWithPayload` is being called after voip registration,
> so you can register voip on the JS side, after set `SendbirdCalls.onRinging` and `RNCallKeep.addListener`

> 0. voip notification wake your app
> 1. [Native] App started
> 2. [JS] JS bridge created and your React-Native app is mounted
> 3. [JS] call SendbirdCalls.initialize()
> 4. [JS] set SendbirdCalls.onRinging
> 5. [JS] set RNCallKeep.addListener
> 6. [JS] RNVoipPushNotification.registerVoipToken() >> it means register voip
> 7. [Native] didReceiveIncomingPushWithPayload called
> 8. [Native] SendbirdCalls.didReceiveIncomingPush >> it will trigger Ringing event
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
