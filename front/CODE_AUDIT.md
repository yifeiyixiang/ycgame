# WeChat Code Audit Notes

## Current Treatment

- `assets/Script/tyqSDK/SDK` has been removed from the Cocos `assets` build path.
- A local backup is kept at `third_party_unused/tyqSDK/`, and this directory is ignored by git. Do not include it in the WeChat release package.
- Business code now accesses platform behavior through `assets/Script/game/platform/GamePlatform.ts`.
- Tracking/statistics calls are retained at call sites but `GamePlatform.track()` is intentionally a no-op.
- WeChat rewarded video uses `wx.createRewardedVideoAd` directly.

## Release Config

- Fill `GamePlatform.wechatRewardedVideoAdUnitId` before release:

```ts
public static wechatRewardedVideoAdUnitId: string = "adunit-xxxxxxxxxxxxxxxx";
```

- If `Const.isTest` remains `true`, reward video calls are bypassed by `RechargeManager` and rewards are granted directly. Set it according to the intended release behavior.

## Verification

- Source scan should return no results for:

```bash
rg -n "tyqSDK/SDK|tyqSDK\.|Wechat\.|tyqAdManager|H5AdSdk4399" assets/Script assets/typeScript
```

- WeChat build output should also return no results for:

```bash
rg -n "tyqSDK|tyqAd|H5AdSdk4399|Wechat" build/wechatgame
```
