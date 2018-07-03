const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = "#"

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
}); 

//warn 
client.on('message', msg => { 
    if (msg.content.startsWith('#warn')) {
      if(!msg.member.hasPermission("MUTE_MEMBERS")) return;
       let args = msg.content.split(" ").slice(1);
      if (!msg.mentions.members.first()) return msg.reply('mention a user/player')
      if (!args[1]) return msg.reply('Reason for warning ')
      if (msg.guild.channels.find('name', '⚠-warns')) {
        msg.guild.channels.find('name', '⚠-warns').send(`
      ***You have been warned*** : ${msg.mentions.members.first()}
      ***___Because you did the following___***
      ${args.join(" ").split(msg.mentions.members.first()).slice(' ')}
      `)
      }
    }
})

//tempmute
const mmss = require('ms');
client.on('message', async message => {
    let muteReason = message.content.split(" ").slice(3).join(" ");
    let mutePerson = message.mentions.users.first();
    let messageArray = message.content.split(" ");
    let muteRole = message.guild.roles.find("name", "Muted");
    let time = messageArray[2];
  var prefix = "#"
    if(message.content.startsWith(prefix + "tempmute")) {
        if(!message.guild.member(message.author).hasPermission("MUTE_MEMBERS")) return message.channel.send('**- You don\'t have the needed permissions!**');
        if(!mutePerson) return message.channel.send("**- Mention someone!**");
        if(mutePerson === message.author) return message.channel.send('**- You cannot mute yourself!**');
        if(mutePerson === client.user) return message.channel.send('**- You cannot mute me!**');
        if(message.guild.member(mutePerson).roles.has(muteRole.id)) return message.channel.send('**- This person is already muted!**');
        if(!muteRole) return message.guild.createRole({ name: "Muted", permissions: [] });
        if(!time) return message.channel.send("**- Supply a time!**");
        if(!time.match(/[1-7][s,m,h,d,w]/g)) return message.channel.send('**- Supply a real time!**');
        if(!muteReason) return message.channel.send("**- Supply a reason!**");
        message.guild.member(mutePerson).addRole(muteRole);
        let muteEmbed = new Discord.RichEmbed()
        .setAuthor(`${mutePerson.username}#${mutePerson.discriminator}`,mutePerson.avatarURL)
        .setTitle(`You have been muted in ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL)
        .addField('- Muted By:',message.author,true)
        .addField('- Reason:',muteReason,true)
        .addField('- Duration:',`${mmss(mmss(time), {long: true})}`)
        .setFooter(message.author.username,message.author.avatarURL);
        message.channel.sendMessage(muteEmbed)
        .then(() => { setTimeout(() => {
           message.guild.member(mutePerson).removeRole(muteRole);
       }, mmss(time));
    });
    }
});

//mute
client.on("message", message => {
  if (message.author.bot) return;
  
  let command = message.content.split(" ")[0];
  
  if (command === "#mute") {
        if (!message.member.hasPermission('MUTE_MEMBERS')) return message.reply("** You dont have permission**").catch(console.error);
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'mute-log');
  let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'Muted');
  if (!muteRole) return message.reply("** There is no Mute Role 'Muted' **").catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('** You must mention person first**').catch(console.error);
  
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Use:', 'Shut up / tell')
    .addField('Muted:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('By:', `${message.author.username}#${message.author.discriminator}`)
   
   if (!message.guild.member(client.user).hasPermission('MUTE_MEMBERS_OR_PERMISSIONS')) return message.reply('** You dont have permission**').catch(console.error);
 
  if (message.guild.member(user).roles.has(muteRole.id)) {
return message.reply("**:white_check_mark: .. The member was given Muted**").catch(console.error);
} else {
    message.guild.member(user).addRole(muteRole).then(() => {
return message.reply("**:white_check_mark: .. Done The member got muted**").catch(console.error);
});
  }

};

});

//unmute

client.on("message", message => {
  if (message.author.bot) return;
  
  let command = message.content.split(" ")[0];
  
  if (command === "#unmute") {
        if (!message.member.hasPermission('MUTE_MEMBERS')) return message.reply("** You dont have permission**").catch(console.error);
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'mute-log');
  let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'Muted');
  if (!muteRole) return message.reply("** There is no Mute Role 'Muted' **").catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('** You must mention person first**').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('User:', 'Shut up / tell')
    .addField('Unmuted:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('By:', `${message.author.username}#${message.author.discriminator}`)

  if (!message.guild.member(client.user).hasPermission('MUTE_MEMBERS_OR_PERMISSIONS')) return message.reply('** You dont have permission **').catch(console.error);

  if (message.guild.member(user).removeRole(muteRole.id)) {
return message.reply("**:white_check_mark: .. Done Unmuted **").catch(console.error);
} else {
    message.guild.member(user).removeRole(muteRole).then(() => {
return message.reply("**:white_check_mark: .. Done Unmuted **").catch(console.error);
});
  }

};

});

//mutechannel and unmutechannel

client.on('message', message => {

    if (message.content === "#mutechannel") {
                        if(!message.channel.guild) return message.reply(' This command only for servers');

if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(' You do not have permissions');
           message.channel.overwritePermissions(message.guild.id, {
         SEND_MESSAGES: false

           }).then(() => {
               message.reply("Chat has been closed :white_check_mark: ")
           });
             }
if (message.content === "#unmutechannel") {
    if(!message.channel.guild) return message.reply(' This command only for servers');

if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You do not have permissions');
           message.channel.overwritePermissions(message.guild.id, {
         SEND_MESSAGES: true

           }).then(() => {
               message.reply("Chat has been opened:white_check_mark:")
           });
             }

});

//kick

client.on('message',function(message) {
    let toKick = message.mentions.users.first();
    let toReason = message.content.split(" ").slice(2).join(" ");
    let toEmbed = new Discord.RichEmbed()
    var prefix = "#"
   if(message.content.startsWith(prefix + 'kick')) {
       if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply('**# - You dont have enough permissions!**');
       if(!toReason) return message.reply("**# - Supply a reason!**")
       if(toKick.id === message.author.id) return message.reply("**# You cannot kick yourself!**")
       if(!message.guild.member(toKick).bannable) return message.reply("**# - I cannot ban this person!**")
       let toEmbed;
       toEmbed = new Discord.RichEmbed()
       .setTitle("You have been kicked from a server!")
       .setThumbnail(toKick.avatarURL)
       .addField("**# - Server:**",message.guild.name,true)
       .addField("**# - Reason:**",toReason,true)
       .addField("**# - Kicked By:**",message.author,true)
       if(message.member.hasPermission("KICK_MEMBERS")) return (
           toKick.sendMessage({embed: toEmbed}).then(() => message.guild.member(toKick).kick()).then(() => message.channel.send(`**# Done! I kicked: ${toKick}**`))
       )
       }
});

