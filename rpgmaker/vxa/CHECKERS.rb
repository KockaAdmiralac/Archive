#==============================================================================#
#                                 CHECKERS                                     #
#==============================================================================#
# Author  : KockaAdmiralac                                                     #
# Date    : 25/10/15 (25. October 2015.)                                       #
# Version : 1.0                                                                #
#------------------------------------------------------------------------------#
# ▼ Description ▼                                                              #
#------------------------------------------------------------------------------#
#                                                                              #
# Well, this script allows you to play Checkers minigame.                      #
# You know what Checkers are, don't you?  ;-)                                  #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Installation ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# Put this script above "▼ Main"                                               #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Script Calls ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# - play_checkers                                                              #
#   It's obvious, isn't it?                                                    #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Requirements ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# Required graphics are in "Graphics.zip" file shipped with the script.        #
# More details where to put those are in README.txt in that file.              #
#                                                                              #
# This script is specifically made for RPG Maker VX Ace (RGSS3),               #
# and it is unlikely it will work on any other engine.                         #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Version History ▼                                                          #
#------------------------------------------------------------------------------#
# Version | Date     | Description                                             #
#_________|__________|_________________________________________________________#
# 1.0     | 25/10/15 | Initial release.                                        #
#------------------------------------------------------------------------------#
# ▼ Examples ▼                                                                 #
#------------------------------------------------------------------------------#
#                                                                              #
# (Put examples here)                                                          #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Compatibility ▼                                                            #
#------------------------------------------------------------------------------#
#                                                                              #
# This script has EXTREME compatibility.                                       #
# That's all you need to know.                                                 #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Credits ▼                                                                  #
#------------------------------------------------------------------------------#
#                                                                              #
# - KockaAdmiralac (script author)                                             #
# - Everybody from Team Good  (you can find them at https://goo.gl/xq2Oab)     #
# - Schlangan                                                                  #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Terms of use ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# 1. You may use this game in both commercial and non-commercial games.        #
#                                                                              #
# 2. I do not require the free copy of the game, although PM'ing me on the     #
#    http://forums.rpgmakerweb.com would be kindly appreciated.                #
#                                                                              #
# 3. You may NOT publish this script or any part or modification of it         #
#    as your own product. This is the strictest rule of all the terms.         #
#                                                                              #
# 4. If you modified this script, feel free to publish it on the               #
#    http://forums.rpgmakerweb.com as long as you keep the original credits    #
#    of the product makers.                                                    #
#                                                                              #
# 5. You must give credit to everybody listed above.                           #
#                                                                              #
#==============================================================================#

module TEAM_GOOD  # DO NOT REMOVE
  module CHECKERS # DO NOT REMOVE
#==============================================================================#
#                          ▼ CONFIGURATION OPTIONS ▼                           #
#------------------------------------------------------------------------------#
#  You can edit between lines with ▼ and lines with ▲, and above SCRIPT        #
#==============================================================================#



# MUSIC - What music will be playing while in battle?
# Set to nil to disable.
#       ["BGM Name", Volume, Pitch],
MUSIC = ["Battle4",  100,    100  ]

# DEFAULT_GRAPHICS - What are the default character graphics?
# There are two arrays, :good and :evil, and they change graphics of respectful
# parties.
# For example, putting :
#   :good => ["Actor4", 0]
# will change default graphics to Eric's default graphic.
# Default graphics will appear if character graphic indexes are not defined in
# GRAPHICS hash.
DEFAULT_GRAPHIC = {
  #        ["Graphic Name", Index],
  :good => ["Actor1",       0    ],
  :evil => ["Characters3",  7    ],
}

