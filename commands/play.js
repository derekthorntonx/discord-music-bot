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

        if (interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0){
                return interaction.editReply('Not a valid URL.')
            }

            const song = result.tracks[0]
            await songQueue.addTrack(song)

            embed.setDescription(`${song.title}`)
            .setFooter({text: `Duration: ${song.duration}`})
            .setImage(song.thumbnail)
            
            console.log(songQueue)
        } else if (interaction.options.getSubcommand() === 'playlist'){ // ONLY PLAYING FIRST SONG
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0){
                return interaction.editReply('Not a valid URL.')
            }

            const playlist = result.playlist
            await songQueue.addTracks(result.tracks)

            embed.setDescription(`${playlist.title}`)
                 .setFooter({text: `Songs added: ${result.tracks.length}`})
        }

        if (!songQueue.playing){
            await songQueue.play()
        }
        await interaction.editReply({embeds: [embed]})
    }
}