#==============================================================================#
#                             KOCKA-SOUNDS                                     #
#==============================================================================#
# Author  : KockaAdmiralac                                                     #
# Date    : 28/09/15 (28. September 2015.)                                     #
# Version : 1.0                                                                #
# Support : https://kocka.dilfa.com                                            #
#------------------------------------------------------------------------------#
# ▼ Features ▼                                                                 #
#------------------------------------------------------------------------------#
#                                                                              #
# Implemented :                                                                #
#   - Walk sound based on                                                      #
#     - region iD                                                              #
#     - tileset tag                                                            #
#   - Collision sound                                                          #
#                                                                              #
# Upcoming :                                                                   #
#   - Baloon sound                                                             #
#                                                                              #
# Plug-n-play : NO                                                             #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Installation ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# Put this script below Kocka-Core script, but above "▼ Main"                  #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Requirements ▼                                                             #
#------------------------------------------------------------------------------#
#                                                                              #
# This script requires Kocka-Core script.                                      #
#                                                                              #
# It is specifically made for RPG Maker VX Ace (RGSS3),                        #
# and it is unlikely it will work on any other engine.                         #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ Version History ▼                                                          #
#------------------------------------------------------------------------------#
# Version | Date     | Description                                             #
#_________|__________|_________________________________________________________#
# 1.0     | 28/09/15 | Initial release.                                        #
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
# This script ALIASES the following methods :                                  #
#   - Game_Player :                                                            #
#     - move_straight                                                          #
#                                                                              #
#                                                                              #
# This script does not OVERRIDE any mathods.                                   #
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
# Terms of use are at https://kocka.dilfa.com/rpg/scripts                      #
# BE SURE TO READ THEM!                                                        #
#                                                                              #
#------------------------------------------------------------------------------#
# ▼ FAQ ▼                                                                      #
#------------------------------------------------------------------------------#
#                                                                              #
# If error occurs, check the FAQ at the Kocka-Core script.                     #
# If you don't have Kocka-Core script, then insert it and try again.           #
# If the problem persists, contact me through forums or support site           #
#                                                                              #
#==============================================================================#

module KOCKA        # DO NOT REMOVE
  module SOUND      # DO NOT REMOVE
#==============================================================================#
#                          ▼ CONFIGURATION OPTIONS ▼                           #
#------------------------------------------------------------------------------#
#  You can edit between lines with ▼ and lines with ▲, and above SCRIPT        #
#==============================================================================#



# SOUNDS - The main hash for sounds
# Any other sound you want to put as collision sound,
# region or tileset sound you can put here.
# The syntax is :
# SOUNDS = {
#   :your_sound => {
#     :file => "Filename",
#     :vol => <volume>,
#     :pitch => <pitch>,
#   }
#   :your_other_sound => ["Otherfilename", <other volume>, <other pitch>],
# }
# For more details about sound hash definition, or hashes in general, please
# refer to the Kocka-Core script documentation.
SOUNDS = {
  
  :catsound => ["Cat", 100, 100],
  
  :collisionsound => {
    :file => "Cancel1",
    :vol => 50,
    :pitch => 150,
  }
  
}


# COLLISION_SOUND - The sound that happens at collision.
# Set to the symbol of a sound from SOUNDS hash (
# Set to nil to disable
COLLISION_SOUND = :collisionsound


# REGION_SOUNDS - Sounds that are tied to regions.
# Syntax :
# REGION_SOUNDS = {
#   <some region id> => :sound1,
#   <other region id> => :sound2,
# }
# For more details about hashes in general, please refer to the Kocka-Core
# script documentation.
REGION_SOUNDS = {
  10 => :catsound,
}



#------------------------------------------------------------------------------#
#                         ▲ BASIC CONFIGURATION ▲                              #
#------------------------------------------------------------------------------#
  end           # DO NOT REMOVE
  module REGEX  # DO NOT REMOVE
#------------------------------------------------------------------------------#
#                       ▼ ADVANCED CONFIGURATION ▼                             #
#------------------------------------------------------------------------------#
#  * The part for people that know something about Ruby regular expressions *  #
#------------------------------------------------------------------------------#



# TILESET_SOUND - The regex for tileset notetag
# It configures the <sound:(tileset_tag_id)(sound)>
# By default : /<\s*sound\s*:\s*(\d+)\s*(\w+)\s*>/im
# (That means : < sound  :  1  catsound >)
TILESET_SOUND = /<\s*sound\s*:\s*(\d+)\s*(\w+)\s*>/im



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
$imported[:KOCKA][:SOUND] = 1.0 rescue raise(LoadError, "Import KOCKA-CORE script in order for other KOCKA scripts to work!")

# (I warned you.)


#==============================================================================
# ** RPG::Tileset
#------------------------------------------------------------------------------
#  The data class for tile sets.
#==============================================================================

class RPG::Tileset
  include KOCKA::REGEX
  
  #------------------------------------------------------------------------
  # * Get Sounds
  #------------------------------------------------------------------------
  def sounds
    load_sounds unless @sounds
    @sounds
  end
  
  #------------------------------------------------------------------------
  # * Load Sounds
  #------------------------------------------------------------------------
  def load_sounds
    @sounds = {}
    @note.split(/[\r\n]/).each{|l|sounds[$1.to_i] = $2.to_sym if l =~ TILESET_SOUND}
  end
  
end



#==============================================================================
# ** Game_Player
#------------------------------------------------------------------------------
#  This class handles the player. It includes event starting determinants and
# map scrolling functions. The instance of this class is referenced by
# $game_player.
#==============================================================================

class Game_Player
  include KOCKA::SOUND
  
  #------------------------------------------------------------------------
  # * Aliases
  #------------------------------------------------------------------------
  alias :kocka_random_alias_move_straight_uF4h :move_straight
  
  #--------------------------------------------------------------------------
  # * Move Straight
  #--------------------------------------------------------------------------
  def move_straight(d, turn_ok = true)
    kocka_random_alias_move_straight_uF4h(d, turn_ok)
    play_walk_sound if @move_succeed rescue KOCKA.error_handle("Sounds")
    if turn_ok && !@move_succeed && @already_collided != d
      @already_collided = d
      SOUNDS[COLLISION_SOUND].to_se.play if COLLISION_SOUND rescue KOCKA.error_handle("Sounds")
    end
  end
  
  #------------------------------------------------------------------------
  # * Play Walk Sound
  #------------------------------------------------------------------------
  def play_walk_sound
    @already_collided = -1
    REGION_SOUNDS[region_id] ? SOUNDS[REGION_SOUNDS[region_id]].to_se.play : $game_map.tileset.sounds[terrain_tag] ? SOUNDS[$game_map.tileset.sounds[terrain_tag]].to_se.play : nil
  end
  
end



#==============================================================================#
#                             ■ END OF SCRIPT ■                                #
#==============================================================================#