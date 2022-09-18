import { Subjects } from './subjects';

export interface TokenCreatedEvent {
    subject: Subjects.TokenCreated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    };
}
