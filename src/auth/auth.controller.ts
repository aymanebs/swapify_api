import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Public } from 'src/decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';


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

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('auth/google/callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log(' req.user',req.user);
    const user = {email: req.user.email, password: req.user.password};
    const response = await this.authsService.login(user);
    res.redirect(`http://localhost:5173?token=${response.acces_token}`);
  }


}
