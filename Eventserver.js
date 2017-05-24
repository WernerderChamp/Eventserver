const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
var moment = require("moment");
var buglog="";
var bugtime=0;
var penalty=[];
var ytpenalty=[];

bot.on("ready", () => {
	var time=moment().valueOf();
	console.log("Connected");
	bot.user.setGame("Use $points");
	if (bugtime==0) return;
	var diff = time-bugtime;
	bot.channels.get("289734389578072064").send("Warning: Bot got disconnected :warning:\nReconnected after "+diff+" ms\nDetailed Logging:\n"+buglog);
	bugtime=0;
});

bot.on("guildMemberAdd", (member) => {
	setTimeout(function(){
		member.addRole("315565856115523584");
	},120000);
});

bot.on("message",(message) =>{
	if (message.author.bot) return;
	var points=0;
	var protectedPings=0;
	var mentions=message.mentions.members;
	mentions.forEach(function(member){
		var highestRole = member.highestRole.id;
		if (highestRole==315498179011411978) points=points+1.5; //Techniker
		if (highestRole==315097727761383425) points=points+1.5; //Moderatoren
		if (highestRole==315503237598019584) points=points+1; //Muted
		if (highestRole==315594539182325770) protectedPings++; //Protected
		if (highestRole==315509291828117505) points=points+1.5; //Organisator
		if (highestRole==315508810259234816) points=points+1.5; //Streamer/YTber
		if (highestRole==315565856115523584) points=points+1; //Member
		if (highestRole==314802022693994497) points=points+1; //@everyone
	});
	if(message.mentions.everyone) points=points+5;
	if (!penalty[message.author.id]) penalty[message.author.id]=points;
	else penalty[message.author.id]=penalty[message.author.id]+points;
	if (!ytpenalty[message.author.id]) ytpenalty[message.author.id]=protectedPings;
	else ytpenalty[message.author.id]=ytpenalty[message.author.id]+protectedPings;

	if (points!=0){
		setTimeout(function(){
			penalty[message.author.id]=penalty[message.author.id]-points;
		},60000);
	}
	if(protectedPings!=0){
		message.channel.send(":warning: You have mentioned at least one protected account. Continuing results in a mute!");
		setTimeout(function(){
			ytpenalty[message.author.id]=ytpenalty[message.author.id]+protectedPings;
		},1800000);
	}

	if(penalty[message.author.id]>7||ytpenalty[message.author.id]>=3) {
		message.member.addRole("315503237598019584");
		console.log("Muted "+message.author.id);
	}

	if(message.content=="$points"){
		var embed=new Discord.RichEmbed({author: {
			name: bot.user.username,
			icon_url: bot.user.avatarURL // eslint-disable-line camelcase
		},
			description: "Your current penalty points:",
			fields: [
				{
					name: "Regular penalty points:",
					value: ""+penalty[message.author.id],
				},
				{
					name: "Special penalty points:",
					value: ""+ytpenalty[message.author.id]
				},
			],
			footer: {
				text: "Penalty points get automaticly removed after some time",
			},
		});
		embed.setColor("#FF0000");
		message.channel.send({embed});
	}
});


bot.login(config.token);
