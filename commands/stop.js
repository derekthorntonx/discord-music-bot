import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('exit')
            .setDescription('Stops bot and clears queue.'),
    run: async ({ client, interaction }) => {
        const songQueue = client.player.getQueue(interaction.guildId)

        songQueue.destroy()
        await interaction.editReply('Queue cleared.')
    }
}