import ks
from androidhelper import Android
andro = Android()

if(not andro.checkWifiState().result and ks.yesNo("Turn Wi-Fi on?")): andro.toggleWifiState()
elif(not andro.checkWifiState().result): exit()

def scanResults():
    if(andro.wifiGetConnectionInfo().result['network_id'] != -1): return andro.wifiGetConnectionInfo().result
    for result in andro.wifiGetScanResults().result : 
        print("\n")
        for key in result: print(key, " : ", result[key])
    return 0

a = scanResults()
if(a): print(a)