//ban
client.on("message", function(message) {
    let toBan = message.mentions.users.first();
    let toReason = message.content.split(" ").slice(2).join(" ");
    let toEmbed = new Discord.RichEmbed()
    var prefix = "#"
   if(message.content.startsWith(prefix + "ban")) {
       if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("**# - You dont have enough permissions!**");
       if(!toBan) return message.reply("**# - Mention a user!**");
       if(toBan.id === ("447121312960479242")) return message.reply("**# You cannot ban me!**");
       if(toBan === message.member.guild.owner) return message.reply("**# You cannot ban the owner of the server!**");
       if(toBan.bannable) return message.reply("**# - I cannot ban someone with a higher role than me!**");
       if(!toReason) return message.reply("**# - Supply a reason!**")
       if(toBan.id === message.author.id) return message.reply("**# You cannot ban yourself!**")
       if(!message.guild.member(toBan).bannable) return message.reply("**# - I cannot ban this person!**")
       let toEmbed;
       toEmbed = new Discord.RichEmbed()
       .setTitle("You have been banned from a server!")
       .setThumbnail(toBan.avatarURL)
       .addField("**# - Server:**",message.guild.name,true)
       .addField("**# - Reason:**",toReason,true)
       .addField("**# - Banned By:**",message.author,true)
       if(message.member.hasPermission("BAN_MEMBERS")) return (
           toBan.sendMessage({embed: toEmbed}).then(() => message.guild.member(toBan).ban({reason: toReason})).then(() => message.channel.send(`**# Done! I banned: ${toBan}**`))
       );
       
   }
});

//jail

client.on("message", (message) => {
var prefix = "#";
      if (message.content.startsWith(prefix+"jail")) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply("** You dont have permission 'Manage Roles' **").catch(console.error);
    if (message.author.bot) return;
      if (!message.channel.guild) return;
      var mention = message.mentions.members.first
      let role = (message.guild.roles.find("name","jail"));      
      if (!role) message.guild.createRole({ name:'jail', permissions:[1] });
      if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("This is for management");
      if(!message.mentions.members.first()) return message.reply("Mention player ??")
      let member = message.mentions.members.first()
member.addRole(message.guild.roles.find("name","jail")).catch(console.error);
const ra3d = new Discord.RichEmbed()
             .setAuthor(message.author.username, message.author.avatarURL)   
             .setTitle('The person entered the jail ?') 
             .setColor('RANDOM')
              message.channel.sendEmbed(ra3d);    
  }
});

//unjail

client.on("message", (message) => {
var prefix = "#";
      if (message.content.startsWith(prefix+"unjail")) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply("** You dont have permission 'Manage Roles' **").catch(console.error);
          if (message.author.bot) return;
      if (!message.channel.guild) return;
      if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply("This is for management");
      if(!message.mentions.members.first()) return message.reply("Mention player ??");
      let member = message.mentions.members.first()
member.removeRole(message.guild.roles.find("name","jail")).catch(console.error);
const ra3d = new Discord.RichEmbed()
             .setAuthor(message.author.username, message.author.avatarURL)   
             .setTitle('You were released ??')
             .setColor('RANDOM')  
              message.channel.sendEmbed(ra3d);    
  }
});

//clear

client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.split(" ")[0];
  command = command.slice(prefix.length);
  let args = msg.content.split(" ").slice(1);

    if(command === "clear") {
        const emoji = client.emojis.find("name", "wastebasket")
    let textxt = args.slice(0).join("");
    if(msg.member.hasPermission("MANAGE_MESSAGES")) {
    if (textxt == "") {
        msg.delete().then
    msg.channel.send("***```Set the number of messages you want to delete 👌```***").then(m => m.delete(3000));
} else {
    msg.delete().then
    msg.delete().then
    msg.channel.bulkDelete(textxt);
        msg.channel.send("```php\n The number of messages that have been cleared: " + textxt + "\n```").then(m => m.delete(3000));
        }    
    }
}
});

//delete All channels are rolles

