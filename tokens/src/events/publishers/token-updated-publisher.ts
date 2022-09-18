import { Publisher, Subjects, TokenUpdatedEvent } from '@kudeta.app/common';

export class TokenUpdatedPublisher extends Publisher<TokenUpdatedEvent> {
    subject: Subjects.TokenUpdated = Subjects.TokenUpdated;
}
