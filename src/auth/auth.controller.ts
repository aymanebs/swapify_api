import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Public } from 'src/decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authsService: AuthService){}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: loginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: loginDto) {
    return this.authsService.login(loginDto);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(@Body() registerDto: RegisterDto){
    return this.authsService.register(registerDto);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({ summary: 'Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth.' })
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with JWT token.' })
  async googleCallback(@Req() req, @Res() res) {
  
      const user = req.user;
      const {password, ...userToSend} = user
      const payload = { sub: user._id, ...userToSend };
  
      const accessToken = await this.authsService.getJwtToken(payload);
  
      res.redirect(`http://localhost:5173?token=${accessToken}`);
  }


}
