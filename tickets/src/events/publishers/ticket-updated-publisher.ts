import { Publisher, Subjects, TicketUpdatedEvent } from '@kudeta.app/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
