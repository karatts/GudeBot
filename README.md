# GudeBot for FairyTail server and private use

This bot provides basic functions as requested by members of the FairyTail discord server.

## Functions
For fun:
- Emotional Support
- Pat


Interaction with Karuta bot:
  - Event Tracker
    -- Tracks messages sent in "tracked" channels to notify about event reactions on posts made by the bot.

## Project structure

Below is a basic overview of the project structure:

```
├── examples    -> short, feature-specific sample apps
│   ├── button.js
│   ├── command.js
│   ├── modal.js
│   ├── selectMenu.js
├── .env -> .env file
├── app.js      -> main entrypoint for app
├── commands.js -> slash command payloads + helpers
├── utils.js    -> utility functions and enums
├── package.json
├── README.md
└── .gitignore
```

## Dev Notes

Run `node deploy-commands.js` in the project directory to register the commands.