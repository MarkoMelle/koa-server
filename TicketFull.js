import Ticket from './Ticket';

export default class TicketFull extends Ticket {
  constructor(id, name, status, created, description) {
    super(id, name, status, created);
    this.description = description;
  }
}
