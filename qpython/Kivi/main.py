#qpy:kivy
# Copyright 2015 KockaAdmiralac
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#  http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

__author__ = "KockaAdmiralac <1405223@gmail.com>"
__license__ = "Apache License v2.0"
__copyright__ = "Nevermore Inc. All rights reserved."
import ks
import os
import kivy
kivy.require('1.4.0')
from kivi_conf import *
from random import randint
from random import choice
from kivy.app import App
from kivy.clock import Clock
from kivy.vector import Vector
from kivy.logger import Logger
from kivy.uix.widget import Widget
from kivy.uix.togglebutton import ToggleButton
from kivy.properties import NumericProperty, ReferenceListProperty, ObjectProperty
from androidhelper import Android
andro = Android()
        

class Kivi(Widget):
    score = NumericProperty(0)
    time = NumericProperty(0)
    viewScore = NumericProperty(0)
    viewTime = NumericProperty(0)
    def __init__(self, **kwargs):
        super(Kivi, self).__init__(**kwargs)
        ball = ObjectProperty(None)
        self.mod = ks.listItems(['Classic' , 'Timed' , 'Challenge', 'Accurate' , 'Accurate & Fast', "Don't touch the wall!"], "Select a mode : ")
        self.result = ""
        if(self.mod == 0 or self.mod == 2): self.score = int(andro.dialogGetInput("Level","How many times do you want to click?").result)
        else : self.score = 0
        if(self.mod == 1 or self.mod == 2 or self.mod == 4): self.time = int(andro.dialogGetInput("Time","How much time do you want to play?").result)
        elif(self.mod == 3): self.time = int(andro.dialogGetInput("Level","How many times do you want to click?").result)
        elif(self.mod == 5): self.time = int(andro.dialogGetInput("Lives","How many lives do you want to have?").result)
        else: self.time = 0
        
        
    def exit_game(self):
        self.result = {
        	1 : self.score,
        	0 : int(self.time),
        	2 : self.result,
        	3 : self.score,
        	4 : self.score,
        	5 : self.score,
        }[self.mod]
        ks.message("Result : %s!" % self.result)
        if(HIGHSCORES):
            ks.xorfile("highscores.txt")
            rFile = open("highscores.txt")
            wFile = open("temp_highscores", "w")
            for line in rFile: wFile.write(line)
            wFile.write("Name : %s \nResult : %s \nMod : %s \n\n" % (andro.dialogGetInput("Name","Enter your name : ").result, self.result, self.mod))
            wFile.close()
            rFile.close()
            os.system("rm highscores.txt")
            os.rename("temp_highscores","highscores.txt")
            ks.xorfile("highscores.txt")
        andro.mediaPlay("stagod.ogg", 'default', False)
        exit()
    
    def serveBall(self):
        self.ball.center = self.center
        self.ball.brzina = Vector(4, 0).rotate(randint(0, 360))
    
    def update(self, dt):
        self.time += {
        	1 : -FRAME,
        	0 : +FRAME,
        	2 : -FRAME,
        	3 : 0,
        	4 : -FRAME,
        	5 : 0,
        }[self.mod]
        self.ball.move()
        if (self.ball.y < 0) or (self.ball.top > self.height): 
            if(self.mod == 5): self.time -= 1
            self.ball.brzina_y *= -1
        if (self.ball.x < 0) or (self.ball.right > self.width): 
            if(self.mod == 5): self.time -= 1
            self.ball.brzina_x *= -1
        if (self.time <= 0 and (self.mod == 1 or self.mod == 3 or self.mod == 4 or self.mod == 5)) or (self.score==0 and self.mod==0): self.exit_game()
        elif (self.time >= 0 and self.mod == 2 and self.score <= 0):
            self.result = "PASS"
            self.exit_game()
        elif (self.time < 0 and self.mod == 2):
            self.result = "FAIL"
            self.exit_game()
            
    def on_touch_down(self, touch):
        if (touch.x < self.ball.center_x + 50) and (touch.x > self.ball.center_x - 50) and (touch.y < self.ball.center_y + 50) and (touch.y > self.ball.center_y - 50) : 
            self.score += {
             1 : 1,
             0 : -1,
             2 : -1,
             3 : 1,
             4 : 2,
             5 : 1,
            }[self.mod]
            vx, vy = self.ball.brzina
            if(touch.x > self.ball.center_x): vx *= -1.1
            else: vy *= -1.1
            self.ball.brzina = Vector(vx, vy)
        elif(self.mod == 4): self.score -= 1
        if(self.mod == 3): self.time -= 1
        

class KiviBall(Widget):
    brzina_x = NumericProperty(0)
    brzina_y = NumericProperty(0)
    brzina = ReferenceListProperty(brzina_x, brzina_y)
    def move(self):
        self.pos = Vector(*self.brzina) + self.pos



class KiviApp(App):
    def build(self):
        if(AUDIO):
            if(ks.yesNo("Play audio?")):
                andro.setMediaVolume(int(andro.dialogGetInput("Media volume","Enter media volume : ").result))
                andro.mediaPlay(os.getcwd() + "/audio/%s" % choice(MEDIA)).result
        game = Kivi()
        game.serveBall()
        Clock.schedule_interval(game.update, 1.0/60.0)
        return game
        
if __name__ == '__main__': KiviApp().run()
