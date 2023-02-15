import { Client, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import dotenv from 'dotenv'

dotenv.config()

// create an instance of the Client class, pass in options object
const client = new Client({ intents: ['Guilds', 'GuildMessages'] })

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN)

// confirmation when bot client logs in
client.on('ready', () => {
    console.log(`${client.user.username} logged in.`)
})

const StartUp = async () => {

    const commands = [
        {
            name: 'test',
            description: 'test description 1'
        }
    ]

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