client.on('message', omar => {
var prefix = "#";
if(omar.content.split(' ')[0] == prefix + 'delchannel') {  // delete all channels
if (!omar.channel.guild) return;
if(!omar.guild.member(omar.author).hasPermission("MANAGE_CHANNELS")) return omar.reply("**You Don't Have ` MANAGE_CHANNELS ` Permission**");
if(!omar.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return omar.reply("**I Don't Have ` MANAGE_CHANNELS ` Permission**");
omar.guild.channels.forEach(m => {
m.delete();
});
}
if(omar.content.split(' ')[0] == prefix + 'delroles') { // delete all roles
if (!omar.channel.guild) return;
if(!omar.guild.member(omar.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return omar.reply("**You Don't Have ` MANAGE_ROLES_OR_PERMISSIONS ` Permission**");
if(!omar.guild.member(client.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return omar.reply("**I Don't Have ` MANAGE_ROLES_OR_PERMISSIONS ` Permission**");
omar.guild.roles.forEach(m => {
m.delete();
});
omar.reply("`**All roles got deleted**`")
}
});
//bc
client.on("message", message => {
    if (message.content.startsWith("#bc")) {
                 if (!message.member.hasPermission("ADMINISTRATOR"))  return;
  let args = message.content.split(" ").slice(1);
  var argresult = args.join(' ');
  message.guild.members.filter(m => m.presence.status !== 'all').forEach(m => {
  m.send(`${argresult}\n ${m}`);
  })
  message.channel.send(`\`${message.guild.members.filter( m => m.presence.status !== 'all').size}\`The number of people `);
  message.delete();
  };
  });

///anti adv
  client.on('message', message => {
    if(message.content.includes('discord.gg')){
                                            if(!message.channel.guild) return message.reply('** advertising me on DM ? :thinking:   **');
        if (!message.member.hasPermissions(['MUTE_MEMBERS'])){
        message.delete()
    return message.reply(`** :angry: No publishing is allowed here! :angry: ! **`)
    }
}
});
client.on('message', message => {
    if(message.content.includes('youtube')){
                                            if(!message.channel.guild) return message.reply('** advertising me on DM ? :thinking:   **');
        if (!message.member.hasPermissions(['MUTE_MEMBERS'])){
        message.delete()
    return message.reply(`** :angry: No publishing is allowed here! :angry: ! **`)
    }
}
});
////tag
const figlet = require('figlet');
client.on('message', message => {
if (message.content.startsWith(prefix + 'tag')) {
    let args = message.content.split(" ").slice(1);
if(!args[0]) return message.reply('Please write the text you want');  

    figlet(args.join(" "), (err, data) => {
              message.channel.send("```" + data + "```")
           })
}
});
//ping

client.on('message', message => {
    if (message.author.id === client.user.id) return;
            if (message.content.startsWith(prefix + "ping")) {
        message.channel.sendMessage(':ping_pong: Pong! In `' + `${client.ping}` + ' ms`');
    }
});

//roll

client.on('message', function(message) {
    if(message.content.startsWith(prefix + 'roll')) {
        let args = message.content.split(" ").slice(1);
        if (!args[0]) {
            message.channel.send('**Subtract a certain number from which to withdraw**');
            return;
            }
    message.channel.send(Math.floor(Math.random() * args.join(' ')));
            if (!args[0]) {
          message.edit('1')
          return;
        }
    }
});

//avatar 
client.on('message', message => {
    if (message.content.startsWith("#avatar")) {
        var mentionned = message.mentions.users.first();
    var x5bzm;
      if(mentionned){
          var x5bzm = mentionned;
      } else {
          var x5bzm = message.author;
          
      }
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setImage(`${x5bzm.avatarURL}`)
      message.channel.sendEmbed(embed);
    }
});

//server

client.on('message', function(msg) {
         var prefix = "#"
    if(msg.content.startsWith (prefix  + 'server')) {
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setThumbnail(msg.guild.iconURL)
      .setTitle(`Showing Details Of  **${msg.guild.name}*`)
      .addField(':globe_with_meridians:** Server Type**',`[** __${msg.guild.region}__ **]`,true)
      .addField(':medal:** __Roles__**',`[** __${msg.guild.roles.size}__ **]`,true)
      .addField(':red_circle:**__ Number of members__**',`[** __${msg.guild.memberCount}__ **]`,true)
      .addField(':large_blue_circle:**__ Number of members online__**',`[** __${msg.guild.members.filter(m=>m.presence.status == 'online').size}__ **]`,true)
      .addField(':pencil:**__ Text Channels__**',`[** __${msg.guild.channels.filter(m => m.type === 'text').size}__** ]`,true)
      .addField(':microphone:**__ Voice Channels__**',`[** __${msg.guild.channels.filter(m => m.type === 'voice').size}__ **]`,true)
      .addField(':crown:**__ Owner__**',`**${msg.guild.owner}**`,true)
      .addField(':id:**__ Server Id__**',`**${msg.guild.id}**`,true)
      .addField(':date:**__ The server was done in__**',msg.guild.createdAt.toLocaleString())
      msg.channel.send({embed:embed});
    }
  });

//id

client.on('message', message => {
    var prefix = "#"
var args = message.content.split(" ").slice(1);    
if(message.content.startsWith(prefix + 'id')) {
var year = message.author.createdAt.getFullYear()
var month = message.author.createdAt.getMonth()
var day = message.author.createdAt.getDate()
var men = message.mentions.users.first();  
let args = message.content.split(' ').slice(1).join(' ');
if (args == '') {
var z = message.author;
}else {
var z = message.mentions.users.first();
}

let d = z.createdAt;          
let n = d.toLocaleString();   
let x;                       
let y;                        

if (z.presence.game !== null) {
y = `${z.presence.game.name}`;
} else {
y = "No Playing... |💤.";
}
if (z.bot) {
var w = 'Bot';
}else {
var w = 'Member';
}
let embed = new Discord.RichEmbed()
.setColor("#502faf")
.addField('🔱| Your Name:',`**<@` + `${z.id}` + `>**`, true)
.addField('🛡| ID:', "**"+ `${z.id}` +"**",true)
.addField('♨| Playing:','**'+y+'**' , true)
.addField('🤖| Your account type:',"**"+ w + "**",true)    
.addField('📛| The code is right for your account:',"**#" +  `${z.discriminator}**`,true)
.addField('**The date in which your account was created | 📆 **: ' ,year + "-"+ month +"-"+ day)    
.addField("**The date you entered the server| ⌚   :**", message.member.joinedAt.toLocaleString())    

.addField('**⌚ | The date of creating your full account:**', message.author.createdAt.toLocaleString())
.addField("**The last message for you | 💬  :**", message.author.lastMessage)            

.setThumbnail(`${z.avatarURL}`)
.setFooter(message.author.username, message.author.avatarURL)

message.channel.send({embed});
    if (!message) return message.reply('**Mention correctly  ❌ **').catch(console.error);

}

});


//roles

client.on('message', message => {
    if (message.content === '#roles') {
        var roles = message.guild.roles.map(roles => `${roles.name}, `).join(' ')
        const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField('Roles:',`**[${roles}]**`)
        message.channel.sendEmbed(embed);
    }
});


//invite my bot to your discord server

             client.on('message', message => {
				    var prefix = "#"
                if(message.content === prefix + "inv") {
                    if (!message.member.hasPermission('MOVE_MEMBERS')) return message.reply("** You dont have permission **").catch(console.error);
                    let embed = new Discord.RichEmbed ()
                    embed.setTitle("**:arrow_right: Invite Codes Bot!**")
                    .setURL("https://discordapp.com/api/oauth2/authorize?client_id=449341428171014144&permissions=8&scope=bot");
                   message.channel.sendEmbed(embed);
                  }
});

//member

client.on('message', message => {
    if(message.content == '#member') {
    const embed = new Discord.RichEmbed()
    .setDescription(`**Members info??
:green_heart: online:   ${message.guild.members.filter(m=>m.presence.status == 'online').size}
:heart:dnd:       ${message.guild.members.filter(m=>m.presence.status == 'dnd').size}
:yellow_heart: idle:      ${message.guild.members.filter(m=>m.presence.status == 'idle').size}   
:black_heart: offline:   ${message.guild.members.filter(m=>m.presence.status == 'offline').size} 
:blue_heart:   all:  ${message.guild.memberCount}**`)         
         message.channel.send({embed});

    }
  });



//website search

 const googl = require('goo.gl');
client.on('message', message => {
	var prefix = "#"
 let args = message.content.split(' ').slice(1);
    if(message.content.startsWith(prefix + 'website')) {
    if(!message.channel.guild) return;  

        googl.setKey('AIzaSyC2Z2mZ_nZTcSvh3QvIyrmOIFP6Ra6co6w');
        googl.getKey();
        googl.shorten(args.join(' ')).then(shorturl => {
            message.channel.send(''+shorturl)
        }).catch(e=>{
            console.log(e.message);
            message.channel.send('Error!');
        });
}
});

const sql = require("sqlite");
client.on("message", async message => {
  var prefix = "#"
    if (message.content.startsWith(prefix + "achieve")) {
         var ids = [
            "20",
            "1",
            "13",
            "18",
            "17",
            "9",
            "31",
            "22",
            "23",
            "2",
            "11",
            "19",
            "24",
            "25",
            "12",
            "33"
            ]
            const randomizer = Math.floor(Math.random()*ids.length);
            const args = message.content.split(" ").slice(1).join(" ")
    if (!args) return message.channel.send("Put something you want to achieve!");
    const image = new Discord.Attachment(`https://www.minecraftskinstealer.com/achievement/a.php?i=${ids[randomizer]}&h=Achievement Get!&t=${args}`, "achievement.png");
message.channel.send(image)
    }
});

//calculate

const math = require('math-expression-evaluator');
const stripIndents = require('common-tags').stripIndents;

client.on('message', msg => {
	var prefix = "#"
 if (msg.content.startsWith(prefix + 'calculate')) {
    let args = msg.content.split(" ").slice(1);
        const question = args.join(' ');
    if (args.length < 1) {
        msg.reply('Specify a equation, please.');
} else {    let answer;
    try {
        answer = math.eval(question);
    } catch (err) {
        msg.reply(`Error: ${err}`);
    }
    
    const embed = new Discord.RichEmbed()
    .addField("**Input**: ",`**${question}**`, true)
    .addField("**Output**: ",`**${answer}**`, true)
    msg.channel.send(embed)
    }
};
});

//uptime

client.on('message', message => {
    var prefix = "#"
if (message.content.startsWith(prefix + "uptime")) {
   let uptime = client.uptime;

   let days = 0;
   let hours = 0;
   let minutes = 0;
   let seconds = 0;
   let notCompleted = true;

   while (notCompleted) {

       if (uptime >= 8.64e+7) {

           days++;
           uptime -= 8.64e+7;

       } else if (uptime >= 3.6e+6) {

           hours++;
           uptime -= 3.6e+6;

       } else if (uptime >= 60000) {

           minutes++;
           uptime -= 60000;

       } else if (uptime >= 1000) {
           seconds++;
           uptime -= 1000;

       }

       if (uptime < 1000)  notCompleted = false;

   }

   message.channel.send("`" + `${days} days, ${hours} hrs, ${minutes} min , ${seconds} sec` + "`");


}
});

//discrim

client.on('message',function(message) {
                  if(!message.channel.guild) return;

  const prefix = "#";
                  if (message.content === prefix + "discrim") {
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    
    if (message.author.bot) return;
    
    var discri = args[0]
    let discrim
    if(discri){
    discrim = discri;
    }else{
    discrim = message.author.discriminator;
    }
    if(discrim.length == 1){
        discrim = "000"+discrim
    }
    if(discrim.length == 2){
        discrim = "00"+discrim
    }
    if(discrim.length == 3){
        discrim = "0"+discrim
    }

        const users = client.users.filter(user => user.discriminator === discrim).map(user => user.username);
        return message.channel.send(`
            **Found ${users.length} users with the discriminator #${discrim}**
            ${users.join('\n')}
        `);
}
});

//say
client.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);
  
    let args = message.content.split(" ").slice(1);
  
    if (command == "say") {
     message.channel.sendMessage(args.join("  "))
     message.delete()
    }
});


const zalgo = require('zalgolize');
 client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);
  
 
//Deco
if (command == "Decorates") {
    let say = new Discord.RichEmbed()
    .setTitle('Text emboss :')
   message.reply(`\n ${zalgo(args.join(' '))}`);
  }

});

