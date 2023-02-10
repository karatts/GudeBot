import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import {
  PAT_COMMAND,
  EMOTIONAL_SUPPORT_COMMAND,
  REPORT_USER_COMMAND,
  HasGuildCommands,
} from './commands.js';

//create require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Client, GatewayIntentBits, IntentsBitField, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Login to Discord with your client's token
client.login(token);

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    console.log(req.body);
    
    // "emotionalsupport" guild command
    if (name === 'emotionalsupport') {
      // Send a message into the channel where command was triggered from
      let nickname = req.body.member.nick ? req.body.member.nick : req.body.member.user.username;
            
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'There there ' + nickname + ', everything will be okay.',
        }
      });
    }
    
    // "pat" guild command
    if (name === 'pat') {
      // Send a message into the channel where command was triggered from
      
      let nickname = req.body.member.nick ? req.body.member.nick : req.body.member.user.username;
      const description = 'There there ' + nickname + ', everything will be okay.';
      
      const esEmbed = new EmbedBuilder()
        .setColor(0xc55000)
        .setTitle(description)
        .setImage('https://i.imgur.com/RYg23Nz.gif')
            
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [esEmbed],
        }
      });
    }
    
        // "emotionalsupport" guild command
    if (name === 'reportuser') {
      
      let ftUserId = req.body.data.options[0].value;
      ftUserId = client.users.fetch(ftUserId);
      console.log(req.body.guild_id)
      const crewMember = client.fetchGuildPreview(req.body.guild_id);
      console.log(crewMember);
      
      ftUserId.then(value => {
        
        console.log(value);
        
        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Are you sure you want to report ' + value.username + '?',
        }
      });
        
      });
    }
    
    
    else {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Ruby doesn\'t know what you want. Sorry\!' ,
        }
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    EMOTIONAL_SUPPORT_COMMAND,
    PAT_COMMAND,
    REPORT_USER_COMMAND,
  ]);
});