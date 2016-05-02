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
PhoneGap provides a great cloud-based build service at [Build.PhoneGap](https://build.phonegap.com/apps).  We simply created an account there, pointed it to this Github repo, and clicked the "build" button.  It will build your app artifacts for every platform you want.  From there, you upload your artifact (.apk file for Android, for example) to the appropriate store (Google Play or Apple App Store).  PhoneGap Build uses the `config.xml` file in the www directory.  All of the documentation for `config.xml` is found [here](http://docs.build.phonegap.com/en_US/configuring_basics.md.html#The%20Basics).

Before building you must generate security certificates for each platform.  PhoneGap has good instructions for how to do that for [iOS here](http://docs.build.phonegap.com/en_US/signing_signing-ios.md.html) and [Android here](http://docs.build.phonegap.com/en_US/signing_signing-android.md.html#Android%20Signing).  After that, we just followed the instructions on the Build site to generate the application.  PhoneGap has a comprehensive documentation about [understanding the build process](http://docs.build.phonegap.com/en_US/introduction_what_is_build.md.html#What%20is%20Build).

*One important note!* -- you must build your project locally before committing to Git and pushing to Github.  This will populate the platforms folders with any recent changes you have made to the www directory. To do this, issue these commands for each platform from the project root directory (one above www):

```
cordova platform update android --save
cordova platform update ios --save
```

## iOS
We followed [this guide](http://wiki.nsbasic.com/Submitting_to_the_iOS_App_Store) to set up everything we needed to get on the Apple App Store.  

### Application Icons for iOS
Regarding icons in the above guide, however, the section in there about icons is confusing and misleading.  To get the icons and splash screens to work, we created the actual icons and splash files in these directories, and added them to the `config.xml` like this:
````xml
    <icon src="res/icon/ios/icon.png" gap:platform="ios" width="57" height="57" />
    <icon src="res/icon/ios/icon@2x.png" gap:platform="ios" width="114" height="114" />
    <icon src="res/icon/ios/icon-40.png" gap:platform="ios" width="40" height="40" />
    <icon src="res/icon/ios/icon-40@2x.png" gap:platform="ios" width="80" height="80" />
    <icon src="res/icon/ios/icon-50.png" gap:platform="ios" width="50" height="50" />
    <icon src="res/icon/ios/icon-50@2x.png" gap:platform="ios" width="100" height="100" />
    <icon src="res/icon/ios/icon-60.png" gap:platform="ios" width="60" height="60" />
    <icon src="res/icon/ios/icon-60@2x.png" gap:platform="ios" width="120" height="120" />
    <icon src="res/icon/ios/icon-60@3x.png" gap:platform="ios" width="180" height="180" />
    <icon src="res/icon/ios/icon-72.png" gap:platform="ios" width="72" height="72" />
    <icon src="res/icon/ios/icon-72@2x.png" gap:platform="ios" width="144" height="144" />
    <icon src="res/icon/ios/icon-76.png" gap:platform="ios" width="76" height="76" />
    <icon src="res/icon/ios/icon-76@2x.png" gap:platform="ios" width="152" height="152" />
    <icon src="res/icon/ios/icon-114.png" gap:platform="ios" width="114" height="114" />
    <icon src="res/icon/ios/icon-144.png" gap:platform="ios" width="144" height="144" />
....
    <platform name="ios">
        <icon height="57" platform="ios" src="icon/ios/icon.png" width="57" />
        <icon height="114" platform="ios" src="icon/ios/icon@2x.png" width="114" />
        <icon height="40" platform="ios" src="icon/ios/icon-40.png" width="40" />
        <icon height="80" platform="ios" src="icon/ios/icon-40@2x.png" width="80" />
        <icon height="50" platform="ios" src="icon/ios/icon-50.png" width="50" />
        <icon height="100" platform="ios" src="icon/ios/icon-50@2x.png" width="100" />
        <icon height="60" platform="ios" src="icon/ios/icon-60.png" width="60" />
        <icon height="120" platform="ios" src="icon/ios/icon-60@2x.png" width="120" />
        <icon height="180" platform="ios" src="icon/ios/icon-60@3x.png" width="180" />
        <icon height="72" platform="ios" src="icon/ios/icon-72.png" width="72" />
        <icon height="144" platform="ios" src="icon/ios/icon-72@2x.png" width="144" />
        <icon height="76" platform="ios" src="icon/ios/icon-76.png" width="76" />
        <icon height="152" platform="ios" src="icon/ios/icon-76@2x.png" width="152" />
        <icon height="29" platform="ios" src="icon/ios/icon-small.png" width="29" />
        <icon height="58" platform="ios" src="icon/ios/icon-small@2x.png" width="58" />
        <icon height="87" platform="ios" src="icon/ios/icon-small@3x.png" width="87" />
        <splash src='splash/ios/Default.png' width='320' height='480' />
        <splash src='splash/ios/Default@2x.png' width='640' height='960' />
        <splash src='splash/ios/Default-568h@2x.png' width='640' height='1136' />
        <splash src='splash/ios/Default-Portrait.png' width='768' height='1024' />
        <splash src='splash/ios/Default-Landscape.png' width='1024' height='768' />
        <splash src='splash/ios/Default-Portrait@2x.png' width='1536' height='2048' />
        <splash src='splash/ios/Default-Landscape@2x.png' width='2048' height='1536' />
    </platform>

````
TODO: I read somewhere that the `<platform name="XXX"></platform>` block is the preferred method to specify these things over `<icon ... gap:platform="ios" ... />` -- need to test this and remove the `<icon>` elements if that is true.

### Building/making distribution for iOS
Apple has alot of restrictions for creating and installing the application file (.ipa file).  First, you can create two types of .ipa files -- one for an ad-hoc build, aka "developer", (where you install it directly on your phone from your Mac thru iTunes), and also a "distribution" .ipa for submission to the App Store.  In the developer.apple.com admin site, you need to do two important things -- set up both a certificate and provisioning profile for each *development* and *distribution*.   For the development provisioning profile, you must identify each phone on which you want to install the app.  (First you identify the phone by adding it as a device in the "Devices" section).   When building the app on build.phonegap.com, you need to create a key for each iOS deployment type.  Name the keys appropriately, so you know which is which.  When you create the key here, you will upload the certificate and provisioning profile per type (either development or distribution).   Then, when you want to build a .ipa file, you must select the correct key for the type of .ipa you want.  You cannot install an .ipa file that was generated from a 'distribution' certificate/provisioning profile directly via iTunes locally on your phone... the iTunes installation process will just hang saying "Installing..." and never return.  And vice-versa, you will get an error if you attempt to upload an .ipa file for development to the App Store.  

To upload the .ipa to the app store, we used Application Loader from Apple. 


## Android
### Application Icons for Android
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
The thing that was difficult to find in documentation is that you are required to generate the different sized icons.  Fortunately, this is made VERY easy with this [great icon generation tool](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html). (Tip: for that icon generation tool, to get a transparent background choose "shape: none".)  Also, [this answer](http://stackoverflow.com/questions/5350624/set-icon-for-android-application) is what helped us figure it out.