# GRAPHICS - Here you define how which character will display.
# If you insert :
#   8 => ["Actor4", 0]
# in :evil part, the evil guy at place 9 will have graphic of Eric.
GRAPHICS = {

  :good => {
    0   => ["Characters1", 0],
    1   => ["Characters1", 1],
    2   => ["Characters1", 2],
    3   => ["Characters1", 3],
    4   => ["Characters1", 4],
    5   => ["Characters1", 5],
    6   => ["Characters1", 6],
    7   => ["Characters1", 7],
    8   => ["Characters2", 0],
    9   => ["Characters2", 1],
    10  => ["Characters2", 2],
    11  => ["Characters2", 3],
  },
  
  :evil => {
    
  },
}

# RESULT_IMAGES - Images showing current game progress
# :base is the image in background that is static, and
# :cursor is the image that is moving depending on which side is winning.
RESULT_IMAGES = {
  :base   => "ResultBase",
  :cursor => "ResultCursor",
}

# TABLE_IMAGE - The image of background table.
# Cannot be set to nil to disable.
TABLE_IMAGE = "CheckerTable"

# END_TEXTS - That will display when somebody wins.
# Cannot be set to nil to disable
END_TEXTS = {
  #        ["Text",            Icon Index ],
  :good => ["Team Good wins!", 259        ],
  :evil => ["Team Evil wins!", 1          ],
}

# END_ME - What ME will be played when some team wins?
# Set to nil to disable
END_ME = {
  :good => ["Fanfare3", 100, 100],
  :evil => ["Gameover2", 100, 100],
}

# END_TIMER
# How much will the winning message be displayed and winning music be played
# until you return back where you called the play?
END_TIMER = 4



#==============================================================================#
#                                 ▼ SCRIPT ▼                                   #
#------------------------------------------------------------------------------#
# Editing stuff below this point is not recommended unless you want            #
# to crash your game, cause computer damage or plan a terrorist attack.        #
#==============================================================================#
  end
end

#--------------------------------------------------------------------------
# * Error Handling
#--------------------------------------------------------------------------
($imported[:TEAM_GOOD] ||= {})[:CHECKERS] = 1.0

# (I warned you.)



# These are classes that are included in KOCKA-CORE script, but in case you
# do not have KOCKA-CORE, I've copied used methods here.

unless $imported[:KOCKA]
  
  #============================================================================
  # ** Array
  #----------------------------------------------------------------------------
  #  The array class. The elements of an array are arbitrary Ruby objects.
  #============================================================================
  
  class Array
    
    #--------------------------------------------------------------------------
    # * Array to ME
    #--------------------------------------------------------------------------
    def to_me; return RPG::ME.new(self[0], self[1], self[2]); end
    
    #--------------------------------------------------------------------------
    # * Array to BGM
    #--------------------------------------------------------------------------
    def to_bgm; return RPG::BGM.new(self[0], self[1], self[2]); end
    
    #------------------------------------------------------------------------
    # * Array To Color
    #------------------------------------------------------------------------
    def to_color; return Color.new(self[0], self[1], self[2]); end
    
  end 
  
  
  
  #============================================================================
  # ** Window_MenuHelp
  #----------------------------------------------------------------------------
  #  This window is used to display help text in most KOCKA scripts.
  #============================================================================

  class Window_MenuHelp < Window_Base
    
    #------------------------------------------------------------------------
    # * Object Initialization
    #------------------------------------------------------------------------
    def initialize(a, b, c, d, o = 255)
      super(a, b, c, d)
      self.opacity = o
      @index = 0
    end
    
    #------------------------------------------------------------------------
    # * Refresh
    #------------------------------------------------------------------------
    def refresh
      contents.clear
      draw_text_ex(30, 0, @text) if @text
      draw_icon(@icon, 0, 0) if @icon
      draw_face(@face.face_name, @face.face_index, Graphics.width - 120, 0) if @face
    end
    
    #------------------------------------------------------------------------
    # * Set Text and Icon
    #------------------------------------------------------------------------
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
    
    #------------------------------------------------------------------------
    # * Set Face
    #------------------------------------------------------------------------
    def set_face(a); @face = a; end
    
  end
    
