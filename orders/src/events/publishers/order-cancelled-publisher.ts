import { Subjects, Publisher, OrderCancelledEvent } from '@kudeta.app/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
