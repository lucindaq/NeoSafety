# Welcome to the NeoSafety Project

## Setup
### Prerequisites
1. NodeJS

### First time commands:
1. `npm install -g ripple-emulator`
2. `npm install -g cordova`

## Running the emulator

The Ripple emulator is really good for testing code immediately and seeing results in the browser on your computer. After you get things working there, then you can test it on your phone later using PhoneGap app.  From the project directory (`NeoSafety`), issue the command `ripple emulate`

## Running PhoneGap

You must install the [PhoneGap](http://docs.phonegap.com/getting-started/1-install-phonegap/desktop/) application.  Start PhoneGap, then click the "+" icon to add this project.  Select "Open Existing PhoneGap project" and navigate to this project folder.  This Mac or Windows PhoneGap app allows you to test your application on your phone -- this program "hosts" your app, and you install the PhoneGap phone app on your phone, and then connect to the laptop PhoneGap app. 

## Building the Project
PhoneGap provides a great cloud-based build service at [Build.PhoneGap](https://build.phonegap.com/apps).  We simply created an account there, pointed it to this Github repo, and clicked the "build" button.  It will build your app artifacts for every platform you want.  From there, you upload your artifact (.apk file for Android, for example) to the appropriate store (Google Play or Apple App Store).

Before building you must generate security certificates for each platform.  PhoneGap has good instructions for how to do that for [iOS here](http://docs.build.phonegap.com/en_US/signing_signing-ios.md.html) and [Android here](http://docs.build.phonegap.com/en_US/signing_signing-android.md.html#Android%20Signing).  After that, we just followed the instructions on the Build site to generate the application.  PhoneGap has a comprehensive documentation about [understanding the build process](http://docs.build.phonegap.com/en_US/introduction_what_is_build.md.html#What%20is%20Build).

*One important note!* -- you must build your project locally before committing to Git and pushing to Github.  This will populate the platforms folders with any recent changes you have made to the www directory. To do this, issue these commands for each platform from the project root directory (one above www):

```
cordova platform update android --save
cordova platform update ios --save
```

## Application Icons for Android
Getting the proper icons set up for Android was a challenge... It is not transparent to PhoneGap -- you need to understand how Android manages icons.  To this end the following resources were very useful to solve it.  We ended up creating icons for each resolution size, naming them all "icon.png", placed in the www/res/drawable* folders.  The relevant segment of www/config.xml is:
````xml
    <icon src="icon.png" />
    <icon src="res/drawable-ldpi/icon.png"   gap:platform="android"    gap:density="ldpi" />
    <icon src="res/drawable-mdpi/icon.png"   gap:platform="android"    gap:density="mdpi" />
    <icon src="res/drawable-hdpi/icon.png"   gap:platform="android"    gap:density="hdpi" />
    <icon src="res/drawable-xhdpi/icon.png"  gap:platform="android"    gap:density="xhdpi" />
    <icon src="res/drawable-xxhdpi/icon.png"  gap:platform="android"    gap:density="xxhdpi" />
    <icon src="res/drawable-xxxhdpi/icon.png"  gap:platform="android"    gap:density="xxxhdpi" />
    <platform name="android">
        <icon density="ldpi" src="www/res/drawable-ldpi/icon.png" />
        <icon density="mdpi" src="www/res/drawable-mdpi/icon.png" />
        <icon density="hdpi" src="www/res/drawable-hdpi/icon.png" />
        <icon density="xhdpi" src="www/res/drawable-xhdpi/icon.png" />
        <icon density="xxhdpi" src="www/res/drawable-xxhdpi/icon.png" />
        <icon density="xxxhdpi" src="www/res/drawable-xxxhdpi/icon.png" />
        ...
    </platform>
  ...
````
The thing that was difficult to find in documentation is that you are required to generate the different sized icons.  Fortunately, this is made VERY easy with this [great icon generation tool](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html).  Also, [this answer](http://stackoverflow.com/questions/5350624/set-icon-for-android-application) is what helped us figure it out.


