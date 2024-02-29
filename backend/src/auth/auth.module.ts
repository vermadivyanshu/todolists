import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { jwtConstants } from 'src/services/auth/constants';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, JwtModule.register({
    secret: jwtConstants.secret,
    global: true, 
    signOptions: { expiresIn: '7d' }
  })],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
