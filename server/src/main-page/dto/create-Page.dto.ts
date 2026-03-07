import { Page } from '../../schemas/page.schema';

export interface PageEntity {
  title: string;
  subtitle: string;
  description: string;
}

export interface Category {
  active: boolean;
  value: string;
}

export interface SliderEntity {
  title?: string;
  description?: string;
  image: string;
}

export interface Info {
  title: string;
  subtitle: string;
  telephone: number;
  email: string;
  instagram: string;
  facebook: string;
}

export class CreatePageDto extends Page {
  name: string;
  about: PageEntity;
  category: Category[];
  slider: SliderEntity[];
  bestseller: SliderEntity[];
  workFeatures: SliderEntity[];
  info: Info;
  whatNew: SliderEntity[];
  fulfillmentProcedure: SliderEntity[];
}
