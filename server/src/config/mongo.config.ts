import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const getMongoConfig = (): MongooseModuleAsyncOptions => ({
  imports: [],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('MONGODB_URI'),
  }),
});
