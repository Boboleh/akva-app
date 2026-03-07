import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { Product } from '../schemas/product.schema';
import { ProductService } from './product.service';
import { ProductEntity } from './dto/save-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserRole } from '../decorators/user-role.decorator';
import { AuthUser } from '../schemas/user.schema';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() dto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Product) {
    return this.productService.update(id, dto);
  }

  @Post('findAll')
  async findAll() {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Body() dto: DeleteProductDto) {
    return this.productService.delete(dto);
  }
}
