import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';
import { handleError } from '../common/helpers';
import { BcryptAdapter } from '../common/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  

  async create(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto; 

      const userExists = await this.usersRepository.findOne({
        where: {
          email,
        },
      });

      if (userExists)
        throw new ConflictException(`user with email: ${email} already exists`);

      createUserDto.password = BcryptAdapter.hash(createUserDto.password);

      const newUser = this.usersRepository.create(createUserDto);

      await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      handleError(error);
    }
  }

  findAll() {
    try {
      return this.usersRepository.find({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true
        }
      });

    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) throw new NotFoundException(`user with id: ${id} not found`);

      const {password, ...properties} = user;

      return properties;
    } catch (error) {
      handleError(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email,
        },
      });

      if(!user) throw new NotFoundException(`user with email: ${email} not fond`);

      return user;
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);

      await this.usersRepository.update(id, updateUserDto);

      return this.findOne(id);

    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      await this.usersRepository.update(id, {
        isActive: false,
      });

      return this.findOne(id);
    } catch (error) {
      handleError(error);
    }
  }

  async changePassword(email: string, newPassword: string) {
    try {
      const user = await this.findByEmail(email);

      newPassword = BcryptAdapter.hash(newPassword);

      await this.usersRepository.update(user.id, {
        password: newPassword,
      });

      const { password, ...properties } = user;

      return properties;
    } catch (error) {
      handleError(error);
    }
  }
}
