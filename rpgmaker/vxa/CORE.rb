#==============================================================================#
#                             KOCKA-CORE                                       #
#==============================================================================#
# Author  : KockaAdmiralac                                                     #
# Date    : 28/09/15 (28. September 2015)                                      #
# Version : 1.0                                                                #
# Support : https://kocka.dilfa.com                                            #
#------------------------------------------------------------------------------#
# ▼ Features ▼                                                                 #
#------------------------------------------------------------------------------#
#                                                                              #
# Implemented :                                                                #
#   - Floor Damage control! You can :                                          #
#     - Change amount of damage dealed                                         #
#     - Make an SE play while being damaged                                    #
#     - Add a probability of some state being added                            #
#   - Skip Event commands you want!                                            #
#   - Close (not restart) game on F12                                          #
#   - No blurry background in Menu and some other scenes.                      #
#   - Script calls including :                                                 #
#     - Toggle SelfSwitch on multiple events on any map!                       #
#     - Check if SelfSwitch is on for multiple events                          #
#     - Choose random picture and show it!                                     #
#     - Toggle Shake! No more parallel processings of Shake Screen!            #
#     - Show a small notification to the user                                  #
#                                                                              #
# Upcoming :                                                                   #
#   - Timer utilities : set it to count as a stopwatch!                        #
#   - To change documentation from .txt to .html or .chm                       #
#   - We'll see :)                                                             #
#                                                                              #
# Plug-n-play : NO                                                             #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Description ▼                                                              #
#------------------------------------------------------------------------------#
#                                                                              #
# This script is the core script of all Kocka scripts.                         #
#                                                                              #
# It's the only Kocka script that has a documentation, so read it CAREFULLY.   #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Installation ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# Put this script below Materials, but above "▼ Main"                          #
#                                                                              #
# Before using, make sure to read the documentation included in the file       #
# Documentation.txt !                                                          #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Requirements ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# This script is specifically made for RPG Maker VX Ace (RGSS3),               #
# and it is unlikely it will work on any other engine.                         #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Version History ▼                                                          #
#------------------------------------------------------------------------------#
# Version | Date     | Description                                             #
#_________|__________|_________________________________________________________#
# 1.0     | 28/09/15 | Initial release.                                        #
#------------------------------------------------------------------------------#
# ▼ Compatibility ▼                                                            #
#------------------------------------------------------------------------------#
#                                                                              #
# This script ALIASES the following methods :                                  #
#   - RGSSReset :                                                              #
#     - exception                                                              #
#   - Window_Base :                                                            #
#     - draw_text_ex                                                           #
#     - reset_font_settings                                                    #
#   - Game_Interpreter :                                                       #
#     - execute_commmand                                                       #
#     - setup_reserved_common_event                                            #
#     - command_231                                                            #
#   - Scene_Map :                                                              #
#     - update_call_debug                                                      #
#     - update                                                                 #
#     - terminate                                                              #
#     - start                                                                  #
#   - Game_Actor :                                                             #
#     - execute_floor_damage                                                   #
#   - Game_Screen :                                                            #
#     - update                                                                 #
#   - Game_Temp :                                                              #
#     - reserve_common_event                                                   #
#     - clear_common_event                                                     #
#   - Game_Timer :                                                             #
#     - update                                                                 #
#     - start                                                                  #
#     - stop                                                                   #
#   - SceneManager :                                                           #
#     - snapshot_for_background                                                #
#                                                                              #
#                                                                              #
# This script OVERWRITES the following methods :                               #
#   - Game_Actor :                                                             #
#     - basic_floor_damage                                                     #
#                                                                              #
# Compatibility note :                                                         #
#     What does this mean?                                                     #
#     When a script is ALIASING a method, that means, that script is ment to   #
#     be put BELOW a script that OVERWRITES that method.                       #
#     If there are two scripts that OVERWRITE the same method, only one of     #
#     them will work, and that may cause bugs and crashes.                     #
#                                                                              #
#     This script has no known compatibility bugs.                             #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Terms of use ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# Terms of use will be at http://kocka.dilfa.com/rpg/scripts as soon as I post #
# them. You can read the unofficial ones at the documentation.                 #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ FAQ ▼                                                                      #
#------------------------------------------------------------------------------#
#                                                                              #
# Let's see... what's your problem?                                            #
#                                                                              #
# 1. Something with tSYMBEG or hash-related                                    #
#   Read the Hash documentation CAREFULLY.                                     #
#   Again : DO NOT FORGET THE COMMA!!!!!!!!!!!!!!                              #
#                                                                              #
# 2. Your site is "Unsecure"???                                                #
#   Yeah, I have a self-signed HTTPS certificate, so you can just click        #
#   Advanced -> Proceed. If you just wanted terms of use, they are in the docs #
#                                                                              #
# If none of above, contact me through forums.                                 #
#                                                                              #
# * "And what if you are offline and your site is down?"                       #
#   Well, then you are screwed :)                                              #
#   Not really.                                                                #
#   Go to forums and find a section named RGSSx Script Support and start a     #
#   thread there, there are plenty of great guys willing to answer you!        #
#                                                                              #
#==============================================================================#

