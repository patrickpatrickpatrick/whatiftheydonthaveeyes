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

  socket.on('message_history_request', (last_msg_id) => {
	const channel = client.guilds.cache.get('514879056433381409').channels.cache.get('514879057868095489');
	channel.messages.fetch({ limit: 5, ...(last_msg_id ? { before: last_msg_id } : {})}, false, false)
	.then(messages => { io.emit('message_history_request_response', { messages: messages.map(msg => messageToMsg(msg)) }) })
	.catch(console.error)
	console.log(socket);
	});
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

const client = new Discord.Client();

const messageToMsg = msg => ({
	content: msg.content, user: msg.author.username, datestamp: msg.createdTimestamp, id: msg.id
});

client.on('message', msg => {
	io.emit('message', messageToMsg(msg));
});

client.on('ready', () => {
	console.log('Bot is connected...')
});

client.login(process.env.DISCORD_KEY);
