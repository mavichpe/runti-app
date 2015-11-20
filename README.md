# runti
Aplicacion iOs y andoird


Para compitar

cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore runti.keystore platforms/android/ant-build/bbapp-release-unsigned.apk runti

zipalign -v 4 platforms/android/ant-build/bbapp-release-unsigned.apk runti.apk