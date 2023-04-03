import { SlashCommandBuilder } from 'discord.js';

export const TEMPBAN_COMMAND = {
  name: 'tempban',
  description: '24 hour temp ban by removing a role command',
  "default_member_permissions": "0",
  options: [
    {
      "type": 3,
      "name": "event",
      "description": "Event to track",
      "required": false,
      "choices": [
        {
          "name": "Valentine's Event",
          "value": "vday"
        },
        {
          "name": "No Event",
          "value": "none"
        }
      ]
    },
    {
      "type": 3,
      "name": "wishlist",
      "description": "Wishlist Warning",
      "required": false,
      "choices": [
        {
          "name": "Wishlist On",
          "value": "enabled"
        },
        {
          "name": "Wishlist Off",
          "value": "disabled"
        }
      ]
    }
  ]
};