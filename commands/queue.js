import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('queue')
            .setDescription('Show the current song queue')
            .addNumberOption((option) => option.setName('page')
                                               .setDescription('Queue page number')
                                               .setMinValue(1)),
    run: async ({ client, interaction }) => {
        const songQueue = client.player.getQueue(interaction.guildId)
        if (!songQueue){
            return await interaction.editReply('Queue is empty.')
        }

        // calculate total required pages, always round up; otherwise large embeds crash bot
        const totalPages = Math.ceil(songQueue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber('page') || 1) - 1

        if (page > totalPages){
            return await interaction.editReply('Invalid page selection.')
        }

        
        const queueList = songQueue.tracks.slice(page * 10, page * 10 + 10).map( (song, index) => {
            return `${page *10 + index + 1}. ${song.title} - ${song.author} [${song.duration}]

            `       //string literal notation to add line breaks
        })

        const current = songQueue.current

        let embed = new EmbedBuilder()
                        .setDescription('Now playing: ' + (current ? `${current.title}` : 'Nothing') + `
                        
                        Queue:
                        ${queueList.join(' ')}`)
                        .setThumbnail(current.thumbnail)
                        .setFooter({
                            text: `Page ${page + 1}/${totalPages}`
                        })
        
        await interaction.editReply({embeds: [embed]})
    }
}