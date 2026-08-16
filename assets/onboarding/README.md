# Onboarding artwork

Drop three images here, then point each page at one in
`src/screens/OnboardingScreen.js`:

```js
image: require('../../assets/onboarding/save.png'),
```

Until then each page renders an empty 3:4 well with an icon.

| Page key | Suggested file | Shows |
|---|---|---|
| `save` | `save.png` | sharing a link into the app |
| `try`  | `try.png`  | a try-on render on a person |
| `post` | `post.png` | a look in the feed with votes |

Wells are 3:4 and clipped to a 16px radius, so export at 3:4 (e.g. 900×1200).
