const { Module, FancyRandom, isPublic } = require("../lib/");

Module(
  {
    pattern: "ping",
    fromMe: isPublic,
    desc: "Response speed.",
    type: "info",
  },
  async (message) => {
    const start = new Date().getTime();
    const botz = await FancyRandom("Testing Bot Speed");
    await message.reply(botz);
    const end = new Date().getTime();
    const responseTime = end - start;
    const Jsl1 = await FancyRandom(`Response in ${responseTime} ms`);
    return await message.reply(Jsl1);
  }
);

Module({
  pattern: 'runtime',
  fromMe: isPublic,
  type: 'info',
  desc: 'Shows Bot Running time',
}, async (message) => {
  const sec_num = parseInt(process.uptime(), 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  const seconds = sec_num - (hours * 3600) - (minutes * 60);
  const uptime_process = `Runtime: ${hours} Hour ${minutes} Minute ${seconds} Second`;
  const Jl1 = await FancyRandom(uptime_process);
  return await message.reply(Jl1);
});

Module(
  {
    pattern: "readmore ?(.*)",
    fromMe: isPublic,
    desc: "Readmore generator",
    type: "whatsapp",
  },
  async (message, match) => {
    const readmoreText = match.replace(/\+/g, String.fromCharCode(8206).repeat(4001));
    await message.reply(readmoreText);
  }
);

Module(
  {
    pattern: "wame ?(.*)",
    fromMe: isPublic,
    desc: "wame generator",
    type: "whatsapp",
  },
  async (message, match) => {
    const jsl = 'https://wa.me/' + (message.reply_message.jid || message.mention[0] || match).split('@')[0];
    await message.reply(jsl);
  }
);

Module({
  pattern: 'getjids ?(.*)',
  desc: 'Get all groups\' jids',
  type: 'whatsapp',
  fromMe: true,
}, async (msg) => {
  const groups = Object.keys(await msg.client.groupFetchAllParticipating());

  if (!groups.length) return await msg.reply("_No group chats!_");

  let _msg = "";

  for (const e of groups) {
    try {
      const g_name = (await msg.client.groupMetadata(e)).subject || 'Can\'t load name (rate-overlimit)';
      _msg += `_Group:_ ${g_name}\n_JID:_ ${e}\n\n`;
    } catch {
      // Handle errors if needed
    }
  }

  await msg.reply(_msg);
});
