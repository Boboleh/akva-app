import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoNestedObject } from '../lib/utils/mongo-nestetObject';

export type PageDocument = HydratedDocument<Page>;

const aboutOptions = MongoNestedObject({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
});
const categoryOptions = MongoNestedObject({
  active: {
    type: Boolean,
    default: true,
  },
  value: {
    type: String,
    default: '',
  },
});
const mainOptions = MongoNestedObject({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
});
const bestsellerOptions = MongoNestedObject({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
});
const infoOptions = MongoNestedObject({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  telephone: { type: Number, default: 1234567890 },
  email: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
});
@Schema({
  timestamps: true,
})
export class Page {
  @Prop({
    unique: true,
    required: true,
  })
  name: string;

  @Prop(aboutOptions)
  about: {
    title: string;
    subtitle: string;
    description: string;
  };

  @Prop([categoryOptions])
  category: {
    active: boolean;
    value: string;
  }[];

  @Prop([mainOptions])
  slider: {
    title?: string;
    description?: string;
    image: string;
  }[];

  @Prop([bestsellerOptions])
  bestseller: {
    title?: string;
    description?: string;
    image: string;
  }[];

  @Prop([mainOptions])
  workFeatures: {
    title?: string;
    description?: string;
    image: string;
  }[];

  @Prop(infoOptions)
  info: {
    title: string;
    subtitle: string;
    telephone: number;
    email: string;
    instagram: string;
    facebook: string;
  };

  @Prop([mainOptions])
  whatNew: {
    title?: string;
    description?: string;
    image: string;
  }[];

  @Prop([mainOptions])
  fulfillmentProcedure: {
    title?: string;
    description?: string;
    image: string;
  }[];
}

export const PageSchema = SchemaFactory.createForClass(Page);
