import { CreateUserDto } from "./../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController {
   constructor(private authService: AuthService) {}

   @Post("signup")
   signup(@Body() dto: CreateUserDto) {
      return this.authService.signup(dto);
   }

   @Post("signin")
   @HttpCode(HttpStatus.OK)
   signin(@Body() dto: AuthDto) {
      return this.authService.signin(dto);
   }
}
