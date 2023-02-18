import { SlashCommandBuilder } from 'discord.js';

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('track')
//     .setDescription('Channel tracking command for Events and Wishlist')
//     .setDefaultMemberPermissions(0)
//     .addStringOption(option =>
//       option
//         .setName('event')
//         .setDescription('Event to track')
//         .addChoices(
//           { name: "Valentine's Event", value: "vday" },
//           { name: "No Event", value: "none" }
//         )
//     )
//     .addStringOption(option => 
//       option
//         .setName('wishlist')
//         .setDescription('Wishlist Warning')
//         .addChoices(
//           { name: "Wishlist On", value: "enabled" },
//           { name: "Wishlist Off", value: "disabled" }
//         )
//     )
//     .addStringOption(option => 
//       option
//         .setName('testing')
//         .setDescription('Tester Channel')
//         .addChoices(
//           { name: "Testing On", value: "enabled" },
//           { name: "Testing Off", value: "disabled" }
//         )
//     )
// }

export const TRACK_COMMAND = {
  name: 'track',
  description: 'track command',
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
    },
    {
      "type": 3,
      "name": "testing",
      "description": "Tester Channel",
      "required": false,
      "choices": [
        {
          "name": "Testing On",
          "value": "enabled"
        },
        {
          "name": "Testing Off",
          "value": "disabled"
        }
      ]
    }
  ]
};