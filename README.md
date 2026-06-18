# Vibeflow Updated APK Website

This React + Vite website includes:
- APK download button
- Mobile and laptop responsive design
- Version update details
- public/version.json support
- Update without uninstall instructions

## Run

```bash
npm install
npm run dev
```

## Add APK

Put your real APK here:

```txt
public/vibeflow.apk
```

The APK file name must be exactly:

```txt
vibeflow.apk
```

## Change website link

Open:

```txt
src/App.jsx
```

Change:

```js
const WEBSITE_LINK = "https://your-vibeflow-website-link.com";
```

to your real Vibeflow website link.

## Update release process

When you release a new APK:

1. Build new APK with higher versionCode.
2. Sign with the same keystore.
3. Replace:

```txt
public/vibeflow.apk
```

4. Update:

```txt
public/version.json
```

Example:

```json
{
  "latestVersionCode": 2,
  "latestVersionName": "1.0.1",
  "apkUrl": "/vibeflow.apk",
  "releaseDate": "2026-06-20",
  "minAndroid": "Android 8+",
  "message": "New Vibeflow update available.",
  "changelog": [
    "Improved music player UI",
    "Fixed APK download page",
    "Added smoother animations"
  ]
}
```

5. Deploy website again.
