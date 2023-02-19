import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import { v4 as uuidv4 } from 'uuid';
import Ticket from './Ticket';
import TicketFull from './TicketFull';

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
}));
app.use(cors());

let tickets = [];
let ticketsFull = [];
let currentTicket;
let currentTicketFull;
let newId;
let date;

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
      return;
    case 'editTicket':
      currentTicket = tickets.find((ticket) => ticket.id === id);
      currentTicketFull = ticketsFull.find((ticket) => ticket.id === id);
      currentTicket.name = name;
      currentTicketFull.name = name;
      currentTicketFull.description = description;
      return;
    case 'changeTicketStatus':
      currentTicket = tickets.find((ticket) => ticket.id === id);
      currentTicketFull = ticketsFull.find((ticket) => ticket.id === id);
      currentTicket.status = !currentTicket.status;
      currentTicketFull.status = !currentTicketFull.status;
      return;
    case 'deleteTicket':
      tickets = tickets.filter((ticket) => ticket.id === +id);
      ticketsFull = ticketsFull.filter((ticket) => ticket.id === +id);
      return;
    default:
      ctx.response.status = 404;
  }
});

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log('listening on port', port);
});