($imported ||= {})[:KOCKA] = {:version => 1.0}  # DO NOT REMOVE
module KOCKA                                    # DO NOT REMOVE
#==============================================================================#
#                          ▼ CONFIGURATION OPTIONS ▼                           #
#------------------------------------------------------------------------------#
#  You can edit between lines with ▼ and lines with ▲, and above SCRIPT        #
#==============================================================================#



FLOOR_DAMAGE = {
  :amount => 10,
  :se => {
    :file => "Blow4",
    :vol => 80,
    :pitch => 130,
  },
  :probability => {
    2 => 1,
  }
}

SKIP = [301, 250, 230, 225, 224, 213, 212, 105, 102, 101]

BETA_SWITCH_ID = 4

YES = {
  :text => "Yes",
  :icon => 528,
}
NO = {
  :text => "No",
  :icon => 529,
}

PAGE_SE = {
  :file => "Book1",
  :vol => 80,
  :pitch => 100,
}

BLUR = false

DISABLE_F12 = true

NOTIFICATION_WIDTH = 300



#==============================================================================#
#                                 ▼ SCRIPT ▼                                   #
#------------------------------------------------------------------------------#
# Editing stuff below this point is not recommended unless you want            #
# to crash your game, cause computer damage or plan a terrorist attack.        #
#==============================================================================#

  
  
  #--------------------------------------------------------------------------
  # * Error Handling
  #--------------------------------------------------------------------------
  def self.error_handle(script); raise(ScriptError, "Error in script 'Kocka - %s', read the FAQ and Compatibility, and check if your configuration is valid." % script); end
  
  #--------------------------------------------------------------------------
  # * Random Choice in Array
  #--------------------------------------------------------------------------
  def self.choice(arr); arr[rand(arr.length)]; end
  
end



#==============================================================================
# ** Sound
#------------------------------------------------------------------------------
#  This module plays sound effects. It obtains sound effects specified in the
# database from the global variable $data_system, and plays them.
#==============================================================================

module Sound
  include KOCKA
  
  #--------------------------------------------------------------------------
  # * Play Change Page Sound
  #--------------------------------------------------------------------------
  def self.play_change_page; PAGE_SE.to_se.play; end
  
end



#==============================================================================
# ** Keyboard
#------------------------------------------------------------------------------
#  Class that handles keyboard presses in most KOCKA scripts. 
#               WARNING : NOT YET IMPLEMENTED!!!
#==============================================================================