//translate
const translate = require('google-translate-api');
const Langs = ['afrikaans','albanian','amharic','arabic','armenian','azerbaijani','bangla','basque','belarusian','bengali','bosnian','bulgarian','burmese','catalan','cebuano','chichewa','chinese simplified','chinese traditional','corsican','croatian','czech','danish','dutch','english','esperanto','estonian','filipino','finnish','french','frisian','galician','georgian','german','greek','gujarati','haitian creole','hausa','hawaiian','hebrew','hindi','hmong','hungarian','icelandic','igbo','indonesian','irish','italian','japanese','javanese','kannada','kazakh','khmer','korean','kurdish (kurmanji)','kyrgyz','lao','latin','latvian','lithuanian','luxembourgish','macedonian','malagasy','malay','malayalam','maltese','maori','marathi','mongolian','myanmar (burmese)','nepali','norwegian','nyanja','pashto','persian','polish','portugese','punjabi','romanian','russian','samoan','scottish gaelic','serbian','sesotho','shona','sindhi','sinhala','slovak','slovenian','somali','spanish','sundanese','swahili','swedish','tajik','tamil','telugu','thai','turkish','ukrainian','urdu','uzbek','vietnamese','welsh','xhosa','yiddish','yoruba','zulu'];

client.on('message' , async (message) => {
  var prefix = "#"
       if(message.content.startsWith(prefix + "translate")) {
              let args = message.content.split(" ").slice(1);

  if (args[0] === undefined) {

    const embed = new Discord.RichEmbed()
    .setColor("FFFFFF")
    .setDescription("**Provide a language and some text for bot to translate.**\nUsage: `PREFIXX translate <language> <text>`");

    return message.channel.send(embed);

  } else {

    if (args[1] === undefined) {

      return message.channel.send('**Please give me something to translate.** `PREFIX translate <language> <text>`');

    } else {

      let transArg = args[0].toLowerCase();
       args = args.join(' ').slice(prefix.length);
      let translation;

      if (!Langs.includes(transArg)) return message.channel.send(`**Language not found.**`);
      args = args.slice(transArg.length);

      translate(args, {to: transArg}).then(res => {

        const embed = new Discord.RichEmbed()
        .setDescription(res.text)
        .setFooter(`english -> ${transArg}`)
        .setColor(`RANDOM`);
        return message.channel.send(embed);

      });

    }

  }

}
});
//anti bad words

const profanities = require ('profanities')
client.on("message", message => {
    var sender = message.author;
    let msg = message.content.toLowerCase();


    for (x =0; x < profanities.length; x++) {
        if (message.content.toUpperCase() == profanities[x].toUpperCase()) {
            message.reply("It is forbidden to insult 😠 ").then(m => m.delete(1500));
            message.delete();
            return;
        }
    }
});
//bot owner 
var prefix = "#";
client.on('message', message => {
  if (!message.content.startsWith(prefix)) return;
  const verifed = ["236192758765715456"];
if (message.content.startsWith(prefix + 'owner')) {
if( verifed.some(word => message.author.id.includes(word)) ) {    return message.channel.sendMessage(`**   The owner of the bot is here**` + `✅`)
} else {
   message.reply('**You are not the owner of the bot**' + '❌');   
}
}
});

//bot type
client.on('message', message =>{
    if (message.author.bot) return;
    if(message.content == "#type"){
message.channel.startTyping();
}
});
client.on('message', message =>{
    if (message.author.bot) return;
    if(message.content == "#stype"){
message.channel.stopTyping();
}
});



































//Welcome
//GoodBye

