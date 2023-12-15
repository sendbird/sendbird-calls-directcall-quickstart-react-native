#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <PushKit/PushKit.h>

@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate, RCTBridgeDelegate, PKPushRegistryDelegate>

@end
