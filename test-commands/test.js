// const { SlashCommandBuilder } = require('discord.js');

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('test')
//     .setDescription('Testing command')
//     .setDefaultMemberPermissions(0)
//     .addUserOption(option =>
//       option
//         .setName('event')
//         .setDescription('Event to track')
//         .setRequired(true)
//     )
//     .addUserOption
// };

// import { capitalize, DiscordRequest } from './utils.js';
// import { SlashCommandBuilder } from '@discordjs/builders';

// export const TEST_COMMAND = {
//   name: 'test',
//   description: 'Testing command', 
//   "default_member_permissions": "0",
//   options: [
//     {
//       "type": 3,
//       "name": "event",
//       "description": "Event to track",
//       "required": true,
//       "choices": [
//         {
//           "name": "Valentine's Event",
//           "value": "vday"
//         }
//       ]
//     },
//     {
//       "type": '',
//       "name": "emote",
//       "description": "Emote to look for",
//       "required": true
//     },
//     {
//       "type": 8,
//       "name": "role",
//       "description": "Role to ping",
//       "required": true
//     }
//   ]
// }