client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', '👋-welcome');
    let memberavatar = member.user.avatarURL
      if (!channel) return;
    let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':running_shirt_with_sash: | name :  ',`${member}`)
        .addField(':loudspeaker: | Welcome to Codes' , `Welcome to the server, ${member}`)
        .addField(':id: | user :', "**[" + `${member.id}` + "]**" )
                .addField('➡| You are the member number',`${member.guild.memberCount}`)
               
                  .addField("Name:",`<@` + `${member.id}` + `>`, true)
                     
                                     .addField(' Server', `${member.guild.name}`,true)
                                       
     .setFooter(`${member.guild.name}`)
        .setTimestamp()
   
      channel.sendEmbed(embed);
    });
    
    client.on('guildMemberRemove', member => {
        var embed = new Discord.RichEmbed()
        .setAuthor(member.user.username, member.user.avatarURL)
        .setThumbnail(member.user.avatarURL)
        .setTitle(`Good Bye! :raised_hand::skin-tone-1: :pensive:`)
        .setDescription(`Good bye Nice to meet you :raised_hand::skin-tone-1: :pensive: `)
        .addField(':bust_in_silhouette:   remain',`**[ ${member.guild.memberCount} ]**`,true)
        .setColor('RED')
        .setFooter(`==== We wish you the best ====`, 'https://cdn.discordapp.com/attachments/397818254439219217/399292026782351381/shy.png')
    
    var channel =member.guild.channels.find('name', '😢-good-bye')
    if (!channel) return;
    channel.send({embed : embed});
    }) 




  
//Suggest

    var prefix = "#"
client.on('message', message => {

  if (message.content.startsWith( prefix + "sug")) {
  if (!message.channel.guild) return;
  let args = message.content.split(" ").slice(1).join(' ');
  client.channels.get("449243876817895434").send( //Room ID
      "\n" + "**" + "Server :" + "**" +
      "\n" + "**" + "» " + message.guild.name + "**" +
      "\n" + "**" + "  Proposal : " + "**" +
      "\n" + "**" + "» " + message.author.tag + "**" +
      "\n" + "**" + " Suggestion : " + "**" +
      "\n" + "**" + args + "**")
  }
  });
  
//Report

client.on('message', msg => { 
if (msg.content.startsWith(`#report`)) {

   let args = msg.content.split(" ").slice(1);

  if (!msg.mentions.members.first()) return msg.reply(`You must mention person first`)

  if (!args[1]) return msg.reply(`Ummm .. Write your message`)

  if (msg.guild.channels.find('name', '📝-report')) { //channel name

    msg.guild.channels.find('name', '📝-report').send(`
  Report : ${msg.mentions.members.first()}
  Reported by:  : ${msg.member}
  Room : ${msg.channel.name}
  Reason : **${args.join(" ").split(msg.mentions.members.first()).slice(' ')}**
  `)
  }
}
}) 

client.on('guildCreate', guild => {
    client.channels.get("449245081011224577").send(`**Woops new server ✅
  Server name: __${guild.name}__
  Server owner: __${guild.owner}__**`)
  });

///Help Codes

client.on('message', message => {
    if (message.content === "#help-2") {
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.addField("**:globe_with_meridians: General commands**","** **")
.addField("**#ping :stopwatch:**","**Check your connection speed**")
.addField("**#avatar :camping:**","**Pictures of the chosen person**")
.addField("**#bot :1234:**","**Info about the bot**")
.addField("**#server :recycle:**","**For server information**")
.addField("**#roles :medal: **","**Show Roles**")
.addField("**#id :id: **", "**Shows your ID**")
.addField("**#userinfo :arrows_counterclockwise: **","**Shows your informations**")
.addField("**#member :hearts: **", "**Shows who everyone Status**")
.addField("**#translate  :triangular_flag_on_post:  **", "**Example: #translate Hello to Japanese (All languages do not exist only in a few languages)**")
.addField("**#invites :knife: **", "**Show invites Leaderboard**")
.addField("**#achieve :fireworks: **", "**Put something you want to achieve!**")
.addField("**#sug :notepad_spiral: **", "**Do #sug {Write your suggestion}**")
.addField("**#calculate :pencil: **", "**Example: #calculate 1+1**") 
.addField("**#MCskin :heart_eyes:  **", "**Shows your minecraft skin**")
.addField("**#tag :ideograph_advantage: **", "**write the text you want**")
.addField("**#Decorates :pen_ballpoint: **","**Decorating words**")
.addField("**#report :pencil: **","**Report members**") 
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//Admin commands 

client.on('message', message => {
if (message.content === "#help-4") {
if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply('This property is for management only');
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.addField("**:radioactive: Management orders**","** **")
.addField("**#bc  :mega:**","**For Broadcast**")
.addField("**#clear :octagonal_sign:**","**Clear Chat**")
.addField("**#kick  :outbox_tray:**","**Kick memebers**")
.addField("**#ban  :no_entry:**","**Ban members**")
.addField("**#tempmute  :mute: **","**Mute members**")
.addField("**#mutechannel  :mute: **","**Mute channels**")
.addField("**#jail   :skull_crossbones: **","**Jail members**")
.addField("**#warn :warning: **","**Warn members**")
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//Music commands 

client.on('message', message => {
if (message.content === "#help-3") {
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.addField("** :musical_note: Music Commands **","** **")
.addField("**#play :musical_note:**","**Turn on the desired**")
.addField("**#stop  :musical_keyboard:**","**Stop required**")
.addField("**#pause :musical_score:**","**Turn off the temp timer**")
.addField("**#resume :mute: **","**Turn on the desired after the stop**")
.addField("**#skip :left_right_arrow:**","**Skip the song**")
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

client.on('message', message => {
    if (message.content === "#help") {
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**─══════ {✯Choose✯} ══════─**')
.addField('     **❧ #help-1 ➺ Codes list** ','**════════════**') //done
.addField('     **❧ #help-2 ➺ General commands**','**════════════**') //done
.addField('     **❧ #help-3 ➺ Music Commands**' ,'**════════════**') //done
.addField('     **❧ #help-4 ➺ Management orders**' ,'**════════════**') //done
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//help1

client.on('message', message => {
if (message.content === "#help-1") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js ➺ JS codes list** ','**════════════**') //done 
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//help js
client.on('message', message => {
if (message.content === "#help-js") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-source ➺ ⦁Source Codes** ','**════════════**') //Done
.addField('     **❧ #help-js-general ➺ ⦁General Codes** ','**════════════**')//Done
.addField('     **❧ #help-js-welcome ➺ ⦁Welcome Codes** ','**════════════**')//Done
.addField('     **❧ #help-js-help ➺ ⦁Help Codes** ','**════════════**') //Done
.addField('     **❧ #help-js-bc ➺ ⦁Broadcast Codes** ','**════════════**')
.addField('     **❧ #help-js-admin ➺ ⦁Management Codes** ','**════════════**')

.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//help js source
client.on('message', message => {
if (message.content === "#help-js-source") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-source-1  ➺ ⦁Main Source** ','**════════════**')
.addField('     **❧ #help-js-source-2 ➺ ⦁Main Source with live streaming ,Also with prefix and bot information** ','**════════════**')
.addField('     **❧ #help-js-source-3 ➺ ⦁Main Source with streaming only** ','**════════════**')
.addField('     **❧ #help-js-source-4 ➺ ⦁Main Source with Ping Pong!** ','**════════════**')
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});
//js soruce send dm (1)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-source-1") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**⦁Main Source** \n\nhttps://hastebin.com/agiduzugav.coffeescript');

}
});
//js source send dm (2)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-source-2") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**⦁Main Source with live streaming ,Also with prefix and bot information** \n\nhttps://hastebin.com/judegepebi.coffeescript');

}
});
//js source send dm (3)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-source-3") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Main Source with streaming only** \n\nhttps://hastebin.com/aguxifumof.coffeescript');

}
});
//js source send dm (4)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-source-4") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Main Source with Ping Pong!** \n\nhttps://hastebin.com/ikoreguqaz.coffeescript');

}
});
/////////////

//help general
client.on('message', message => {
if (message.content === "#help-js-general") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-general-1  ➺ ⦁Ping Code** ','**════════════**')
.addField('     **❧ #help-js-general-2 ➺ ⦁Roll Code** ','**════════════**')
.addField('     **❧ #help-js-general-3 ➺ ⦁Avatar Code** ','**════════════**')
.addField('     **❧ #help-js-general-4 ➺ ⦁Server info Code** ','**════════════**')
.addField('     **❧ #help-js-general-5 ➺ ⦁ID Code** ','**════════════**')
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//js general (1)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-general-1") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Ping Code** \n\nhttps://hastebin.com/siyugacipi.coffeescript');

}
});
//js general (2)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-general-2") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Roll Code** \n\nhttps://hastebin.com/ucubuxicin.js');

}
});
//js general (3)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-general-3") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Avatar Code** \n\nhttps://hastebin.com/elukosired.js');

}
});
//js general (4)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-general-4") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Server info Code** \n\nhttps://hastebin.com/fubogebito.js');

}
});
//js general (5)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-general-5") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**ID Code** \n\nhttps://hastebin.com/obemetihil.js');

}
});
//////////
//help welcome
client.on('message', message => {
if (message.content === "#help-js-welcome") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-welcome-1  ➺ ⦁Welcome with a member number Code** ','**════════════**')
.addField('     **❧ #help-js-welcome-2 ➺ Leave member with picture Code** ','**════════════**')
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//js welcome (1)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-welcome-1") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Welcome with a member number and profile picture Code** \n\nhttps://hastebin.com/pofiqugule.js');

}
});
//js welcome (2)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-welcome-2") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Leave member Code** \n\nhttps://hastebin.com/tubopexoru.php');

}
});
///////////

