import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
} from "./utils.js";
import {
  PAT_COMMAND,
  EMOTIONAL_SUPPORT_COMMAND,
  TRACK_COMMAND,
  HasGuildCommands,
} from "./commands.js";
import fs from 'fs';

//create require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const {
  Client,
  Events,
  GatewayIntentBits,
  IntentsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
});

const karutaUID = '646937666251915264'; //karuta bot id

let tracking;

client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  tracking = JSON.parse(fs.readFileSync('./track.json'));
});

// console.log(tracking.tracking.channel); tracking[0]
// let tracking = client.channels.cache.find(tracking.tracking.channel);
// console.log(channel);

//let trackedChannels = Object.keys(tracking);

client.on("messageCreate", (message) => {
  let trackedChannels = Object.keys(tracking);
  if(message.author.id === karutaUID && (trackedChannels.includes(message.channelId)) && (message.content.includes('dropping'))){
    console.log('Looking at specified channels...');
    const channel = message.client.channels.cache.find(channel => channel.id);

    if(tracking[message.channelId].event === 'vday'){
      console.log('This channel is being tracked for vday');
        
      const filter = (reaction, user) => {
        return ['🌼','🌹','💐','🌻','🌷'].includes(reaction.emoji.name) && user.id === karutaUID;
      };
        
      message.awaitReactions({ filter, max: 6, time: 5500, errors: ['time'] })
        .then(collected => console.log('Collecting reactions...'))
        .catch(collected => {
          for(let i=0; i<collected.keys.length;i++){
            switch(collected[i].emoji.name) {
              case '🌼':
                channel.send('A <@&1073409722335633490> has dropped!')
                console.log('Blossom has dropped!')
                break;
              case '🌹':
                channel.send('A <@&1073409614625914940> has dropped!')
                console.log('Rose has dropped!')
                break;
              case '🌻':
                channel.send('A <@&1073409651850350622> has dropped!')
                console.log('Sunflower has dropped!')
                break;
              case '🌷':
                channel.send('A <@&1073409677376880742> has dropped!')
                console.log('Tulip has dropped!')
                break;
              default:
                channel.send('A bouquet of <@&1073409677376880742>s, <@&1073409722335633490>s, <@&1073409614625914940>s,and <@&1073409651850350622>s has dropped!')
            }
          }
          console.log('All reactions loaded');
        });
      }
  }
});

// Login to Discord with your client's token
client.login(token);

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
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
    if (name === "emotionalsupport") {
      // Send a message into the channel where command was triggered from
      let nickname = req.body.member.nick
        ? req.body.member.nick
        : req.body.member.user.username;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "There there " + nickname + ", everything will be okay.",
        },
      });
    }

    // "pat" guild command
    if (name === "pat") {
      // Send a message into the channel where command was triggered from

      let nickname = req.body.member.nick
        ? req.body.member.nick
        : req.body.member.user.username;
      const description =
        "There there " + nickname + ", everything will be okay.";

      const esEmbed = new EmbedBuilder()
        .setColor(0xc55000)
        .setTitle(description)
        .setImage("https://i.imgur.com/RYg23Nz.gif");

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [esEmbed],
        },
      });
    }

    if (name === "track") {
      let channel = req.body.channel_id;
      let trackedChannels = Object.keys(tracking);
      
      // No filter selected; return values for this channel
      if("options" in req.body.data === false){
        
        if(trackedChannels.includes(channel)){
          let returnMessage = 'This channel is currently being tracked for: \n > Event: ';
          if(tracking[channel].event === 'vday'){
            returnMessage += '`Valentine\'s Day`';
          } else {
            returnMessage += '`'+tracking[channel].event+'`';
          }
          returnMessage += "\n > Wishlist Warning: `"+tracking[channel].wishlist+'`';
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: returnMessage,
            },
          });
        } else {
          return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "This channel has never been tracked before.",
          },
        });
        }
      }
      
      // No values by default
      let event = "none";
      let wishlist = "disabled";
      let eventChange = false;
      let wlChange = false;
      
      for(let i = 0; i < req.body.data.options.length; i++){

        let filter = req.body.data.options[i].name;

        switch(filter) {
          case 'event':
            event = req.body.data.options[i].value;
            console.log('Tracking event: ' + event);
            eventChange = true;
            break;
          case 'wishlist':
            wishlist = req.body.data.options[i].value;
            console.log('Wishlist tracking: ' + wishlist);
            wlChange = true;
            break;
          default:
            console.log('No filter match');
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "Invalid Filter",
              },
            });
        }
      }
      
      if (trackedChannels.includes(channel)){
        // The channel is already being tracked - Just update the values
        if(eventChange){
          if (event === tracking[channel].event){
             console.log("Event specified is already being tracked; No change");
            // Event specified is already being tracked; No change
            eventChange = false;
          } else {
            // Update event to new setting
            console.log("Update event to new setting");
            tracking[channel].event = event;
          }
        }
        if(wlChange){
          if (wishlist === tracking[channel].wishlist){
            // Wishlist setting already set
            console.log("No change to wishlist warning setting");
            wlChange = false;
          } else {
            // Update wishlist setting
            console.log("Update wishlist warning setting");
            tracking[channel].wishlist = wishlist;
          }
        }
      } else {
        // The channel is not yet being tracked - Add the values
        tracking[channel] = {
          "event": event,
          "wishlist": wishlist
        }
      }
      
      let returnMessage;
      if (wlChange && eventChange){
        returnMessage = "The settings for event and wishlist tracking have been updated for this channel.";
      } else if(wlChange) {
        returnMessage = "The settings for wishlist warnings have been updated for this channel.";
      } else if(eventChange){
        returnMessage = "The settings for event tracking has been updated for this channel.";
      } else {
        returnMessage = "Tracking settings for this channel already match the specified settings.";
      }
      
      const jsonString = JSON.stringify(tracking, null, 2); // write to file
      fs.writeFile('./track.json', jsonString, err => {
        if (err) return console.log(err);
      });
            
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: returnMessage,
        },
      });
    }

    // "custom report" command
    //     if (name === 'report') {
    //       let ftUserId = req.body.data.options[0].value;
    //       ftUserId = client.users.fetch(ftUserId);
    //       console.log(req.body.guild_id)
    //       const crewMember = client.fetchGuildPreview(req.body.guild_id);
    //       console.log(crewMember);

    //       ftUserId.then(value => {

    //         console.log(value);

    //         return res.send({
    //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: {
    //           content: 'Are you sure you want to report ' + value.username + '?',
    //         }
    //       });

    //       });
    //     }
    else {
      
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Gude doesn't know what you want. Sorry!",
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    EMOTIONAL_SUPPORT_COMMAND,
    PAT_COMMAND,
    TRACK_COMMAND,
  ]);
});