import { Publisher, OrderCreatedEvent, Subjects } from '@kudeta.app/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