module Keyboard
  
  #--------------------------------------------------------------------------
  # * Constants
  #--------------------------------------------------------------------------
  API = Win32API.new("user32", "GetAsyncKeyState", "i", "i")
  API2 =  Win32API.new("user32", "GetKeyState", "i", "i")
  KEYS = {
  "A" => 0x41, "B" => 0x42, "C" => 0x43, "D" => 0x44, "E" => 0x45, "F" => 0x46, 
  "G" => 0x47, "H" => 0x48, "I" => 0x49, "J" => 0x4A, "K" => 0x4B, "L" => 0x4C, 
  "M" => 0x4D, "N" => 0x4E, "O" => 0x4F, "P" => 0x50, "Q" => 0x51, "R" => 0x52, 
  "S" => 0x53, "T" => 0x54, "U" => 0x55, "V" => 0x56, "W" => 0x57, "X" => 0x58, 
  "Y" => 0x59, "Z" => 0x5A, "0" => 0x30, "1" => 0x31, "2" => 0x32, "3" => 0x33, 
  "4" => 0x34, "5" => 0x35, "6" => 0x36, "7" => 0x37, "8" => 0x38, "9" => 0x39,
  "CONFIRM" => 0x0D,        "BACKSPACE" => 0x08,      "CAPS" => 20,             
  "LEFT" => 37,             "UP"   => 38,             "RIGHT" => 39,            
  "DOWN"  => 40,            "F2" => 0x71,
  }
  
  #--------------------------------------------------------------------------
  # * Check For Key Press
  #--------------------------------------------------------------------------
  def self.press?(key); API.call(KEYS[key]) != 0; end
  
  #--------------------------------------------------------------------------
  # * Keyboard Update
  #--------------------------------------------------------------------------
  def self.update
    KEYS.each{|k, v|
      (@presses ||= {})[k] = API.call(v) != 0
      (@triggers ||= {}).size.times{|i|@triggers.values[i] -= 1 unless @triggers.values[i] == 0}
      @triggers[k] = @presses[k] && API.call(v) == 0
    }
  end
  
  #--------------------------------------------------------------------------
  # * Check For Key Trigger
  #--------------------------------------------------------------------------
  def self.trigger
    @triggers.each{|k, v|return k if v}
    return nil
  end
  
end



#==============================================================================
# ** RGSSReset
#------------------------------------------------------------------------------
#  Exception class providing notifications for when the F12 key is pressed 
# during game execution. Name changed from the hidden class Reset before RGSS2. 
#==============================================================================

class RGSSReset < Exception
  include KOCKA
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_exception_8x3M :exception
  
  #--------------------------------------------------------------------------
  # * Raise Exception
  #--------------------------------------------------------------------------
  def exception(*args)
    exit if DISABLE_F12
    kocka_random_alias_exception_8x3M(*args)
  end
  
end



#==============================================================================
# ** Window_Base
#------------------------------------------------------------------------------
#  This is a super class of all windows within the game.
#==============================================================================

class Window_Base < Window
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_draw_text_ex :draw_text_ex
  alias :kocka_random_alias_reset_font_settings_a3m1 :reset_font_settings
  
  #--------------------------------------------------------------------------
  # * Draw Gauge With Height
  #--------------------------------------------------------------------------
  def draw_gauge_with_height(x, y, width, height, rate, color1, color2)
    fill_w = (width * rate).to_i
    gauge_y = y + line_height - 8
    contents.fill_rect(x, gauge_y, width, height, gauge_back_color)
    contents.gradient_fill_rect(x, gauge_y, fill_w, height, color1, color2)
  end
  
  #--------------------------------------------------------------------------
  # * Draw Text with Control Characters
  #--------------------------------------------------------------------------
  def draw_text_ex(x, y, text, font = nil, reset = false)
    @no_reset = reset
    if font
      contents.font.color = font[:color].to_color if font[:color]
      contents.font.name = font[:name] if font[:name]
      contents.font.size = font[:size] if font[:size]
      contents.font.outline = font[:outline] if font[:outline]
      @no_reset = true
    end
    kocka_random_alias_draw_text_ex(x, y, text)
  end
  
  #--------------------------------------------------------------------------
  # * Reset Font Settings
  #--------------------------------------------------------------------------
  def reset_font_settings
    return if @no_reset
    kocka_random_alias_reset_font_settings_a3m1
  end
  
