// oauth:ak4fm2610g54mwdln62aacu4njdvx4

import { Client } from './lib/client/client';

const client = Client({
  channels: ['#j3d__'],
  loggingLevel: "trace"
});

client.connect();


client.on('action')
.subscribe(event => {
  console.log(event.message);
});

client.on('connecting')
.subscribe((event) => {
  console.log(event.address);
});

client.on('ping')
.subscribe(event => {
  console.log('ping event: ', event);
});

client.on('pong')
.subscribe(event => {
  console.log('pong event: ', event);
});

client.on('mod')
.subscribe(event => {
  console.log(event);
});
