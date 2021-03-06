const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { version, name} = require('../../package.json');
var settings;

class ConfigCommand extends Command {
    constructor() {
        super('config', {
            aliases: ['config', 'settings'],
            category: 'moderation',
			description: { content: 'view/change the bot settings' },
            cooldown: 2000,
            args: [
				{
                    id: 'option',
                    type: 'string'
				},
            ],
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild'

        });
    }

    async exec(message, { option }) {
        settings = await message.guild.get();
        const s = '[**»**](https://google.com/)';
        const G = [`Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
        `you can configure **${this.client.user.username}** to your liking,`,
        '',
        `Type the name (bold) of these catagroies to view/change the settings ${s}`,
        '',].join('\n')



      var text = [
      `Hello **${message.author.username}**, | Using version \`${version}\` of **${name}**`,
      `you can configure **${this.client.user.username}** to your liking,`,
      '',
      `Type the name (bold) of these catagroies to view/change the settings ${s}`,
      '',
      `${s} **Mod Role** **\`(view, change)\`**`,
      `${s} **status** **\`(view, change)\`**`,
      `${s} **Logging channel** **\`(view, change)\`**`,
      `${s} **Logged channels** **\`(view, change)\`**`,
      `${s} **Message lifetime** **\`(view, change)\`**`,
      `${s} **Buffer limit** **\`(view, change)\`**`,
      `${s} **Word Logging** **\`(view, change)\`**`,

      '',
    ].join('\n');

    const initial = new MessageEmbed()
    .setDescription(text)
    .setTitle(`**${message.guild.name} » Configuration**`)
    .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
    .setColor(0x4dd0e1)

const msg = await message.channel.send(initial);

const filter = m => m.author.id === message.author.id;

let category;
 await message.channel.awaitMessages(filter, {
    max: 1, time: 35000, errors: ['time']
}).then((collected => category = collected)).catch(() => message.channel.send('Command timeout.'));
		
if(!category) return;
var categoryMessage = category.first();
if (category) category = category.first().content.toLowerCase();

const catagories = ['modrole' ,'status', 'loggingchannel', 'loggedchannels', 'messagelifetime', 'bufferlimit', 'wordlogging'];
if (!catagories.includes(category.replace(/\s/g, ''))) return message.channel.send('You did not provide a valid category!');
var index0 = catagories.indexOf(category.replace(/\s/g, ''));

var getChannel = (ChannelID) => ChannelID ? message.guild.channels.cache.get(ChannelID) ? message.guild.channels.cache.get(ChannelID) : '\`Channel Deleted or Not found\`': `None`;
var getRole = (roleID) => roleID ? message.guild.roles.cache.get(roleID) ? message.guild.roles.cache.get(roleID) : '\`Role Deleted or Not found\`': `None`;

var currentChannels = message.guild.channels.cache.map(c => c.id);

var catagoriesText = [

    [ /* modrole */
        G,
        `${s} Role: ${getRole(settings.modRole)}`,
        '',
        `Type The Role ID|Mention|Name to change the mod role`
    ],
    [ /* status */
        G,
        `${s} Status: \`${settings.messages.eanbled ? "Enabled":"Disabled"}\``,
        '',
        `Type \`enable\` if you wish to enable, \`disable\` to disable`
    ],
    [ /* logging channel */
        G,
        `${s} channel: ${getChannel(settings.channelToLog)}`,
        '',
        `Type the new channel to change it`
    ],
    [ /* logged chaneels */
        G,
        `${s} ${
            settings.loggedChannels === currentChannels.filter(c => c !== settings.channelToLog)
            ? `All of the channels`
            : `\`${settings.loggedChannels.length}\` of the current \`${message.guild.channels.cache.size}\` channels`
        }`,
        '',
        `Type in \`all\` to add all channels and \`remove\` to remove a channel`

    ],

    [/* message lifetime */
    G,
    `${s} Current message lifetime (in minutes): \`${settings.messages.lifetime}\``,
    'Type the new message lifetime that would be used (IN minutes)',
    `valid numbers range **from ${this.client.global.limits.messageLifetime.map(l => l).join(' to ')}**`,
    `* by changing this value the existing messages saved in the buffer will be removed`

    ],
    [/* buffer limt */
    G,
    `${s} Current buffer limit size: \`${settings.messages.bufferLimit}\``,
    'Type the new buffer limit that would be used ',
    `valid numbers range **from ${this.client.global.limits.bufferlimit.map(l => l).join(' to ')}**`,
    `* by changing this value the existing messages saved in the buffer will be removed`
    ],

    [/* word logging */
        G,
        `${s} Status: \`${settings.messages.wordLogging ? "Enabled":"Disabled"}\``,
        '',
        `Type \`enable\` if you wish to enable, \`disable\` to disable`   
    ]
]

  let embed = new MessageEmbed()
  .setDescription(catagoriesText[index0].join('\n'))
  .setTitle(`**${message.guild.name} » ${category.capitalize()}**`)
  .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
  .setColor(0x4dd0e1)

  categoryMessage.delete().catch(O_o => {});
  msg.edit(embed);

