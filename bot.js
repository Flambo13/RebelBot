const Discord  = require("discord.js");
const ytdl     = require("ytdl-core");
const rebelBot = new Discord.Client();
const prefix   = "#";
const game     = "#help"
var servers    = {};
var queue      = [];
function play(connection, message) {
	var server = servers[message.guild.id];

	server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

	server.queue.shift();

	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(conection,message);
		else{ connection.disconnect();
		message.channel.send("Queue Concluded.");
	}});
}

rebelBot.on("ready", function(){
	console.log("Ready");
	rebelBot.user.setGame(game)
	rebelBot.user.setStatus("Online")
});

rebelBot.on("message", function(message) {
	if(message.author.equals(rebelBot.user)) return;

	if(message.content === "Hello") {
		message.channel.send("Hi, there!")
	}
	if (!message.content.startsWith(prefix)) return;

	var args = message.content.substring(prefix.length).split(" ");

	switch (args[0].toLowerCase()) {
		case "ping":
			message.channel.send("Pong!");
			break;
		case "info":
			message.channel.send("There is no information for you!");
			break;
		case "dice":
			if(args[1]) { 
				var dice = args[1];
				var result = Math.floor(Math.random() * dice + 1);
				message.channel.send(result);
			}else {
				message.channel.send("Usage: #dice [Integer]");
			}
			break;
		case "help":
			message.channel.send("");
			break;
		case "play":
			if (!args[1]) {
				message.channel.send("Please provide a link");
				return;
			}
			if (!message.member.voiceChannel) {
				message.channel.send("You must be in a voice channel");
				return;
			}

			if(!servers[message.guild.id]) servers[message.guild.id] = {
				queue: []
			};

			var server = servers[message.guild.id];

			server.queue.push(args[1]);

			if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
				play(connection, message);
			});
			break;
		case "skip":
				var server = servers[message.guild.id];
				if(server.dispatcher) server.dispatcher.end();
			break;
		case "stop":
				var server = servers[message.guild.id];

				if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect(); {
					message.channel.send("Fine, BAKA!");
				}
				break;
		default:
			message.channel.send("Type a command pls");
			break;
	}
});

rebelBot.login(process.env.BOT_TOKEN);
