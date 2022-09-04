import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from '@kudeta.app/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
