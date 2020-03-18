class Chat():
    def __init__(self):
        self.chat = []
    
    def say(self, user, message):
        self.chat.append({
        	"name":user,
        	"message":message
        	})