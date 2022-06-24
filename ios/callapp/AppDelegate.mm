#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTAppSetupUtils.h>

#import <CoreMedia/CoreMedia.h>
#import <WebRTC/WebRTC.h>
#import <PushKit/PushKit.h>
#import <AVKit/AVKit.h>
#import <SendBirdCalls/SendBirdCalls-Swift.h>
#import <RNVoipPushNotificationManager.h>
#import <RNCallKeep.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

static NSString *const kRNConcurrentRoot = @"concurrentRoot";

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTAppSetupPrepareApp(application);

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

#if RCT_NEW_ARCH_ENABLED
  _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
  _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
  _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
  bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
#endif

  NSDictionary *initProps = [self prepareInitialProps];
  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"callapp", initProps);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feture is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  // Switch this bool to turn on and off the concurrent root
  return true;
}

- (NSDictionary *)prepareInitialProps
{
  NSMutableDictionary *initProps = [NSMutableDictionary new];

#ifdef RCT_NEW_ARCH_ENABLED
  initProps[kRNConcurrentRoot] = @([self concurrentRootEnabled]);
#endif

  return initProps;
}

// MARK: - VoIP Notification - Receive token
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(PKPushType)type
{
  [RNVoipPushNotificationManager didUpdatePushCredentials:pushCredentials forType:(NSString *)type];
}

// MARK: - VoIP Notification - Receive incoming call
/**
 * This being called after voip registration
 * so you can register voip on the JS side, after set `SendbirdCalls.onRinging` and `RNCallKeep.addListener`
 *
 * 0. voip notification wake your app
 * 1. [Native] App is start
 * 2. [JS] JS bridge created and your React-Native app is mounted
 * 3. [JS] call SendbirdCalls.initialize()
 * 4. [JS] set SendbirdCalls.onRinging
 * 5. [JS] set RNCallKeep.addListener
 * 6. [JS] RNVoipPushNotification.registerVoipToken() >> it means register voip
 * 7. [Native] didReceiveIncomingPushWithPayload called
 * 8-1. [Native] SendbirdCalls.didReceiveIncomingPush >> it will trigger Ringing event
 * 8-2. [Native] report to CallKit
 * 9. [JS] onRinging listener called
 */
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

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end
