import { Controller, Body, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginPayload } from './login.payload';
import { RegisterPayload } from './register.payload';
import { UsersService } from '../user/user.service';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  //@UseGuards(AuthGuard('jwt'))
  // @UseGuards(AuthGuard('jwt'),new RolesGuard("user"))
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Successful Login' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async login(@Body() credentials: LoginPayload): Promise<any> {
    const user = await this.authService.validateUser(credentials);
    return await this.authService.generateToken(user);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Successful Registration',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    console.log("me chala");
    const user = await this.userService.create(payload);
    return await this.authService.generateToken(user);
  }
}

//for pagination 
//inject this to controller parameter @Query() pagination: PaginationRequest
//for swagger annotate controller with  @ApiQuery({name:'page',required:true,type: Number})  @ApiQuery({name:'limit',required:true,type: Number})
