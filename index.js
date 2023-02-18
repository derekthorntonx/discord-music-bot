import fs from 'fs'
import { Client, Collection, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'                      // deals with Discord's REST api
import dotenv from 'dotenv'
import { Player } from 'discord-player'

dotenv.config()

// create an instance of the Client class, pass in options object
const client = new Client({ intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates'] })

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN)

// init collection to map out commands into
client.commands = new Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 >> 25,
    }
})

client.on('trackEnd', () => {
    console.log('track ended')
})

// grab files from /commands directory, for each file take the default export and map out into collection
let commands = []

// grab default exports from command files, map name into collection to send to discord API
const commandFiles = fs.readdirSync("./commands").filter( async file => file.endsWith(".js"))
for (const file of commandFiles){
    const command = await import(`./commands/${file}`).then(item => item.default)
    client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
}

// confirmation when bot client logs in
client.on('ready', () => {
    console.log(`${client.user.username} logged in.`)
})

client.on('interactionCreate', (interaction) => {
   async function handleCommand() {
    if(!interaction.isChatInputCommand()) return   

    const commandRequest = client.commands.get(interaction.commandName)
    await interaction.deferReply()                      // gives bot more time to execute command before automatically timing out
    await commandRequest.run({ client, interaction })
   }
   handleCommand()
})



// main start up command handling necessary launch operations
const StartUp = async () => {

    try {
        //Sent put request to discord API to set slash commands, then log in bot
        console.log('Trying to establish slash commands.')

        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: commands
        })

        client.login(process.env.TOKEN)
    } catch (err) {
        console.log(err)
    }
}

StartUp()