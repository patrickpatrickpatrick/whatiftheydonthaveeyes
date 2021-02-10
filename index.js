const express = require('express');
const socketIO = require('socket.io')
const Discord = require('discord.js');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => {
	return res.sendFile(req.originalUrl, { root: __dirname })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('disconnect', () => console.log('goodbye'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

const client = new Discord.Client();

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('Pong!');
	}

	io.emit('message', { content: msg.content, user: msg.author.username });
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)
});

client.login(process.env.DISCORD_KEY);
