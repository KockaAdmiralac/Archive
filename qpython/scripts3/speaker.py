import sl4a
droid = sl4a.Android()
while True: droid.ttsSpeak(droid.dialogGetInput("Speak","What would you like to say?").result)