//help help
client.on('message', message => {
if (message.content === "#help-js-help") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-help-1   ➺ ⦁Help with the image in the same chat Code** ','**════════════**')
.addField('     **❧ #help-js-help-2  ➺ ⦁Help send in private chat Code** ','**════════════**')
.addField('     **❧ #help-js-help-3  ➺ ⦁Help with pages in the same chat Code** ','**════════════**')
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});
//js help (1)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-help-1") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Help with the image in the same chat Code** \n\nhttps://hastebin.com/ajikazuzib.cs');

}
});
//js help (2)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-help-2") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Help send in private chat Code** \n\nhttps://hastebin.com/ciromopuso.php');

}
});
//js help (3)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-help-3") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**⦁Help with pages in the same chat Code** \n\nhttps://hastebin.com/mufocejexa.coffeescript');

}
});





///////

//help bc
client.on('message', message => {
if (message.content === "#help-js-bc") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-bc-1   ➺ ⦁Broadcast + All + Developed Code** ','**════════════**')
.addField('     **❧ #help-js-bc-2  ➺ ⦁Broadcast + All + Not Developed Code** ','**════════════**')
.addField('     **❧ #help-js-bc-3   ➺ ⦁Broadcast + for online only + With mention + Not Developed Code** ','**════════════**')
.addField('     **❧ #help-js-bc-4  ➺ ⦁Brodcast + All + With Mention + Not Developed Code** ','**════════════**')
.addField('     **❧ #help-js-bc-4  ➺ ⦁Brodcast + All + Developed Code + warn you before broadcasting Code** ','**════════════**')

.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//js bc (1)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-bc-1") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Broadcast + All + Developed Code** \n\nhttps://hastebin.com/alefakacex.js');

}
});
//js bc (2)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-bc-2") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Broadcast + All + Not Developed Code** \n\nhttps://hastebin.com/ivoyogiguw.cs');

}
});
//js bc (3)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-bc-3") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Broadcast + for online only + With mention + Not Developed Code** \n\nhttps://hastebin.com/atabigunav.coffeescript');

}
});
//js bc (4)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-bc-4") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Brodcast + All + With Mention + Not Developed Code** \n\nhttps://hastebin.com/rimadatolu.coffeescript');

}
});
//js bc (5)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-bc-5") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Brodcast + All + Developed Code + warn you before broadcasting Code** \n\nhttps://hastebin.com/gicihoxita.coffeescript');

}
});








//help admin
client.on('message', message => {
if (message.content === "#help-js-admin") { 
let embed = new Discord.RichEmbed()
.setThumbnail(message.author.avatarURL)
.setTitle('**⦁All types of codes in Codes Server 💬⦁**')
.addField('     **❧ #help-js-admin-1   ➺ ⦁Ban Code** ','**════════════**')
.addField('     **❧ #help-js-admin-2  ➺ ⦁Kick Code** ','**════════════**')
.addField('     **❧ #help-js-admin-3   ➺ ⦁Clear chat with numbers Code** ','**════════════**')
.addField('     **❧ #help-js-admin-4  ➺ Mute and Unmute Chat Code** ','**════════════**')
.addField('     **❧ #help-js-admin-5   ➺ ⦁Invite Link Code** ','**════════════**')
.addField('     **❧ #help-js-admin-6  ➺ ⦁Invite your bot Code** ','**════════════**')
.setColor('#7d2dbe')
message.channel.sendEmbed(embed);
}
});

//js admin (1)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-admin-1") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Ban Code** \n\nhttps://hastebin.com/eyeguyinif.php');

}
});
//js admin (2)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-admin-2") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Kick Code** \n\nhttps://hastebin.com/otoyuvivax.php');

}
});
//js admin (3)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-admin-3") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Clear chat with numbers Code** \n\nhttps://hastebin.com/giwevocazu.coffeescript');

}
});
//js admin (4)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-admin-4") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Mute and Unmute chat Code** \n\nhttps://hastebin.com/kiyivebiki.coffeescript');

}
});
//js admin (5)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-admin-5") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Invite Link Code** \n\nhttps://hastebin.com/nigowemelu.vbs');

}
});
//js admin (6)
client.on('message', message => {
if (message.author.bot) return;
if (message.content === prefix + "help-js-admin-6") {
 message.channel.send('**The code has been sent in the private conversation :ok_hand: **'); return message.author.sendMessage('**Invite your bot Code** \n\nhttps://hastebin.com/piyewezugo.php');

}
});

