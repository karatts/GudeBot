const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const karutaUID = '646937666251915264'; //karuta bot id

let tracking;
let tempBanned;
const wishlistExpire = new EmbedBuilder()
  .setColor(0xeed202)
  .setDescription('** The wishlisted drop is expiring in 5 seconds. If the wishlister has not grabbed it yet, please grab the card for them. **')


client.once(Events.ClientReady, () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  tracking = JSON.parse(fs.readFileSync('./files/track.json'));
  tempBanned = JSON.parse(fs.readFileSync('./files/temp-banned.json'));
});

client.on(Events.InteractionCreate, async interaction => {
  console.log(interaction);
  
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("messageCreate", (message) => {
  console.log('writing in a server...');
  let trackedChannels = Object.keys(tracking);
  
  // Wishlist Messaging
  if(message.author.id === karutaUID && trackedChannels.includes(message.channelId)){
    if(tracking[message.channelId].wishlist === 'enabled' && message.content.includes('A card from your wishlist is dropping!')){
      let wishlisters = message.content.split('A card from your wishlist is dropping!');
      wishlisters = wishlisters[1].split(/[ ]+/);
      
      let wishlistString = "";
      wishlisters.forEach(wisher => {
        console.log(wisher.trim());
        if(wisher !== ''){
          wishlistString += "> "+wisher+"\n";
        }
      });
      
      let wishlistWarning = new EmbedBuilder()
        .setColor(0xff0033)
        .setTitle('A WISHLISTED CARD IS DROPPING')
        .setDescription('**Please __DO NOT GRAB__ unless you are the wishlister(s): ** \n ' + wishlistString)
        .setFooter({text: 'If you are not a wishlister and you grab OR fight for the wishlisted card, you will be temporarily banned from ALL gamba channels for 24 hours.'})
      
      setTimeout(() => {
        message.channel.send({embeds: [wishlistWarning]});
      }, 500);
      setTimeout(() => {
        message.channel.send({embeds: [wishlistWarning]});
      }, 3000);
      setTimeout(() => {
        message.channel.send({embeds: [wishlistExpire]});
      }, 52500); 
    }
  }
  
  if(message.author.id === karutaUID && trackedChannels.includes(message.channelId)){
    console.log('Looking at a tracked channel ' + message.channelId);
    const channel = message.client.channels.cache.find(channel => channel.id);
    if((tracking[message.channelId].event === 'vday')){
      console.log('Vday tracking on...');
        
      const filter = (reaction, user) => {
        return (['🌼','🌹','💐','🌻','🌷'].includes(reaction.emoji.name) && user.id === karutaUID);
      };
        
      message.awaitReactions({ filter, max: 6, time: 6000, errors: ['time'] })
        .then(collected => {
          console.log('Collecting...');
        })
        .catch(collected => {
          for (let [key, value] of collected) {
            console.log(key + " = " + value);
          
            switch(key) {
              case '🌼':
                message.channel.send('A <@&1073409722335633490> has dropped!')
                console.log('Blossom has dropped!')
                break;
              case '🌹':
                message.channel.send('A <@&1073409614625914940> has dropped!')
                console.log('Rose has dropped!')
                break;
              case '🌻':
                message.channel.send('A <@&1073409651850350622> has dropped!')
                console.log('Sunflower has dropped!')
                break;
              case '🌷':
                message.channel.send('A <@&1073409677376880742> has dropped!')
                console.log('Tulip has dropped!')
                break;
              default:
                message.channel.send('A bouquet of <@&1073409677376880742>s, <@&1073409722335633490>s, <@&1073409614625914940>s,and <@&1073409651850350622>s has dropped!')
            }
          }
        console.log('All reactions loaded');
      });
    }
  }
});

client.login(token);