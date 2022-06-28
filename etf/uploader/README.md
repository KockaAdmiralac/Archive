# uploader
A set of scripts I used for uploading meeting recordings to Microsoft Stream and (through `rclone`) OneDrive.

## Files
- `config.sample.json`: Sample uploader configuration
- `main.js`: Main uploader logic regarding upload location and naming
- `stream.js`: Microsoft Stream API module
- `stream.txt`: My notes on the Microsoft Stream API
- `tasha.js`: A script I attempted to use when mass-marking videos as editable by all team members on request of a teacher. It worked, but only partially (it made them editable, but unlinked them from the team they were uploaded in), so I left the rest of the work to the teacher
- `upload.sh`: `rclone`-based script for uploading to OneDrive
- `util.js`: Utility functions
