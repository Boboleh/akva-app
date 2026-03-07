import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from '../schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<Review>) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    return this.reviewModel.create(dto);
  }

  async findByProductId(productId: string): Promise<Review[] | []> {
    return this.reviewModel.find({ productId }).exec();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find();
  }

  async updateReview(id: string, updateData: CreateReviewDto): Promise<Review> {
    const updatedObject = await this.reviewModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedObject) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return updatedObject;
  }

  async delete(id: string): Promise<Review | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
  }
}
