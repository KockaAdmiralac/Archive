# Pygame testing framework
A Pygame testing framework I started developing while I worked at Petlja. The idea was to check the correctness of student Pygame programs through some kind of unit tests, so I started this as a proof of concept. It had its own repository, but since there was no great development in a couple of years I decided to move it here.

## Components
- `script.py` — user input.
- `checker.py` — the provided checker for the user's script.
- `checkerlib.py` — the checker's library with all necessary interfaces.
- `enums.py` — commonly used numbers in communication between components.
- `pygame/` — the fake pygame library that communicates with the runner via IPC.
- `runner.py` — the script executor that starts the script in a separate process, sends it the checker nonce and receives pygame events from it.

## Running
```console
$ python3 runner.py
```
