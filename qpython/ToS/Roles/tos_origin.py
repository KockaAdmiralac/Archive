"""
This part of script are prerequisites 
based on original ideas made by BlankMediaGames
<blankmediagames.com/TownOfSalem>
"""
	
# Town ToS roles
TOWN = [
"Jailor",            # Town (Killing)
"Mayor",             # Town (Support)
"Veteran",           # Town (Killing)
"Spy",               # Town (Investigative)
"Investigator",      # Town (Investigative)
"Sheriff",           # Town (Support)
"Transporter",       # Town (Support)
"Lookout",           # Town (Investigative)
"Vigillante",        # Town (Killing)
"Retributionist",    # Town (Protective)
"Escort",            # Town (Support)
"Medium",            # Town (Support)
"BodyGuard",         # Town (Protective)
"Doctor"             # Town (Protective)
]

# Mafia ToS roles
MAFIA = [
"Godfather",         # Mafia (Killing)
"Consigliere",       # Mafia (Support)
"Mafioso",           # Mafia (Killing)
"Consort",           # Mafia (Support)
"Blackmailer",       # Mafia (Deception)
"Framer",            # Mafia (Deception)
"Disguiser",         # Mafia (Deception)
"Janitor"            # Mafia (Deception)
]

# Neutral ToS roles
NEUTRAL = [
"Werewolf",          # Neutral (Killing)
"SerialKiller",     # Neutral (Killing)
"Jester",            # Neutral (Evil)
"Executioner",       # Neutral (Evil)
"Witch",             # Neutral (Evil)
"Amnesiac",          # Neutral (Benign)
"Arsonist",          # Neutral (Killing)
"Survivor"           # Neutral (Benign)
]

# Random ToS roles
RANDOMS = [
"Town (Support)",
"Town (Protective)",
"Town (Investigative)",
"Town (Killing)",
"Mafia (Killing)",
"Mafia (Support)",
"Mafia (Deception)",
"Neutral (Killing)",
"Neutral (Evil)",
"Neutral (Benign)",
"Random Town",
"Random Mafia",
"Random Neutral",
"Any"
]

# Unique ToS roles
UNIQUE = [
"Mayor",
"Jailor",
"Veteran",
"Godfather",
"Mafioso"
]

ROLES = MAFIA + TOWN + NEUTRAL
"""
DESCRIPTIONS = {
"Jailor":"You are a prison guard who secretly detains suspects.",
"Mayor":"You are the leader of Town.",
"Veteran":"You are a dedica with a kafa",
"Spy":"You are an evaesdropper that listens to private conversations.",
"Investigator":"You investigate people's houses.",
"Sheriff",           # Town (Support)
"Transporter",       # Town (Support)
"Lookout",           # Town (Investigative)
"Vigillante",        # Town (Killing)
"Retributionist",    # Town (Protective)
"Escort",            # Town (Support)
"Medium",            # Town (Support)
"BodyGuard",         # Town (Protective)
"Doctor",            # Town (Protective)
"Godfather",         # Mafia (Killing)
"Consigliere",       # Mafia (Support)
"Mafioso",           # Mafia (Killing)
"Consort",           # Mafia (Support)
"Blackmailer",       # Mafia (Deception)
"Framer",            # Mafia (Deception)
"Janitor",           # Mafia (Deception)
"Werewolf",          # Neutral (Killing)
"SerialKiller",     # Neutral (Killing)
"Jester",            # Neutral (Evil)
"Executioner",       # Neutral (Evil)
"Witch",             # Neutral (Evil)
"Amnesiac",          # Neutral (Benign)
"Arsonist",          # Neutral (Killing)
"Survivor"           # Neutral (Benign)
}
"""