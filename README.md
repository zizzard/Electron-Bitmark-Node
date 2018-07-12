# Electron Application to control the Bitmark Node UI

Built using Electron (v2.0.4) and Electron-Forge (v6.0.0-beta.22)

## Prerequisite
* Node.js 10.5.0 or newer
* npm 6.1.0 or newer

#### Optional
* rpmbuild _(to build rpm packages only)_

## Setup
Install npm depedencies:
```$ npm install ```

## Run
To start the application, use:

```electron-forge start```

## Build
To build the application, use:
```electron-forge build```

## Package
To package the application, use:
```electron-forge make```
_Currenlty creates a .deb and .rpm file_

## Application Screenshot
![Application Screenshot](screenshot.png)