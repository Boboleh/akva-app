import { Module } from '@nestjs/common';
import { MainPageController } from './main-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MainPageService } from './main-page.service';
import { Page, PageSchema } from '../schemas/page.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Page.name,
        schema: PageSchema,
      },
    ]),
  ],
  controllers: [MainPageController],
  providers: [MainPageService],
})
export class MainPageModule {}
