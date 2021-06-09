const { Client } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'] } });
const {
	prefix,
	token,
  role_name
} = require("./config.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', (guild) => {
  console.log(`Creating role in` + guild.name);
  guild.roles.create({
    data: {
      name: role_name,
    },
  })
    .then(console.log)
    .catch(console.error);
});
/**This bot will ultimately assign a role to a user within the discord that has been marked.
 * By assigning the role within Discord it should trigger the botr aswell.
Make a role within the discord that matches the above channel
**/
client.on('message', async (msg) => {
    let guildName = msg.guild.name;
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

  if (command === "join" && msg.member.hasPermission("MANAGE_CHANNELS")) {
    console.log("Command for " + command + " Recieved in Server: " + guildName);
        if (!msg.member.voice.channel) {
            return msg.reply("You're not in any voice channel");
        }
        await msg.member.voice.channel.join();
  }
  if (command === "leave" && msg.member.hasPermission("MANAGE_CHANNELS")) {
    console.log("Command for " + command + " Recieved in Server: " + guildName);
        if (!msg.member.voice.channel) {
            return msg.reply("You're not in any voice channel");
        }
        await msg.member.voice.channel.leave();
  }
  if (command === "mark" && msg.member.hasPermission("MANAGE_CHANNELS"))
  {
		if (!msg.mentions.users.size) {
      return msg.reply('You need to tag a user in order to mark them!');
    }
    let markedUser = msg.mentions.members.first();
    let role = msg.guild.roles.cache.find(r => r.name === role_name);
		markedUser.roles.add(role)

		return msg.channel.send(`${markedUser} has been marked!`);      
  }
  if (command === "unmark" && msg.member.hasPermission("MANAGE_CHANNELS"))
  {
      if(!args.length)
        return msg.channel.send(`Please tag a user!`);
        let unmarkUser = msg.mentions.members.first();
        let role = msg.guild.roles.cache.find(r => r.name === role_name);
        unmarkUser.roles.remove(role)
      msg.channel.send(`${unmarkUser} has been unmarked`);
  }
  if(command === "help" && msg.member.hasPermission("MANAGE_CHANNELS") )
  {
    const helpEmbed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle("TalkBot")

			.addFields(
				{ 
					name: prefix + " join", 
				 	value: "Joins the voice channel you are in" 
				},
				{ 
					name: prefix + " leave", 
					value: "Leaves the voice channel" 
				},
				{
					name: prefix + " mark <tag user>",
					value: "Targets a user with a role!"
				},
        {
					name: prefix + " unmark <tag user>",
					value: "Removes targeted role from user!"
				}
			);
		return msg.channel.send(helpEmbed);
  }
});

client.on('guildMemberSpeaking', async (member, speaking) => {
  if(member.roles.cache.some((role) => role.name === role_name))
  {
    const connection = await member.voice.channel.join();
    const dispatcher = connection.play("./Target.mp3")
    //This will play anything that is  "target.mp3"

    dispatcher.pause();
    if(speaking)
    {
        console.log("Spoken!")
        dispatcher.resume();
    }
    if(speaking == false)
    {
        console.log("Silent!")
        dispatcher.pause();
    }
  }    
  });

client.login(token);