require("dotenv").config();

const fs = require("fs");

/* -------------------------------------------
 * Initialize Discord vars.
 --------------------------------------------- */
const Discord = require("discord.js");
const discordClient = new Discord.Client();
const discordToken = process.env.DISCORD_TOKEN;
const discordPrefix = process.env.APP_PREFIX || 'tf!';

const loadCommands = () => {
    //Discord commands collection
    discordClient.commands = new Discord.Collection();

    //Read the files on Commands folder and load each command.
    fs.readdir("./Commands/", (err, files) => {
        if (err) {
            console.log(err);
        }

        const jsFiles = files.filter((file) => file.split(".").pop() === "js");

        if (!jsFiles.length) {
            console.log("No commands found");
        }

        jsFiles.forEach((file, index) => {
            const command = require(`./Commands/${file}`);
            discordClient.commands.set(command.config.command, command);
            console.log(`Command ${file} loaded`);
        });
    });
}

loadCommands();

//Discord bot ready
discordClient.on("ready", () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async (message) => {
    if (!message.content.startsWith(discordPrefix) || message.author.bot || !message.guild) return;

    //Variables
    const args = message.content.slice(discordPrefix.length).trim().split(" "); //Command arguments
    const command = args.shift().toLowerCase(); //Command name
    const discordCommand = discordClient.commands.get(command); //Get the discord command

    if (discordCommand) {
        discordCommand.run(discordClient, message, args); //Executes the given command
    }
});

discordClient.login(discordToken);