///invites

const table = require('table')
const arraySort = require('array-sort');


         var prefix = "#"
         

client.on('message' , async (message) => {

    if(message.content.startsWith(prefix + "invites")) {
           if(!message.channel.guild) return

  var invites = await message.guild.fetchInvites();

    invites = invites.array();

    arraySort(invites, 'uses', { reverse: true });

    let possibleInvites = [['User Invited', 'Uses']];
    invites.forEach(i => {
      possibleInvites.push([i.inviter.username , i.uses]); 
    })
    const embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle("Server Invites")
    .addField('Leaderboards' , `\`\`\`${table.table(possibleInvites)}\`\`\``)
            .setFooter(`Codes `, 'https://cdn.discordapp.com/avatars/449341428171014144/72153038872deb9b81a2444a0edcf041.png?size=2048')
    .setThumbnail(message.author.avatarURL)

    message.channel.send(embed)
    }
});

//All bots cmd
client.on('message', message => {
	if(!message.channel.guild) return;
var prefix = "#";
			   if(message.content.startsWith(prefix + 'bots')) {

   
   if (message.author.bot) return;
   let i = 1;
	   const botssize = message.guild.members.filter(m=>m.user.bot).map(m=>`${i++} - <@${m.id}>`);
		 const embed = new Discord.RichEmbed()
		 .setAuthor(message.author.tag, message.author.avatarURL)
		 .setDescription(`**Found ${message.guild.members.filter(m=>m.user.bot).size} bots in this Server**
${botssize.join('\n')}`)
.setFooter(client.user.username, client.user.avatarURL)
.setTimestamp();
message.channel.send(embed)

}


});

//bot
client.on('message', message => {
    if(message.content === "#bot") {
        const embed = new Discord.RichEmbed()
        .setColor("#00FFFF")
  .addField('**Memory used 💾**', `${(process.memoryUsage().rss / 1000000).toFixed()}MB`, true)
         .addField('**Connection Speed  📡**' , `${Date.now() - message.createdTimestamp}` + ' ms')
        .addField('**using the processor 💿**', `${(process.cpuUsage().rss / 10000).toFixed()}%`, true)
        .addField('**🌐 Number of servers**' , `${client.guilds.size}`, true)
        .addField('**users number 👥 **' , `${client.users.size}`, true)
               message.channel.sendEmbed(embed);
           }
});

//user info 


client.on('message' , message => {
    var prefix = "#";
if(message.content.startsWith(prefix+"userinfo")) {
    let user = message.mentions.users.first() || message.author;
    const joineddiscord = (user.createdAt.getDate() + 1) + '-' + (user.createdAt.getMonth() + 1) + '-' + user.createdAt.getFullYear() + ' | ' + user.createdAt.getHours() + ':' + user.createdAt.getMinutes() + ':' + user.createdAt.getSeconds();
    message.delete();
    let game;
    if (user.presence.game === null) {
        game = 'Not currently playing .';
    } else {
        game = user.presence.game.name;
    }
    let messag;
    if (user.lastMessage === null) {
        messag = 'No message sent . ';
    } else {
        messag = user.lastMessage;
    }
    let status;
    if (user.presence.status === 'online') {
        status = ':green_heart:';
    } else if (user.presence.status === 'dnd') {
        status = ':heart:';
    } else if (user.presence.status === 'idle') {
        status = ':yellow_heart:';
    } else if (user.presence.status === 'offline') {
        status = ':black_heart:';
    }
    if (user.presence.status === 'offline') {
        stat = 0x000000;
    } else if (user.presence.status === 'online') {
        stat = 0x00AA4C;
    } else if (user.presence.status === 'dnd') {
        stat = 0x9C0000;
    } else if (user.presence.status === 'idle') {
        stat = 0xF7C035;
    }
    const embed = new Discord.RichEmbed()
  .addField('**UserInfo:**', `**name:** ${user.username}#${user.discriminator}\n**JoinedDiscord:** ${joineddiscord}\n**LastMessage:** ${messag}\n**Playing:** ${game}\n**Status:** ${status}\n**Bot?** ${user.bot}`, true)
  .setThumbnail(user.displayAvatarURL)
  .addField(`Roles:`, message.guild.members.get(user.id).roles.array(role => role.name).slice(1).join(', '))
  .addField('DiscordInfo:', `**Discriminator:** #${user.discriminator}\n**ID:** ${user.id}\n**Username:** ${user.username}`)
  .setAuthor(`informations ${user.username}`, user.displayAvatarURL)
  .setColor(stat);
    message.channel.send({embed})
  .catch(e => logger.error(e));
}
 });
 
//skins
client.on("message", message => {
    var prefix = "#"
    if (!message.content.startsWith(prefix)) return;
      let command = message.content.split(" ")[0];
      command = command.slice(prefix.length);
        if(command === "MCskin") {
                const args = message.content.split(" ").slice(1).join(" ")
        if (!args) return message.channel.send("** Type your skin name **");
        const image = new Discord.Attachment(`https://minotar.net/armor/body/${args}`, "skin.png");
    message.channel.send(image)
        }
    });
//test
client.on('message', message => {
    if (message.content.startsWith(prefix + "test")) {

        let args = message.content.split(" ").slice(1)
        let text = args.join(' ').replace('$userid', message.author.id).replace('server-name', message.guild.name)
        message.channel.send(text)
    }
});
///Codes
client.on('message', message => {
    
    if (message.content === "C") {
        setInterval(function(){
        message.edit('**✱➼**')    
        message.edit('**✱➼ C**')    
        message.edit('**✱➼ Co**')
        message.edit('**✱➼ Cod**')
        message.edit('**✱➼ Code**')
        message.edit('**✱➼ Codes**')
        message.edit('**✱➼ Code**')
        message.edit('**✱➼ Cod**')
    
        }, 1000)
    }
    
});
//timer
const ms = require("ms");
client.on('message' , async (message) => {
  var prefix = "#"
    if (message.content.startsWith(prefix + 'time')) {
         let args = message.content.split(" ").slice(1);
let Timer = args[0];
if(!args[0]){
  return message.channel.send("Please enter a period of time, with either `s,m or h` at the end!");
}
if(args[0] <= 0){
  return message.channel.send("Please enter a period of time, with either `s,m or h` at the end!");
}
message.channel.send(":white_check_mark: Timer has been set for: " + `${ms(ms(Timer), {long: true})}`)

setTimeout(function(){
  message.channel.send(`Timer has ended, it lasted: ${ms(ms(Timer), {long: true})}` + message.author.toString())
}, ms(Timer));
} 
}); 

