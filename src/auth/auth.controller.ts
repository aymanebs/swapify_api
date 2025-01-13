import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Public } from 'src/decorators/public.decorator';


@Controller()
export class AuthController {
  constructor(private readonly authsService: AuthService){}

  @Public()
  @Post('/login')
  async login(@Body() loginDto: loginDto) {
    return this.authsService.login(loginDto);
  }

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto){
    return this.authsService.register(registerDto);
  }

}