end



#==============================================================================
# ** Game_Interpreter
#------------------------------------------------------------------------------
#  An interpreter for executing event commands. This class is used within the
# Game_Map, Game_Troop, and Game_Event classes.
#==============================================================================

class Game_Interpreter
  include KOCKA
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_command_231_aU7B :command_231
  alias :kocka_random_alias_execute_command_7F4g :execute_command
  alias :kocka_random_alias_setup_reserved_common_event_7F5h :setup_reserved_common_event
  
  #--------------------------------------------------------------------------
  # * Toggle SelfSwitch
  #--------------------------------------------------------------------------
  def ss(ss, events, map = @map_id)
    events.each{|event|$game_self_switches[[map, event, ss]] = !$game_self_switches[[map, event, ss]]} rescue return
  end
  
  #--------------------------------------------------------------------------
  # * Set SelfSwitch OFF [UNOFFICIAL]
  #--------------------------------------------------------------------------
  def ss_off(ss, events, map = @map_id)
    events.each{|event|$game_self_switches[[map, event, ss]] = false} rescue return
  end
  
  #--------------------------------------------------------------------------
  # * Is SelfSwitch on?
  #--------------------------------------------------------------------------
  def ss?(ss, events, map = @map_id)
    events.each{|event|return false if(!$game_self_switches[[map, event, ss]])} rescue return
    return true
  end
  
  #--------------------------------------------------------------------------
  # * Random Pictures
  #--------------------------------------------------------------------------
  def random_picture(*pictures); @rnd_pics = *pictures;  end
  
  #--------------------------------------------------------------------------
  # * Show Picture
  #--------------------------------------------------------------------------
  def command_231
    @params[1] = @rnd_pics[(rand * 1000).to_i % @rnd_pics.size] if @rnd_pics
    kocka_random_alias_command_231_aU7B
    @rnd_pics = nil
  end
  
  #--------------------------------------------------------------------------
  # * Toggle Screen Shake
  #--------------------------------------------------------------------------
  def toggle_shake; $game_map.screen.shake_forever = !$game_map.screen.shake_forever; end
  
  #--------------------------------------------------------------------------
  # * Toggle the Debug Command Skip
  #--------------------------------------------------------------------------
  def toggle_debug_skip; @debug_skip = !@debug_skip if $game_switches[KOCKA::BETA_SWITCH_ID]; end
  
  #--------------------------------------------------------------------------
  # * Start the Stopwatch [UNOFFICIAL]
  #--------------------------------------------------------------------------
  def start_stopwatch; $game_timer.start(0, true); end
  
  #--------------------------------------------------------------------------
  # * Stop the Stopwatch and return its value [UNOFFICIAL]
  #--------------------------------------------------------------------------
  def stop_stopwatch; $game_timer.stop; end
    
  #--------------------------------------------------------------------------
  # * Execute Command
  #--------------------------------------------------------------------------
  def execute_command
    return if SKIP.include?(@list[@index].code) && @debug_skip
    kocka_random_alias_execute_command_7F4g
  end
  
  #--------------------------------------------------------------------------
  # * Detect/Set Up Call-Reserved Common Events 
  #--------------------------------------------------------------------------
  def setup_reserved_common_event
    @common_event_args = $game_temp.common_event_args
    kocka_random_alias_setup_reserved_common_event_7F5h
  end
  
  #--------------------------------------------------------------------------
  # * Send Notification
  #--------------------------------------------------------------------------
  def notification(text, icon = nil); SceneManager.scene.notification = [text, icon] if SceneManager.scene_is?(Scene_Map); end
  
end



#==============================================================================
# ** Scene_Map
#------------------------------------------------------------------------------
#  This class performs the map screen processing.
#==============================================================================

