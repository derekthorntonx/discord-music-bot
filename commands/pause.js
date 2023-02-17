import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('pause')
            .setDescription('Pauses audio playback.'),
    run: async ({ client, interaction }) => {
        const songQueue = client.player.getQueue(interaction.guildId)

        if (!songQueue){
            return await interaction.editReply('No songs in queue.')
        }

        songQueue.setPaused(true)
        await interaction.editReply('Playback paused. Use /resume to unpause.')
    }
}