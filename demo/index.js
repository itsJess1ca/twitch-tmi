const {Client} = require('../build/client');
const config = {
  mysql: {
    dev: {
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      host: process.env.MYSQL_HOST,
      port: ~~process.env.MYSQL_PORT,
      database: 'chatbot'
    }
  }
};
const channel = {
  channelId : 2,
  channelName: 'j3d__',
  dateCreated: '2017-09-20 20:49:06',
  lastUpdated: '2017-09-20 20:49:06',
  // botName: 'lowdownai',
  // botAuth: 'oauth:zi5xdqnwh2jdgkx5bedwvupi1de7j6',
  botName: 'j3d__',
  botAuth: 'oauth:w2koj9zsk3fenk79kh88ebbz3lebjp',
  ownerId: '62383162'
};

const client = Client({
  identity: {
    username: channel.botName,
    password: channel.botAuth
  },
  channels: [`#${channel.channelName.toLowerCase()}`],
  loggingLevel: "trace"
});

client.on('timeout')
.subscribe(event => {
  console.log(event);
});


client.connect();