const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!";

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(prefix.length).toLowerCase();

  if (command === 'ping') {
    message.reply('pong');
  }
});

client.login(process.env.TOKEN);
