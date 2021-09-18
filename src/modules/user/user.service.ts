import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { Roles } from '../common/decorators/roles.decorator';
import { User, UserFillableFields } from './user.entity';

@Injectable()
@Roles('admin') // TODO: Add 'authenticatedUser'
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(id: number) {
    return this.userRepository.findOne(id);
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
    // return await this.userRepository
    //   .createQueryBuilder('users')
    //   .where('users.email = :email')
    //   .setParameter('email', email)
    //   .getOne();
  }

  async getByEmailAndPass(email: string, password: string) {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    console.log("userpass",passHash);
    return await this.userRepository.findOne({ email, password: passHash });
    // return await this.userRepository
    //   .createQueryBuilder('users')
    //   .where('users.email = :email and users.password = :password')
    //   .setParameter('email', email)
    //   .setParameter('password', passHash)
    //   .getOne();
  }

  async create(payload: UserFillableFields) {
    const checkUserExistence = await this.getByEmail(payload.email);

    if (checkUserExistence) {
      throw new NotAcceptableException(
        'Another user with provided email already exists.',
      );
    }

    const passHash = crypto.createHmac('sha256', payload.password).digest('hex');
    const newPayload = {...payload,password : passHash}
    const newUser = this.userRepository.create(newPayload);
    return await this.userRepository.save(newUser);
  }
}