end



#==============================================================================
# ** Game_Checker
#------------------------------------------------------------------------------
#  The class for checker.
#==============================================================================

class Game_Checker < Game_Character
  include TEAM_GOOD::CHECKERS
  
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_accessor :dead
  attr_accessor :good
  attr_reader :good
  attr_reader :array_index
  
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize(index, good = true)
    table_index = index * 2
    table_index += 40 unless good
    @array_index = index * 2 + (good ? 0 : 1)
    @index = index
    @good = good
    @x = table_index % 8
    @y = table_index / 8
    @x += 1 if (@y % 2) == 1
    sym = good ? :good : :evil
    @character_name, @character_index = GRAPHICS[sym][index] ? GRAPHICS[sym][index] : DEFAULT_GRAPHIC[sym]
    @direction = good ? 2 : 8
    @dead = false
    @animation_id = 0
    @balloon_id = 0
    @pattern = 1
    @move_speed = 1
  end
  
end



#==============================================================================
# ** Game_Interpreter
#------------------------------------------------------------------------------
#  An interpreter for executing event commands. This class is used within the
# Game_Map, Game_Troop, and Game_Event classes.
#==============================================================================

class Game_Interpreter
  
  #--------------------------------------------------------------------------
  # * Script Call
  #--------------------------------------------------------------------------
  def play_checkers; SceneManager.call(Scene_Checkers); end
  
end



#==============================================================================
# ** Sprite_Checker
#------------------------------------------------------------------------------
#  The class for displaying the checker.
#==============================================================================

class Sprite_Checker < Sprite_Character
  
  #--------------------------------------------------------------------------
  # * Update Transfer Origin Bitmap
  #--------------------------------------------------------------------------
  def update_bitmap
    if graphic_changed?
      @character_name = @character.character_name
      @character_index = @character.character_index
      set_character_bitmap
    end
  end
  
  #--------------------------------------------------------------------------
  # * Update Position
  #--------------------------------------------------------------------------
  def update_position
    move_animation((@character.x + 1) * 32 - 16 - x, (@character.y + 2) * 32 - y)
    self.x = (@character.x + 1) * 32 - 16
    self.y = (@character.y + 2) * 32
    self.z = 1000
    self.viewport.z = 1000
  end
  
  #--------------------------------------------------------------------------
  # * Update Other
  #--------------------------------------------------------------------------
  def update_other; self.visible = !@character.dead; end
  
  #--------------------------------------------------------------------------
  # * Update Transfer Origin Rectangle
  #--------------------------------------------------------------------------
  def update_src_rect
    index = @character.character_index
    pattern = @character.pattern < 3 ? @character.pattern : 1
    sx = (index % 4 * 3 + pattern) * @cw
    sy = (index / 4 * 4 + (@character.direction - 2) / 2) * @ch
    self.src_rect.set(sx, sy, @cw, @ch)
  end
  
end



#==============================================================================
# ** Spriteset_Checkers
#------------------------------------------------------------------------------
#  The spriteset for checkers scene.
#==============================================================================

