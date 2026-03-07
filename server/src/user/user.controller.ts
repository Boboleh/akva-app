import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UserService } from './user.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() dto: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    return this.userService.create(dto);
  }

  @Post('find')
  async find(@Body() dto: FindUserDto) {
    return this.userService.findOne(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:name')
  async update(@Param('name') name: FindUserDto, @Body() filter: UpdateUserDto) {
    return this.userService.update(name, filter);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Body() dto: DeleteUserDto) {
    return this.userService.delete(dto);
  }
}
