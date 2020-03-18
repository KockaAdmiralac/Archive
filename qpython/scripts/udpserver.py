import ksserver
import socket
conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 178.221.120.135
PORT = int(raw_input("On which port to send/receive messages?\n"))
if(raw_input("Be a server? [y/n] ") == "y"): 
    SERVER = True
    IP = raw_input("On which IP to send messages?\n")
    conn.connect((IP , PORT))
else: 
    SERVER = False
    IP = socket.gethostname()
    conn.bind((IP , PORT))
    #conn.listen(5)
print socket.gethostname()
while True:
    if(SERVER): conn.sendto(raw_input("Enter the message to send: "), (IP,PORT))
    else:
        (MESSAGE , DATA) = conn.recvfrom(1024)
        if(MESSAGE != ''): print("\nFrom : %s\nMessage : %s\n" % (DATA[0], MESSAGE))
        else:
            print("Connection interrupted!")
            exit()
