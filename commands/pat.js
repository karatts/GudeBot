import { SlashCommandBuilder } from 'discord.js';

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('pat')
//     .setDescription('pat command')
// }

export const PAT_COMMAND = {
  name: 'pat',
  description: 'pat command',
  type: 1,
  options: [
    {
      "type": 6,
      "name": "user",
      "description": "User you want to pat",
      "required": false,
    },
  ]
};