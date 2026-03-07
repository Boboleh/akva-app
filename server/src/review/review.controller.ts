import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Get,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { Review } from '../schemas/review.schema';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserRole } from '../decorators/user-role.decorator';
import { AuthUser } from '../schemas/user.schema';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateReviewDto, @UserRole() { name }: AuthUser) {
    return this.reviewService.create({ ...dto, name: name });
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateObject(@Param('id') id: string, @Body() updateData: CreateReviewDto) {
    return this.reviewService.updateReview(id, updateData);
  }

  @Get('byProduct/:productId')
  async find(@Param('productId') productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @Post('findAll')
  async findAll() {
    return this.reviewService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Body() id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/ByProductId')
  async deleteReviewsByProductId(@Body() productId: string) {
    return this.reviewService.deleteByProductId(productId);
  }
}
