const { SlashCommandBuilder } = require ('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('emotionalsupport')
      .setDescription('Emotional support command'),
    async execute(interaction) {
		  return interaction.reply('Pong!');
	  },
}

// export const EMOTIONAL_SUPPORT_COMMAND = {
//   name: 'emotionalsupport',
//   description: 'Emotional support command',
//   type: 1,
// };