import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('skip')
            .setDescription('Skips current song.'),
    run: async ({ client, interaction }) => {
        const songQueue = client.player.getQueue(interaction.guildId)

        if (!songQueue){
            return await interaction.editReply('No songs in queue.')
        }

        const current = songQueue.current
        songQueue.skip()
        
        await interaction.editReply(`${current} skipped. `)
    }
}