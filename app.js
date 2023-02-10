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
  CRY_COMMAND,
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
  ],
});

var tracking;

client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  tracking = JSON.parse(fs.readFileSync('./track.json'));
  console.log(tracking);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}`);
		console.error(error);
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

const karutaUID = 646937666251915264;

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

    if (name === "cry") {
      let channel = req.body.channel_id;
      let event = req.body.data.options[0].value;
            
      if (tracking.tracking.event === event && channel === tracking.tracking.channel){
        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "This channel is already being tracked for the "+event+" event.",
          },
        });
      } 
      
      tracking.tracking.channel = channel;
      tracking.tracking.event = event;
      

        
      const jsonString = JSON.stringify(tracking, null, 2);
      fs.writeFile('./track.json', jsonString, err => {
        if (err) return console.log(err);
      });
      
      if (event === "none"){
        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Tracking disabled",
          },
        });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "This channel is now being tracked for the "+ event + " event.",
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
    CRY_COMMAND,
  ]);
});