import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MainPageService } from './main-page.service';
import { CreatePageDto } from './dto/create-Page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('page')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}
  // @UseGuards(JwtAuthGuard) todo
  @Post('create')
  async create(@Body() dto: CreatePageDto) {
    return this.mainPageService.create(dto);
  }

  @Get()
  async findOne(@Query('name') name: string) {
    return this.mainPageService.findOne(name);
  }
  @UseGuards(JwtAuthGuard)
  @Put('update/:name')
  async update(@Param('name') name: string, @Body() update: UpdatePageDto) {
    return this.mainPageService.update(name, update);
  }
}