class Spriteset_Checkers
  include TEAM_GOOD::CHECKERS
  
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize
    @sprites = SceneManager.scene.checkers.collect{|c| Sprite_Checker.new(Viewport.new, c) }
    make_result_sprite
    make_result_cursor
    make_background_sprite
  end
  
  #--------------------------------------------------------------------------
  # * Initialize Result Image
  #--------------------------------------------------------------------------
  def make_result_sprite
    @result_sprite = Sprite.new
    @result_sprite.bitmap = Cache.picture(RESULT_IMAGES[:base])
    @result_sprite.y = 6
    @result_sprite.x = (Graphics.width - @result_sprite.bitmap.width) / 2
  end
  
  #--------------------------------------------------------------------------
  # * Initialize Cursor For Result
  #--------------------------------------------------------------------------
  def make_result_cursor
    @result_cursor = Sprite.new
    @result_cursor.bitmap = Cache.picture(RESULT_IMAGES[:cursor])
    @result_cursor.y = 6
    @result_cursor.x = (Graphics.width - @result_cursor.bitmap.width) / 2
  end
  
  #--------------------------------------------------------------------------
  # * Make Background Image
  #--------------------------------------------------------------------------
  def make_background_sprite
    @background_sprite = Sprite.new
    @background_sprite.bitmap = Cache.picture(TABLE_IMAGE)
    @background_sprite.z = 0
    @background_sprite.y = 32
  end
  
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    update_cursor
    @sprites.each{|s| s.update }
  end
  
  #--------------------------------------------------------------------------
  # * Cursor Sprite Update
  #--------------------------------------------------------------------------
  def update_cursor
    @result_cursor.x = (Graphics.width - @result_cursor.bitmap.width) / 2
    temp = 0
    SceneManager.scene.checkers.each {|c| temp += c.good ? 1 : -1 unless c.dead }
    @result_cursor.x += temp * (@result_cursor.bitmap.width / 6.0)
  end
  
  #--------------------------------------------------------------------------
  # * Free
  #--------------------------------------------------------------------------
  def dispose
    @result_sprite.bitmap.dispose
    @result_sprite.dispose
    @result_cursor.bitmap.dispose
    @result_cursor.dispose
    @background_sprite.bitmap.dispose
    @background_sprite.dispose
    @sprites.each{|s|
      s.bitmap.dispose
      s.dispose
    }
  end
  
end


#==============================================================================
# ** Window_Checkers
#------------------------------------------------------------------------------
#  The window for displaying the checker table.
#==============================================================================

class Window_Checkers < Window_Selectable
  
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader :selection_index
  
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize
    super(0, 32, Graphics.width, Graphics.height - 32)
    self.opacity = 0
    self.viewport = Viewport.new
    self.viewport.z = 100
    self.z = 100
    refresh
    @selection_index = 0
  end
  
  #--------------------------------------------------------------------------
  # * Refresh
  #--------------------------------------------------------------------------
  def refresh
    contents.clear
    @used_fields = SceneManager.scene.used_tiles
    @selection_index = 0
    select(@used_fields[@selection_index])
    @used_fields.each {|f| draw_item(f) }
  end
  
  #--------------------------------------------------------------------------
  # * Draw Item
  #--------------------------------------------------------------------------
  def draw_item(field); draw_icon(90, field % 8 + 6, field / 8 + 6) if @selecting; end
  
  #--------------------------------------------------------------------------
  # * Move Cursor Left
  #--------------------------------------------------------------------------
  def cursor_left(*args)
    @selection_index -= 1
    @selection_index = @used_fields.length - 1 if @selection_index == -1
    select(@used_fields[@selection_index])
  end
  
  #--------------------------------------------------------------------------
  # * Move Cursor Right
  #--------------------------------------------------------------------------
  def cursor_right(*args)
    @selection_index += 1
    @selection_index = 0 if @selection_index == @used_fields.length
    select(@used_fields[@selection_index])
  end
  
  #--------------------------------------------------------------------------
  # * Move Cursor Up
  #--------------------------------------------------------------------------
  def cursor_up(*args); cursor_right; end
  
  #--------------------------------------------------------------------------
  # * Move Cursor Down
  #--------------------------------------------------------------------------
  def cursor_down(*args); cursor_left; end
  
  #--------------------------------------------------------------------------
  # * Get Standard Padding Size
  #--------------------------------------------------------------------------
  def standard_padding; 0; end
  
  #--------------------------------------------------------------------------
  # * Get Spacing for Items Arranged Side by Side
  #--------------------------------------------------------------------------
  def spacing; 0; end
  
  #--------------------------------------------------------------------------
  # * Get Digit Count
  #--------------------------------------------------------------------------
  def col_max; 8; end
  
  #--------------------------------------------------------------------------
  # * Get Number of Items
  #--------------------------------------------------------------------------
  def item_max; 64; end
  
  #--------------------------------------------------------------------------
  # * Get Item Width
  #--------------------------------------------------------------------------
  def item_width; 32; end
  
  #--------------------------------------------------------------------------
  # * Get Item Height
  #--------------------------------------------------------------------------
  def item_height; 32; end
  
