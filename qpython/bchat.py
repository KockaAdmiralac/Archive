from androidhelper import Android
import time

andro = Android()

class Chat():
    def __init__(self):
        self.name = andro.bluetoothGetLocalName()
        andro.bluetoothMakeDiscoverable()
        if(andro.bluetoothGetScanMode().result == -1): exit()
        """andro.dialogCreateAlert("Connect or accept?")
        andro.dialogSetPositiveButtonText("Connect")
        andro.dialogSetNegativeButtonText("Accept")
        andro.dialogShow()
        ca = andro.dialogGetResponse().result
        if(ca.has_key("which")): ca = ca["which"]
        else: exit()
        uuid = andro.dialogGetInput("UUID","Enter the UUID of the second person (default used if none)").result
        if(uuid == None): uuid = "457807c0-4897-11df-9879-0800200c9a66"
        if(ca == "negative"): result = self.accept(uuid)
        else: result = self.connect(uuid)"""
        uuid = "457807c0-4897-11df-9879-0800200c9a66"
        self.accept(uuid)
        if(result.error != None):
            self.error(result.error, uuid)
    
    def accept(self, uuid):
        try:
            timeout = int(andro.dialogGetInput("Timeout","How much time do you want to listen for connection?").result)*1000
        except ValueError:
            timeout = 10000
        except TypeError:
            timeout = 10000
        result = andro.bluetoothAccept(uuid, timeout)
        return result
        
        
    def connect(self, uuid):
        address = andro.dialogGetInput("Address","What's the Blutooth address of other device?").result
        return andro.bluetoothConnect(uuid, address)

    def error(self, error, uuid):
        try:
            text = {
                "java.io.IOException: Connection timed out":" Connection timed out. Check if other device is listening for connection",
                "java.lang.IllegalArgumentException: Invalid UUID: " + uuid : "Invalid UUID. Please select a new one."
            	}[error]
        except KeyError:
            text = "Unknown error: " + error
        andro.dialogCreateAlert(text)
        andro.dialogShow()
        time.sleep(2)
        andro.dialogDismiss()
        self.__init__()

cht = Chat()