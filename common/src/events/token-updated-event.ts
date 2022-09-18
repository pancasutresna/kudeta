import { Subjects } from './subjects';

export interface TokenUpdatedEvent {
    subject: Subjects.TokenUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
        orderId?: string;
    };
}
