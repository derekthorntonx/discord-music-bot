import { SlashCommandBuilder } from "@discordjs/builders";
import { QueryType } from "discord-player";
import { EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('play')
            .setDescription('Plays song(s) from Youtube.')
            .addSubcommand((subcommand) => 
                subcommand.setName('song')
                          .setDescription('stream a song')
                          .addStringOption(option => option.setName('url')
                                                           .setDescription('song URL')
                                                           .setRequired(true))
            )
            .addSubcommand((subcommand) => 
                subcommand.setName('playlist')
                          .setDescription('stream a playlist')
                          .addStringOption(option => option.setName('url')
                                                           .setDescription('playlist URL')
                                                           .setRequired(true))
            ),

    run: async ({ client, interaction }) => {
        // handle cases when user who interacted is not in a voice channel
        if (!interaction.member.voice.channel){
            return interaction.editReply('You must be in a VC.')
        }
        
        const songQueue = await client.player.createQueue(interaction.guild)
        if (!songQueue.connection){
            await songQueue.connect(interaction.member.voice.channel)
        }

        let embed = new EmbedBuilder()
            .setColor(0x0099FF)

        if (interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0){
                return interaction.editReply('No results found.')
            }

            const song = result.tracks[0]
            await songQueue.addTrack(song)
            
            console.log(songQueue)
        } else if (interaction.options.getSubcommand() === 'playlist'){
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0){
                return interaction.editReply('No results found.')
            }

            const playlist = result.tracks[0]
            await songQueue.addTrack(playlist)
        }


        if (!songQueue.playing){
            await songQueue.play()
        }
    }
}