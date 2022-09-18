import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TokenAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TokenDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string; // optional
}

interface TokenModel extends mongoose.Model<TokenDoc> {
    build(attrs: TokenAttrs): TokenDoc;
}

const tokenSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

tokenSchema.set('versionKey', 'version');
tokenSchema.plugin(updateIfCurrentPlugin);

tokenSchema.statics.build = (attrs: TokenAttrs) => {
    return new Token(attrs);
};

const Token = mongoose.model<TokenDoc, TokenModel>('Token', tokenSchema);

export { Token };
