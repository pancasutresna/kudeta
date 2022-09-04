import { Subjects, Publisher, PaymentCreatedEvent } from '@kudeta.app/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
