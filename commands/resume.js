import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('resume')
            .setDescription('Resumes audio playback.'),
    run: async ({ client, interaction }) => {
        const songQueue = client.player.getQueue(interaction.guildId)

        if (!songQueue){
            return await interaction.editReply('No songs in queue.')
        }

        songQueue.setPaused(false)
        await interaction.editReply('Playback resumed.')
    }
}