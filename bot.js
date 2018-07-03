const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = "#"

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