  let value;
   await message.channel.awaitMessages(filter, {
    max: 1, time: 35000, errors: ['time']
}).then((collected => value = collected)).catch(() => message.channel.send('Command timeout.'));

if (!value) return;

var valueFilter = [
    { /* mod role */
        type: 'Role',
        path: 'modRole'
    },
    { /* status */
        type: 'Boolean',
        path: 'messages.enabled',
    },
    { /* logging channel */
        type: 'Channel',
        path: 'channelToLog',
    },
    { /* logged channels */
        type: 'ChannelArr',
        path: 'loggedChannels',
    },
    {/* message lifetime */
    type: 'Number',
    path: 'messages.lifetime',
    limitRange: this.client.global.limits.messageLifetime,
    afterChecks: (n) => message.guild.changeMessageLifetime(n)
    },
    {/* buffer limit */
    type: 'Number',
    path: 'messages.bufferLimit',
    limitRange: this.client.global.limits.bufferlimit,
    afterChecks: (n) => message.guild.changeBufferLimit(n)
    },
    { /* word logging */
        type: 'Boolean',
        path: 'messages.wordLogging',
    }
 ][index0]
var finalValue;
var check;
value = value.first();

 if (valueFilter.type === 'Boolean') {
     switch (value.content.toLowerCase()) {
         case 'enable': case 'on': finalValue = true; break;
         case 'disable': case 'off': finalValue = false; break;
         default: finalValue = undefined;
     }
     check = true;
 }
 if (valueFilter.type === 'Channel') {
    finalValue = (value.mentions.channels.first() || message.guild.channels.cache.get(value.content)  || message.guild.channels.cache.find(c => c.name === value.content)) || undefined;
    check = true;

 }

 if (valueFilter.type === 'ChannelArr') {
     let temp;
    switch (value.content.toLowerCase()) {
        case 'all': temp = true; break;
        case 'remove': temp = false; break;
        default: temp = undefined;
    } 
    if (temp === true) {

        finalValue = message.guild.channels.cache.map(c => c.id);
        if (settings.channelToLog) finalValue = finalValue.filter(c => c !== settings.channelToLog);

    } else if (temp === false) {

        let embed = new MessageEmbed()
        .setDescription('please type the channel you want to remove or \`all\` to remove all')
        .setTitle(`**${message.guild.name} » ${category.capitalize()}** »`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png' }))
        .setColor(0x4dd0e1)
      
        value.delete().catch(O_o => {});;
        msg.edit(embed);
      
        let removed;
         await message.channel.awaitMessages(filter, {
          max: 1, time: 35000, errors: ['time']
        }).then((collected => removed = collected)).catch(() => message.channel.send('Command timeout.'));
      
      if (!removed) return;
      if (removed.first().content.toLowerCase() === 'all') {
        await this.client.db.set(message.guild.id, [], valueFilter.path)
        return message.channel.send(`Removed all channels`)

      } else {
      var channel = (removed.first().mentions.channels.first() || message.guild.channels.cache.get(removed.first().content));
      if (!channel) return message.channel.send('Invaild input');
      var newChannels = settings.loggedChannels.filter(c => c !== channel.id);
      await this.client.db.set(message.guild.id, newChannels, valueFilter.path)
      return message.channel.send(`Removed ${channel} channel`) 
      }
    }
}

 if (valueFilter.type === 'Role') {
    finalValue = (value.mentions.roles.first() || message.guild.roles.cache.get(value.content) || message.guild.roles.cache.find(r => r.name === value.content)) || undefined; 
    check = true;
 }


 if (valueFilter.type === 'Number') {
     if (isNaN(value.content)) {
     finalValue = undefined;
     } else {
     var number = Math.round(Number(value.content) + Number.EPSILON);
     if (d(settings,valueFilter.path) === number) return message.channel.send('Given value was same as one saved');

     if (valueFilter.limitRange && Array.isArray(valueFilter.limitRange)) {

        if (number >= valueFilter.limitRange[0] && number <= valueFilter.limitRange[1]) {
            finalValue = number;
        if (valueFilter.afterChecks) valueFilter.afterChecks(number);
        } else finalValue = undefined;
     } else {
        finalValue = number;
        if (valueFilter.afterChecks) valueFilter.afterChecks(number);
     }
    }
 }

if (!finalValue && typeof finalValue !== 'boolean') return message.channel.send('Invaild input');
if (check) {
    if (d(settings,valueFilter.path) === (finalValue.id ? finalValue.id:finalValue)) return message.channel.send('Given value was same as one saved');
}
await this.client.db.set(message.guild.id, finalValue.id ? finalValue.id:finalValue, valueFilter.path)
message.channel.send(`Changed \`${category}\` to \`${finalValue.id ? finalValue.id: typeof finalValue === 'boolean' ? finalValue ? "Enabled":"Disabled": typeof finalValue === 'object' ? `${finalValue.length} channels`: finalValue}\``)
    }
}

String.prototype.capitalize = function () { return this.replace(/^\w/, c => c.toUpperCase()); }

// d => deep => gets the value inside the object like this:  `d(Obj, path)`
const d = (o, k) => k.split('.').reduce((a, c, i) => {
	let m = c.match(/(.*?)\[(\d*)\]/);
	if (m && a != null && a[m[1]] != null) return a[m[1]][+m[2]];
	return a == null ? a : a[c];
}, o);

module.exports = ConfigCommand;