end



#==============================================================================
# ** Scene_Checkers
#------------------------------------------------------------------------------
#  The scene for checkers game processing.
#==============================================================================

class Scene_Checkers < Scene_MenuBase
  include TEAM_GOOD::CHECKERS
  
  #--------------------------------------------------------------------------
  # * Public Instance Variables
  #--------------------------------------------------------------------------
  attr_reader :checkers
  attr_reader :used_tiles
  
  #--------------------------------------------------------------------------
  # * Start Processing
  #--------------------------------------------------------------------------
  def start
    super
    @used_tiles = []
    @original_width = Graphics.width
    @original_height = Graphics.height
    Graphics.resize_screen(256, 288)
    @checkers = []
    @current_team = 0
    12.times{|i|
      @checkers << Game_Checker.new(i)
      @checkers << Game_Checker.new(i, false)
    }
    change_used_tiles
    create_all_windows
    @spriteset = Spriteset_Checkers.new
    MUSIC.to_bgm.play if MUSIC
  end
  
  #--------------------------------------------------------------------------
  # * Create All Windows
  #--------------------------------------------------------------------------
  def create_all_windows
    create_checkers_window
    create_end_window
  end
  
  #--------------------------------------------------------------------------
  # * Create Checkers Window
  #--------------------------------------------------------------------------
  def create_checkers_window
    @checkers_window = Window_Checkers.new
    @checkers_window.set_handler(:ok, method(:on_window_ok))
    @checkers_window.set_handler(:cancel, method(:on_window_cancel))
    @checkers_window.activate.refresh
  end
  
  #--------------------------------------------------------------------------
  # * Create End Window
  #--------------------------------------------------------------------------
  def create_end_window
    @end_window = Window_MenuHelp.new((Graphics.width - 200) / 2, (Graphics.height - 48), 200, 48, 0)
    @end_window.hide
  end
  
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    super
    (@end_timer > 0 ? @end_timer -= 1 : return_scene) if @end_timer
  end
  
  #--------------------------------------------------------------------------
  # * Change Selectable Tiles
  #--------------------------------------------------------------------------
  def change_used_tiles
    @used_tiles = []
    @eaten = []
    !@selecting ? @checkers.each {|c| @used_tiles << (c.x + (c.y * 8)) if @current_team == (c.good ? 0 : 1) && !c.dead} : @used_tiles = find_positions.collect{|x, y| x + (y * 8)}
  end
  
  #--------------------------------------------------------------------------
  # * Find Standable Positions
  #--------------------------------------------------------------------------
  def find_positions(x = @current_checker.x, y = @current_checker.y, res = [], param_old_eaten = [], depth = 0)
    return [] if depth > 10
    old_eaten = param_old_eaten.dup
    pos = []
    pos << [ 1, -1] if x + 1 < 8 && y - 1 >= 0
    pos << [-1, -1] if x - 1 >= 0 && y - 1 >= 0
    pos << [-1,  1] if x - 1 >= 0 && y + 1 < 8
    pos << [ 1,  1] if x + 1 < 8 && y + 1 < 8
    i = 0
    loop {
      break if i == pos.length
      dx, dy = pos[i]
      if used_field(x + dx, y + dy)
        if x + (2 * dx) >= 0 && x + (2 * dx) < 8 && y + (2 * dy) >= 0 && y + (2 * dy) < 8
          if !used_field(x + (2 * dx), y + (2 * dy)) && !res_include(x - (2 * dx), y - (2 * dy), res)
            res << [x + (2 * dx), y + (2 * dy)]
            if @eaten[x + (2 * dx)].nil?
              @eaten[x + (2 * dx)] = []
              old_eaten << find_checker(x + dx, y + dy).array_index
              (@eaten[x + (2 * dx)] ||= [])[y + (2 * dy)] = old_eaten if @eaten[x + (2 * dx)][y + (2 * dy)].nil?
            end
            res += find_positions(x + (2 * dx), y + (2 * dy), res, @eaten[x + (2 * dx)][y + (2 * dy)] ? @eaten[x + (2 * dx)][y + (2 * dy)] : [], depth + 1)
            res.uniq!
          end
        end
      elsif depth <= 0
        res << [x + dx, y + dy]
      end
      i += 1
    }
    return res
  end
  
  #--------------------------------------------------------------------------
  # * Does RES include those?
  #--------------------------------------------------------------------------
  def res_include(x, y, res)
    res.each{|rx, ry| return true if x == rx && y == ry}
    return false
  end
  
  #--------------------------------------------------------------------------
  # * Is Field Used?
  #--------------------------------------------------------------------------
  def used_field(x, y); return !find_checker(x, y).nil?; end
  
  #--------------------------------------------------------------------------
  # * Find Checker at Specified Field
  #--------------------------------------------------------------------------
  def find_checker(x, y)
    @checkers.each {|c| return c if c.x == x && c.y == y && !c.dead}
    return nil
  end
  
  #--------------------------------------------------------------------------
  # * Window [OK]
  #--------------------------------------------------------------------------
  def on_window_ok
    if @selecting
      if @eaten[@checkers_window.index % 8]
        if @eaten[@checkers_window.index % 8][@checkers_window.index / 8]
          @eaten[@checkers_window.index % 8][@checkers_window.index / 8].uniq!
          @eaten[@checkers_window.index % 8][@checkers_window.index / 8].each{|e|
            @checkers[e].dead = true unless @checkers[e].good == @current_checker.good
          }
        end
      end
      @current_checker.jump((@checkers_window.index % 8) - @current_checker.x, (@checkers_window.index / 8) - @current_checker.y)
      @current_team = @current_team == 1 ? 0 : 1
      @spriteset.update
      check_game_over
    else @current_checker = find_checker(@checkers_window.index % 8, @checkers_window.index / 8)
    end
    @selecting = !@selecting
    change_used_tiles
    @checkers_window.activate.refresh
  end
  
  #--------------------------------------------------------------------------
  # * Window [Cancel]
  #--------------------------------------------------------------------------
  def on_window_cancel
    if @selecting
      @selecting = false
      change_used_tiles
      @checkers_window.activate.refresh
    else @checkers_window.activate
    end
  end
  
  #--------------------------------------------------------------------------
  # * Game Over Check
  #--------------------------------------------------------------------------
  def check_game_over
    temp = nil
    @checkers.each {|c| (temp.nil? ? (temp = c.good) : (return if temp != c.good)) unless c.dead }
    team = temp ? :good : :evil
    @end_window.set(END_TEXTS[team])
    @end_window.show
    @end_timer = END_TIMER * 60
    Audio.bgm_stop
    END_ME[team].to_me.play if END_ME[team] if END_ME
  end
  
  #--------------------------------------------------------------------------
  # * Create Background
  #--------------------------------------------------------------------------
  def create_background; end
  
  #--------------------------------------------------------------------------
  # * Dispose Background
  #--------------------------------------------------------------------------
  def dispose_background; end
  
  #--------------------------------------------------------------------------
  # * Terminate
  #--------------------------------------------------------------------------
  def terminate
    Graphics.resize_screen(@original_width, @original_height)
    @spriteset.dispose
    super
  end
  
end



#==============================================================================#
#                             ■ END OF SCRIPT ■                                #
#==============================================================================#