class Scene_Map
  include KOCKA
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_update_call_debug_0F4s :update_call_debug
  alias :kocka_random_alias_update_8B5m :update
  alias :kocka_random_alias_start_1b6C :start
  alias :kocka_random_alias_terminate_6Vrm :terminate
  
  #--------------------------------------------------------------------------
  # * Start Processing
  #--------------------------------------------------------------------------
  def start
    kocka_random_alias_start_1b6C
    $game_temp.notifications = []
  end
  
  #--------------------------------------------------------------------------
  # * Set Notification
  #--------------------------------------------------------------------------
  def notification=(n)
    window = Window_MenuHelp.new((Graphics.width - NOTIFICATION_WIDTH) / 2, $game_temp.notifications.size * 24, NOTIFICATION_WIDTH, 48, 0)
    window.set(n)
    $game_temp.notifications << [window, 0]
  end
  
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    kocka_random_alias_update_8B5m
    i = -1
    $game_temp.notifications.size.times{
      i += 1
      next unless $game_temp.notifications[i]
      if $game_temp.notifications[i][0].openness == 0
        $game_temp.notifications.shift
        next
      end
      $game_temp.notifications[i][1] += 1
      $game_temp.notifications[i][0].openness -= 10 if $game_temp.notifications[i][1] >= 120
      if $game_temp.notifications[i][0].openness == 0
        $game_temp.notifications[i][0].dispose
        $game_temp.notifications.delete_at(i)
        i -= 1
      end
    }
  end
  
  #--------------------------------------------------------------------------
  # * Determine if Debug Call by F9 key
  #--------------------------------------------------------------------------
  def update_call_debug
    kocka_random_alias_update_call_debug_0F4s
    SceneManager.call(Scene_Debug) if $game_switches[BETA_SWITCH_ID] && Input.press?(:F9)
  end
  
  #--------------------------------------------------------------------------
  # * Terminate
  #--------------------------------------------------------------------------
  def terminate
    kocka_random_alias_terminate_6Vrm
    $game_temp.notifications.each{|n|n[0].dispose}
  end
  
end



#==============================================================================
# ** Game_Actor
#------------------------------------------------------------------------------
#  This class handles actors. It is used within the Game_Actors class
# ($game_actors) and is also referenced from the Game_Party class ($game_party).
#==============================================================================

class Game_Actor < Game_Battler
  include KOCKA
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_execute_floor_damage_pFy6 :execute_floor_damage
  
  #--------------------------------------------------------------------------
  # * Get Base Value for Floor Damage
  #--------------------------------------------------------------------------
  def basic_floor_damage; return FLOOR_DAMAGE[:amount]; end
    
  #--------------------------------------------------------------------------
  # * Floor Damage Processing
  #--------------------------------------------------------------------------
  def execute_floor_damage
    kocka_random_alias_execute_floor_damage_pFy6
    FLOOR_DAMAGE[:se].to_se.play if FLOOR_DAMAGE[:se]
    FLOOR_DAMAGE[:probability].each{|i, v| add_state(i) if(rand(99) < v)} if FLOOR_DAMAGE[:probability]
  end
  
end



#==============================================================================
# ** Game_Screen
#------------------------------------------------------------------------------
#  This class handles screen maintenance data, such as changes in color tone,
# flashes, etc. It's used within the Game_Map and Game_Troop classes.
#==============================================================================

class Game_Screen
  
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :shake_forever
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_update_7F52 :update
  
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    @shake_duration = 1 if @shake_forever
    kocka_random_alias_update_7F52
  end
  
end



#==============================================================================
# ** Hash
#------------------------------------------------------------------------------
#  The hash class.
#==============================================================================

