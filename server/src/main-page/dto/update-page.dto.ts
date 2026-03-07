interface PageEntity {
  title?: string;
  subtitle?: string;
  description?: string;
}

interface Category {
  active?: boolean;
  value?: string;
}

interface SliderEntity {
  title?: string;
  description?: string;
  image?: string;
}

interface Info {
  title?: string;
  subtitle?: string;
  telephone?: number;
  email?: string;
  instagram?: string;
  facebook?: string;
}

export class UpdatePageDto {
  name?: string;
  about?: PageEntity;
  category?: Category[];
  slider?: SliderEntity[];
  bestseller?: SliderEntity[];
  workFeatures?: SliderEntity[];
  info?: Info;
  whatNew?: SliderEntity[];
  fulfillmentProcedure?: SliderEntity[];
}
