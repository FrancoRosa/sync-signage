# Sync Signage

> Syncronized video players using udp broadcast messages over the network

## Requirements

This project uses mpv and eog to play videos and show images respectibly, use the following commands to install them.

```bash
sudo apt update
sudo apt install mpv
sudo apt install eog
```

## How to use this project

Run the api.js script with the following command:

```bash
node api.js
```

Do the same on computers on the same network and the playlist should be synchronized by itself

## Folders

### Demos

Demos contains simple code snippets to provide basic examples about functions that are integrated in the main script.

### Media

Media stores the files used on the playlist, this demo includes 4 media files by default