class Hash
  
  #--------------------------------------------------------------------------
  # * Hash to Color
  #--------------------------------------------------------------------------
  def to_color; return Color.new(self[:r], self[:g], self[:b]); end
    
  #--------------------------------------------------------------------------
  # * Hash to SE
  #--------------------------------------------------------------------------
  def to_se; return RPG::SE.new(self[:file], self[:vol], self[:pitch]); end
  
  #--------------------------------------------------------------------------
  # * Hash to ME
  #--------------------------------------------------------------------------
  def to_me; return RPG::ME.new(self[:file], self[:vol], self[:pitch]); end
  
  #--------------------------------------------------------------------------
  # * Hash to Condition
  #--------------------------------------------------------------------------
  def to_condition
    case self[:type]
      when :switch then $game_switches[self[:switch]]
      when :selfswitch then $game_self_switches[[self[:map], self[:event], self[:switch]]]
      when :variable then eval("$game_variables[self[:variable]] " + self[:operation] + self[:other].to_s)
      when :random then rand(self[:seed]).to_i == 0
      when :item then $game_party.has_item?($data_items[self[:item]])
      when :skill then $game_party.members.each{|m|return true if m.skill_learn?($data_skills[self[:skill]])}
    end
  end
    
end



#==============================================================================
# ** Hash
#------------------------------------------------------------------------------
#  The array class. The elements of an array are arbitrary Ruby objects.
#==============================================================================

class Array
  
  #--------------------------------------------------------------------------
  # * Array to Color
  #--------------------------------------------------------------------------
  def to_color; return Color.new(self[0], self[1], self[2]); end
    
  #--------------------------------------------------------------------------
  # * Array to SE
  #--------------------------------------------------------------------------
  def to_se; return RPG::SE.new(self[0], self[1], self[2]); end
  
  #--------------------------------------------------------------------------
  # * Array to ME
  #--------------------------------------------------------------------------
  def to_me; return RPG::ME.new(self[0], self[1], self[2]); end
  
  #--------------------------------------------------------------------------
  # * Array to Condition
  #--------------------------------------------------------------------------
  def to_condition
    case self[0]
      when :switch then $game_switches[self[1]]
      when :selfswitch then $game_self_switches[[self[1], self[2], self[3]]]
      when :variable then eval("$game_variables[self[1]] " + self[2] + self[3].to_s)
      when :random then rand(self[1]).to_i == 0
      when :item then $game_party.has_item?($data_items[self[1]])
      when :skill then $game_party.members.each{|m|return true if m.skill_learn?($data_skills[self[1]])}
    end
  end
  
end
  


#==============================================================================
# ** String
#------------------------------------------------------------------------------
#  The string class. Can handle character sequences of arbitrary lengths.
#==============================================================================

class String
  
  #--------------------------------------------------------------------------
  # * Turn backslashes to slashes
  #--------------------------------------------------------------------------
  def to_slash
    a = ""
    self.split("\\").each{|s|a += s + "/"}
    return a[0, (a.length - 1)]
  end
  
end



#==============================================================================
# ** Game_Temp
#------------------------------------------------------------------------------
#  This class handles temporary data that is not included with save data.
# The instance of this class is referenced by $game_temp.
#==============================================================================

class Game_Temp
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_reserve_common_event_1P3v :reserve_common_event
  alias :kocka_random_alias_clear_common_event_0M2q :clear_common_event 
  
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :common_event_args
  attr_accessor :notifications
  
  #--------------------------------------------------------------------------
  # * Reserve Common Event Call
  #--------------------------------------------------------------------------
  def reserve_common_event(*args)
    kocka_random_alias_reserve_common_event_1P3v(args[0])
    @common_event_args = args[1] if args[1]
  end
  
  #--------------------------------------------------------------------------
  # * Clear Common Event Call Reservation
  #--------------------------------------------------------------------------
  def clear_common_event
    kocka_random_alias_clear_common_event_0M2q
    @common_event_args = nil
  end
  
end



#==============================================================================
# ** Game_Timer
#------------------------------------------------------------------------------
#  This class handles timers. Instances of this class are referenced by 
# $game_timer.
#==============================================================================

