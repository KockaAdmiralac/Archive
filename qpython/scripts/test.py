import ks
"""from xml.etree import ElementTree as xmlTree
from androidhelper import Android
xmlFile = xmlTree.parse("messages.xml")
xmlRoot = xmlFile.getroot()
andro = Android()
MESSAGES = {}
users = ks.UserSystem()
for message in xmlRoot:
    try: MESSAGES[message.attrib["to"]].__setitem__(message.attrib["from"], messages.attrib["message"])
    except KeyError:
        MESSAGES.__setitem__(message.attrib["to"], {})
        MESSAGES[message.attrib["to"]].__setitem__(message.attrib["from"], messages.attrib["message"])
user = users.USERS[ks.listItems(users.USERNAMES, "To : ")]
MESSAGES[users.USERNAMES[user]].__setitem__(users.loggedIn[0].name,andro.dialogGetInput("Message", "Enter a message : ").result)
print MESSAGES"""
