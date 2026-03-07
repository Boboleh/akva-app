import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePageDto } from './dto/create-Page.dto';
import { Page } from '../schemas/page.schema';
import { PAGE_NOT_FOUND } from './page.constant';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class MainPageService {
  constructor(@InjectModel(Page.name) private readonly MainPageModel: Model<Page>) {}

  async create(dto: CreatePageDto) {
    return this.MainPageModel.create(dto);
  }

  async findOne(name: string): Promise<Page> {
    return this.MainPageModel.findOne({ name: name }).exec();
  }

  async update(name: string, update: UpdatePageDto) {
    // const updatedDoc = await this.MainPageModel.findByIdAndUpdate(
    //   name,
    //   update,
    //   { new: true }
    // );
    const updatedDoc = await this.MainPageModel.findOneAndUpdate({ name: name }, update);

    if (!updatedDoc) {
      throw new HttpException(PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedDoc;
  }
}
