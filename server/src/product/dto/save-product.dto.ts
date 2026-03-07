export class characteristic {
  name: string;
  value: string;
}

export class ProductEntity {
  id: string;
  image: {
    title?: string;
    description?: string;
    image: string;
  }[];
  name: string;
  subtitle: string;
  price: number;
  oldPrice: number;
  description: string;
  category: string[];
  tags: string;
  fulfillmentTime: number;
  characteristics: characteristic[];
  createdAt: string;
  updatedAt: string;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.image = product.image;
    this.name = product.name;
    this.subtitle = product.subtitle;
    this.price = product.price;
    this.oldPrice = product.oldPrice;
    this.description = product.description;
    this.category = product.category;
    this.tags = product.tags;
    this.fulfillmentTime = product.fulfillmentTime;
    this.characteristics = product.characteristics;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
