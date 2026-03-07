import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoNestedObject } from '../lib/utils/mongo-nestetObject';

export type ProductDocument = HydratedDocument<Product>;
const mainOptions = MongoNestedObject({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
});

export class ProductCharacteristics {
  name: string;
  value: string;
}

@Schema({
  timestamps: true,
})
export class Product {
  @Prop([mainOptions])
  image: {
    title?: string;
    description?: string;
    image: string;
  }[];

  @Prop()
  name: string;

  @Prop()
  subtitle: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  description: string;

  @Prop({ type: () => [String] })
  category: string[];

  @Prop()
  tags: string;

  @Prop()
  fulfillmentTime: number;

  @Prop({ type: () => [ProductCharacteristics] })
  characteristics: ProductCharacteristics[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