//date and time
client.on('message' , async (message) => {
    var prefix = "#"
      if (message.content.startsWith(prefix + 'day')) {
  var today = new Date()
  let Day = today.toString().split(" ")[0].concat("day");
  let Month = today.toString().split(" ")[1]
  let Year = today.toString().split(" ")[3]
  message.channel.send(`\`${Day}\` \`${Month}\` \`${Year}\`\n\`Time of day:\` \`${today.toString().split(" ")[4]}\``)
  }
  });  

  //Show all members 
const Codes = require("codes-official");
Codes.set(client)
client.on('message', msg => {
  var prefix = "#"
if(msg.content === prefix + "members") {
        Codes.members(msg);
    }
})
//Hello!
client.on('message' , async (message) => {
    var prefix = "#"
   if (message.content.startsWith(prefix + 'q')) {
    let args = message.content.split(" ").slice(1);
  if(!args[0]) return message.channel.send('Correct usage: **ks!reverse (text to reverse)**');
  
    function reverseString(str) {
        return str.split("").reverse().join("");
    }
  
    let sreverse = reverseString(args.join(' '))
     
    if(args[0] === sreverse) {
    
    sreverse = `${args.join(' ')}..Wait... You broke it!`
    
    }
    const reverseEmbed = new Discord.RichEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL)
    .setColor(0xFFF000)
    .addField('Input: ', '```' + `${args.join(' ')}` + '```')
    .addField('Output: ', '```' + `${sreverse}` + '```')
    message.channel.send({embed: reverseEmbed})
      
  }
  });
//bans
const send = require("quick.hook");
client.on('message' , async (message) => {
if(message.content.startsWith("#bans")) {
  if (!message.member.hasPermission('MUTE_MEMBERS')) return message.reply("** You dont have permission**").catch(console.error);
 let ban = await message.guild.fetchBans().catch(error => {
        return message.channel.send('Sorry, I don\'t have the proper permissions to view bans!');
    });

       
 let users =  message.guild.fetchBans().id;

    ban = ban.array();
   

    arraySort(ban, 'size', {
        reverse: true
    });

    let possiblebans = [
        ['Users', 'ID']
    ];
    ban.forEach(function(ban) {
        possiblebans.push([ban.username, ban.id]);
    })

    const embed = new Discord.RichEmbed()
        .setColor(0xCB5A5E)
        .addField('Bans', `\`\`\`${table.table(possiblebans)}\`\`\``);
    message.channel.send(embed)
    }
});
//hug 
const superagent = require("superagent");

client.on('message', async message => {
  var prefix = "#"
  if (message.content.startsWith(prefix + 'hug')) {
       let args = message.content.split(" ").slice(1);
    let hugUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!hugUser) return message.channel.send("Make sure you mention someone!");
    const {body} = await superagent
    .get(`https://nekos.life/api/v2/img/hug`);
    let hugEmbed = new Discord.RichEmbed()
    .setTitle("Hug! c:")
    .setDescription(`**${message.author.username}** hugged **${message.mentions.users.first().username}**!`)
    .setImage(body.url)
    .setColor("RANDOM")
    .setFooter("Bot Version: 0.0.4", client.user.displayAvatarURL);

    message.channel.send(hugEmbed)

}
});
//meme 
client.on('message' , async (message) => {
    var prefix = "#"
         if(message.content.startsWith(prefix + "meme")) {
  
    let{body} = await superagent
    .get(`https://api-to.get-a.life/meme`);
  
    let me = new Discord.RichEmbed()
    .setColor("#7289DA")
    .setTitle(".-,")
    .setImage(body.url);
  
    message.channel.send(me);
      }
      });

































































/////Voice count
let rebel;
client.on("ready", async  => {
    let guild = client.guilds.get("448944084326023169");
  let users = guild.members.map(member => member.user.id);
  let i;
  rebel=0;
for (i=0 ; i < users.length ; i++) {
 let   check = guild.members.get(users[i]);
if(!check.voiceChannelID){
        continue;
}else{
  rebel++;
}
}
guild.channels.find('id', '457294153190080512').setName(" Voice Online  「"+rebel+"」");
  client.setInterval(() =>{
    let d = Date.now()
  }, 5000);
});
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let guild = client.guilds.get("448944084326023169");
let newUserChannel = newMember.voiceChannel
let oldUserChannel = oldMember.voiceChannel
 if(oldUserChannel === undefined && newUserChannel !== undefined) {
   rebel++;
guild.channels.find('id', '457294153190080512').setName(" Voice Online  「"+rebel+"」");
} else if(newUserChannel === undefined){
  rebel--;
guild.channels.find('id', '457294153190080512').setName(" Voice Online  「"+rebel+"」");
}
});
client.on('message', Codes => {
  
  if(Codes.content === "#voice") {
      Codes.channel.send(" Voice「"+rebel+"」");
}
});

//rainbow


//total
client.on('guildMemberAdd', member => {
    member.guild.channels.get('453645068524322816').setName(`Total Users: ${member.guild.memberCount}`);
    let humans = member.guild.memberCount - member.guild.members.filter(m => m.user.bot).size
    member.guild.channels.get('453644997376475146').setName(`Total Humans: ${humans}`);
    let bots = member.guild.members.filter(m => m.user.bot).size
    member.guild.channels.get('453645288737996811').setName(`Total Bots: ${bots}`);
});


 //bot ready 
 client.on('ready',  () => {
    console.log('By : _xShaDowZx');
    console.log(`Logged in as * [ " ${client.user.username} " ] servers! [ " ${client.guilds.size} " ]`);
    console.log(`Logged in as * [ " ${client.user.username} " ] Users! [ " ${client.users.size} " ]`);
    console.log(`Logged in as * [ " ${client.user.username} " ] channels! [ " ${client.channels.size} " ]`);
  }); 
  
  client.on('ready', () => {
     console.log(`----------------`);
        console.log(`Made By _xShaDowZx - Script By : _xShaDowZx`);
          console.log(`----------------`);
        console.log(`ON ${client.guilds.size} Servers '     Script By : _xShaDowZx ' `);
      console.log(`----------------`);
    console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(` ON ${client.guilds.size} Servers - Prefix #help`,"Type #help")
  client.user.setStatus("Online")
  });
  client.on("guildCreate", guild => {
    console.log(` Join Bot Of Server ${guild.name} Owner Of Server ${guild.owner.user.username}!`)
  });
  client.on('ready', () => {
      console.log('╔[════════════════════════════════════]╗');
      console.log('')
      console.log('            ╔[════════════]╗')
      console.log('              Codes Is Online')
      console.log('            ╚[════════════]╝')
      console.log('')
      console.log(`Logged in as ${client.user.tag}!`);
      console.log('')
      console.log(`servers! [ " ${client.guilds.size} " ]`);
      console.log('')
      console.log(`Users! [ " ${client.users.size} " ]`);
      console.log('')
      console.log('╚[════════════════════════════════════]╝')
    });
  
  
client.login('process.env.BOT_TOKEN')  
