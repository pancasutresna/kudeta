import { Publisher, Subjects, TokenCreatedEvent } from '@kudeta.app/common';

export class TokenCreatedPublisher extends Publisher<TokenCreatedEvent> {
    subject: Subjects.TokenCreated = Subjects.TokenCreated;
}
