# Sharing into fitterest

The goal: you are scrolling Myntra, you hit **Share**, and *fitterest* is in
that sheet next to WhatsApp. Tapping it extracts the piece and drops it in your
closet.

## How it works

`expo-share-intent` is a config plugin that adds the native pieces which put an
app in the OS share sheet:

- **iOS** — a Share Extension target, declared with activation rules. Ours
  accepts a web URL, a web page, and plain text (`app.json` →
  `iosActivationRules`).
- **Android** — an `ACTION_SEND` intent filter for `text/*` (`androidIntentFilters`).

`ShareIntentProvider` wraps the app in `App.js`, outermost, so a share that
cold-starts the app is captured before the sign-in gate resolves.
`useSharedLink()` reads `shareIntent.webUrl` (URL shares) or `shareIntent.text`
(text shares) and hands whichever arrived to `AddLinkSheet`, which extracts it
without asking again — the user already chose to share it.

Retailers share inconsistently: some send a bare URL, some a sentence with the
link inside, some a shortener like `myntr.it`. The server's `links.js`
normaliser handles all three, so the client passes the payload through
untouched rather than trying to parse it.

## This needs a development build

**Share extensions are native code, so they cannot run in Expo Go.** No amount
of JS gets the app into the share sheet — the OS only lists apps whose
installed binary declares the extension.

```bash
npx expo prebuild --clean
npx expo run:ios      # or: npx expo run:android
```

Run it on a real device or simulator, then share a product page from a browser
or a retailer app. `app.json` carries the `bundleIdentifier` /
`package` (`com.fitterest.app`) that prebuild needs — change it before shipping
anywhere real.

Until you make that build, adding a piece works the same way, one step longer:
copy the link, open the app, tap **+**, paste.

## Where a shared piece lands

Ingested pieces go into the closet (`ClosetContext`), which is persisted to
AsyncStorage and survives a restart. From the success sheet you can tap a
collection chip to file it into a collection, or start one if you have none.
Collections hold both ingested pieces (`itemIds`) and feed looks (`lookIds`).
