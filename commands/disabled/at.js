const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const errHandler = (err) => {console.error("ERREUR avec la commande /at :", err);};
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('at')
  .setDescription('Liens et informations sur notre appel à textes.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
        .setColor(config.Blue)
        .setDescription("**Nous avons lancé un appel à textes sur le thème *Murmures***\nVous avez jusqu'au **1er juillet** pour nous envoyer une nouvelle, un poème, un conte, un récit épistolaire ou une courte pièce de théâtre qui corresponde à ce thème. Le genre littéraire est libre (réaliste, fantasy, science-fiction, policier, romance, etc.). Nous acceptons les textes d'entre 1000 et 4000 mots pour les nouvelles, contes, récits épistolaires et pièces de théâtre, et entre 300 et 3000 mots pour les poèmes (en prose ou en vers).\n Les textes lauréats seront publiés par l'association des Murmures Littéraires dans une anthologie, qui prendra la forme d'un recueil illustré. Le 1er prix recevra une récompense de 50€.​\n [Informations](https://www.murmures-litteraires.fr/appel-%C3%A0-textes-2022) | [Règlement](https://www.murmures-litteraires.fr/r%C3%A8glement-de-l-appel-%C3%A0-textes) | [Formulaire d'inscription](https://docs.google.com/forms/d/e/1FAIpQLSd0DSHof5Bwd6CdP6xK-xNeclVhVP1VkwUedgzAwGN4_u5h1A/viewform) \n\nVous pouvez soutenir l'association et nous permettre de développer plus de projets pour la littérature sur [HelloAsso](https://www.helloasso.com/associations/les-murmures-litteraires/adhesions/adherer-aux-murmures-litteraires-1) !")
        .setTimestamp();
     await interaction.reply({
     embeds: [embed]
    }).catch(errHandler);
  },
};