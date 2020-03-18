"""Speak the time."""

__author__ = 'T.V. Raman <raman@google.com>'
__copyright__ = 'Copyright (c) 2009, Google Inc.'
__license__ = 'Apache License, Version 2.0'

import sl4a
import time

droid = sl4a.Android()
droid.ttsSpeak(time.strftime("%I %M %p on %A, %B %e, %Y"))
