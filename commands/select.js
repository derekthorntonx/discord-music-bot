import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
            .setName('select')
            .setDescription('Selects song from queue.')
            .addNumberOption((option) => option.setName('tracknumber')
                                               .setDescription('Track to select')
                                               .setMinValue(1)
                                               .setRequired(true)),
    run: async ({ client, interaction }) => {
        const songQueue = client.player.getQueue(interaction.guildId)

        if (!songQueue){
            return await interaction.editReply('No songs in queue.')
        }

        const trackNumber = interaction.options.getNumber('tracknumber')
        if (trackNumber > songQueue.tracks.length){
            return await interaction.editReply('Invalid track selected.')
        }

        songQueue.skipTo(trackNumber - 1)
        await interaction.editReply(`Selected track ${trackNumber}.`)
    }
}