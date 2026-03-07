import { characteristic } from './save-product.dto';

export class UpdateProductDto {
  image?: {
    title?: string;
    description?: string;
    image: string;
  }[];
  title?: string;
  subtitle?: string;
  price?: number;
  oldPrice?: number;
  description?: string;
  category?: string[];
  tags?: string;
  fulfillmentTime?: number;
  characteristics?: characteristic[];
}
