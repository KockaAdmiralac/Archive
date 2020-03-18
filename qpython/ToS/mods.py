import std
import tos_origin
import sqlite3
from random import Random
from androidhelper import Android

rnd = Random()
andro = Android()
conn = sqlite3.connect("/mnt/sdcard/com.hipipal.qpyplus/scripts/ToS/data.db")
cur = conn.cursor()

cur.execute("SELECT * FROM `All Any`")

print cur.fetchall()

# cur.execute("CREATE TABLE `user_mods` (name varchar(50), role1 varchar(25), role2 varchar(25), role3 varchar(25), role4 varchar(25), role5 varchar(25), role6 varchar(25), role7 varchar(25), role8 varchar(25), role9 varchar(25), role10 varchar(25), role11 varchar(25), role12 varchar(25), role13 varchar(25), role14 varchar(25), role15 varchar(25))")

name = andro.dialogGetInput("Name","Enter a name for the mod.").result
if(not name): name = str(rnd.randint(1,99999999999))
cur.execute("CREATE TABLE `"+name+"`(role varchar(25))")
cur.execute("INSERT INTO `"+name+"` VALUES('"+name+"')")
i = 0
while(i < tos_origin.MAX_LIMIT): 
    role = "Any"
    if(role in tos_origin.ROLES or role in tos_origin.RANDOMS): 
        cur.execute("INSERT INTO `"+name+"` VALUES('"+role+"')")
        i += 1
    else: std.message("Enter a valid role!")
    

conn.close()
    
    