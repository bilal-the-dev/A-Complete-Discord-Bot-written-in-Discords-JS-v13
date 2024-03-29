const{ createTranscript} = require('discord-html-transcripts')
const {PARENTID,EVERYONEID,TRANSCRIPT} = require('../config.json')
const { MessageEmbed,CommandInteraction, MessageActionRow, MessageButton } = require('discord.js')

const DB = require('../models/ticket')
 module.exports = (client) =>{
    client.on('interactionCreate', async(interaction)=>{
        if(!interaction.isButton()) return;
        const {guild,customId,member} = interaction
        if(!['player_report', 'Bug_report', 'Other_report'].includes(customId))return;
        const ID = Math.floor(Math.random() * 90000) + 10000
        await guild.channels.create(`${customId} - ${ID}}` , {
            type:'GUILD_TEXT',
            parent:PARENTID,
            permissionOverwrites:[{
                id:member.id,
                allow:['SEND_MESSAGES','VIEW_CHANNEL','READ_MESSAGE_HISTORY']
            },
        {
            id:EVERYONEID,
            deny:['SEND_MESSAGES','VIEW_CHANNEL','READ_MESSAGE_HISTORY']
        }]
        }).then(async(channel)=>{
            await DB.create({
                GuildID:guild.id,
            ChannelID:channel.id,
            MemberID:member.id,
            TicketID:ID,
            Closed:false,
            Locked:false,
            Type:customId
            })
            const Embed = new MessageEmbed()
        .setAuthor({
            name:`${guild.name} | Ticket : ${ID}` ,
            iconURL:`${guild.iconURL({dynamic:true})}`,
        })
        .setDescription('Please wait patiently for a response from the staff,in the mean-while, describe your issue in as much as detail')
        .setFooter({
            text:`The buttons below are staff only buttons. \nTicketing System | Requested by ${interaction.user.tag}  `,
        })
        .setThumbnail(`${interaction.user.displayAvatarURL({dynamic:true})}`)
        .setTimestamp()
        const Buttonss = new MessageActionRow()
        Buttonss.addComponents(
            new MessageButton()
             .setCustomId('close')
             .setLabel('Save & Close')
             .setStyle("PRIMARY")
             .setEmoji('📫'),
             new MessageButton()
             .setCustomId('lock')
             .setLabel('Lock')
             .setStyle('SECONDARY')
             .setEmoji('🔐'),
             new MessageButton()
             .setCustomId('unlock')
             .setLabel('Unlock')
             .setStyle('SUCCESS')
             .setEmoji('🔓'),
             )
             channel.send({
                 embeds:[Embed],
                 components:[Buttonss]
             })
            await channel.send({
                content:`${member} here is your ticket!`
             }).then((m)=>{
                 setTimeout(() => {
                     m.delete().catch(()=>{})
                 },1000*5);
                 interaction.reply({
                   custom:true,
                   content:`${member} your ticket has been created : ${channel}`,
                   ephemeral:true
               })
             })
        })
    })
 }