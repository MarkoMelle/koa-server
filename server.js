/* eslint-disable import/extensions */
import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Ticket from './Ticket.js';
import TicketFull from './TicketFull.js';

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
}));
app.use(cors());

let tickets = [];
let ticketsFull = [];
try {
  tickets = JSON.parse(fs.readFileSync('./data/tickets.data.json'));
} catch (error) {
  throw new Error(error.message);
}
try {
  ticketsFull = JSON.parse(fs.readFileSync('./data/ticketsFull.data.json'));
} catch (error) {
  throw new Error(error.message);
}

const dataSave = () => {
  fs.writeFile('./data/tickets.data.json', JSON.stringify(tickets), (err) => {
    if (err) throw err;
  });
  fs.writeFile('./data/ticketsFull.data.json', JSON.stringify(ticketsFull), (err) => {
    if (err) throw err;
  });
};
let currentTicket;
let currentTicketFull;
let newId;
let date;

const responseOk = JSON.stringify('OK');

app.use(async (ctx) => {
  const {
    method, id, name, description,
  } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'ticketById':
      ctx.response.body = ticketsFull.find((ticket) => ticket.id === id);
      return;
    case 'createTicket':
      newId = uuidv4();
      date = new Date();
      tickets.push(new Ticket(newId, name, false, date));
      ticketsFull.push(new TicketFull(newId, name, false, date, description));
      ctx.response.body = tickets;
      dataSave();
      return;
    case 'editTicket':
      currentTicket = tickets.find((ticket) => ticket.id === id);
      currentTicketFull = ticketsFull.find((ticket) => ticket.id === id);
      currentTicket.name = name;
      currentTicketFull.name = name;
      currentTicketFull.description = description;
      ctx.response.body = tickets;
      dataSave();
      return;
    case 'changeTicketStatus':
      currentTicket = tickets.find((ticket) => ticket.id === id);
      currentTicketFull = ticketsFull.find((ticket) => ticket.id === id);
      currentTicket.status = !currentTicket.status;
      currentTicketFull.status = !currentTicketFull.status;
      ctx.response.body = responseOk;
      dataSave();
      return;
    case 'deleteTicket':
      tickets = tickets.filter((ticket) => ticket.id !== id);
      ticketsFull = ticketsFull.filter((ticket) => ticket.id !== id);
      ctx.response.body = responseOk;
      dataSave();
      return;
    default:
      ctx.response.status = 404;
  }
});

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log('listening on port', port);
});
