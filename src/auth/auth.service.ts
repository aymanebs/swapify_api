import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';


@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ){}

    // Method to validate user credentials

    async validateUser(email: string,password: string): Promise<any>{


        const user = await this.userService.findByEmail(email);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        if (!user.password) return user;


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(user && isPasswordValid ){
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    // Login method

    async login(loginDto: loginDto): Promise< {acces_token: string}>{
        const user = await this.validateUser(loginDto.email,loginDto.password);
        const {password, ...userToSend} = user;
        const payload = {sub: user.id, ...userToSend};

        return {
            acces_token : await this.jwtService.signAsync(payload),
        }
    }

    // Register method

    async register(registerDto: RegisterDto){
        const user = this.userService.createUser(registerDto);
        return user;
    }


    async validateGoogleUser(googleUser: CreateUserDto) {
        const user = await this.userService.findByEmail(googleUser.email);
        if (user) return user;
        return await this.userService.createUser(googleUser);
      }

    async getJwtToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
    
}