class Game_Timer
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_update_3m5B :update
  alias :kocka_random_alias_start_4v7Y :start
  alias :kocka_random_alias_stop_6Be0 :stop
  
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    if @reverse && @working
      @count += 1
      return
    end
    kocka_random_alias_update_3m5B
  end
  
  #--------------------------------------------------------------------------
  # * Start
  #--------------------------------------------------------------------------
  def start(count, reverse = false)
    kocka_random_alias_start_4v7Y(count)
    @reverse = reverse
  end
  
  #--------------------------------------------------------------------------
  # * Stop
  #--------------------------------------------------------------------------
  def stop
    kocka_random_alias_stop_6Be0
    return @count
  end
  
end



#==============================================================================
# ** Window_YesNo
#------------------------------------------------------------------------------
#  This window is used to display Yes/No command in most KOCKA scripts.
#==============================================================================

class Window_YesNo < Window_HorzCommand
  include KOCKA
  
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :yes
  attr_accessor :no
  attr_reader   :col_max
  attr_reader   :item_max
  attr_reader   :window_height
  attr_reader   :window_width
    
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize(yes = YES, no = NO)
    @yes = yes
    @no = no
    @window_width = 160
    @window_height = 50
    @item_max = 2
    @col_max = 2
    super(((Graphics.width - window_width) / 2), (Graphics.height - window_height) / 2)
    add_command(@yes[:text], :yes)
    add_command(@no[:text], :no)
  end
  
  #--------------------------------------------------------------------------
  # * Draw Item
  #--------------------------------------------------------------------------
  def draw_item(index)
    rect = item_rect_for_text(index)
    rect.x += 24
    rect.width -= 24
    draw_text_ex(rect.x, rect.y, index == 0 ? @yes[:text] : @no[:text])
    draw_icon(index == 0 ? @yes[:icon] : @no[:icon], 72 * index, 0)
  end
  
end



#==============================================================================
# ** Window_MenuHelp
#------------------------------------------------------------------------------
#  This window is used to display help text in most KOCKA scripts.
#==============================================================================

class Window_MenuHelp < Window_Base
  
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize(a, b, c, d, o = 255)
    super(a, b, c, d)
    self.opacity = o
    @index = 0
  end
  
  #--------------------------------------------------------------------------
  # * Refresh
  #--------------------------------------------------------------------------
  def refresh
    contents.clear
    draw_text_ex(30, 0, @text) if @text
    draw_icon(@icon, 0, 0) if @icon
    draw_face(@face.face_name, @face.face_index, Graphics.width - 120, 0) if @face
  end
  
  #--------------------------------------------------------------------------
  # * Set Text and Icon
  #--------------------------------------------------------------------------
  def set(a)
    if a.is_a?(Array)
      @text = a[0]
      @icon = a[1] if a[1]
    else
      @text = a.name + "\n" + a.description
      @icon = a.icon_index
    end
    refresh
  end
  
  #--------------------------------------------------------------------------
  # * Set Face
  #--------------------------------------------------------------------------
  def set_face(a); @face = a; end
  
end



#==============================================================================
# ** SceneManager
#------------------------------------------------------------------------------
#  This module manages scene transitions. For example, it can handle
# hierarchical structures such as calling the item screen from the main menu
# or returning from the item screen to the main menu.
#==============================================================================

class << SceneManager
  
  #--------------------------------------------------------------------------
  # * Aliases
  #--------------------------------------------------------------------------
  alias :kocka_random_alias_snapshot_for_background_zE6b :snapshot_for_background
  
  #--------------------------------------------------------------------------
  # * Create Snapshot to Use as Background
  #--------------------------------------------------------------------------
  def snapshot_for_background
    $game_temp.notifications.each{|n|n[0].openness = 0} if $game_temp.notifications
    if KOCKA::BLUR then kocka_random_alias_snapshot_for_background_zE6b
    else
      @background_bitmap.dispose if @background_bitmap
      @background_bitmap = Graphics.snap_to_bitmap
    end
  end
  
end



#==============================================================================#
#                             ■ END OF SCRIPT ■                                #
#==============================================================================#