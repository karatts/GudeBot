// import { SlashCommandBuilder } from 'discord.js';

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('pat')
//     .setDescription('pat command')
// }


import { capitalize, DiscordRequest } from './utils.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const PAT_COMMAND = {
  name: 'pat',
  description: 'pat command',
  type: 1,
};