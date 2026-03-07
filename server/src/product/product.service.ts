import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { ProductEntity } from './dto/save-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { FindAllProductFilterDto } from './dto/find-all-product-filter.dto';
import { Review } from '../schemas/review.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly ProductModel: Model<Product>) {}

  async create(createProduct) {
    return this.ProductModel.create(createProduct);
  }

  async findOne(id: string) {
    const product = await this.ProductModel.findOne({ _id: id }).exec();
    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async findAll(filter: FindAllProductFilterDto = {}) {
    const products = await this.ProductModel.find(filter);
    const count = await this.ProductModel.countDocuments(filter);
    return { count, products };
  }

  async update(id: string, dto: UpdateProductDto) {
    const update = await this.ProductModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!update) {
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return update;
  }

  async delete(deleteProduct: DeleteProductDto) {
    const product = await this.ProductModel.findByIdAndDelete(deleteProduct).exec();
    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async findWithReviews(dto: FindProductDto) {
    return (await this.ProductModel.aggregate([
      {
        $match: {
          category: dto.category,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $limit: dto.limit,
      },
      {
        $lookup: {
          from: 'test.reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          reviewsCount: { $size: '$reviews' },
          reviewsAvg: { $avg: '$reviews.rating' },
        },
      },
    ]).exec()) as Product & { reviews: Review[]; reviewsCount: number; reviewsAvg: number }[];
  }
}
