import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DentistsModule } from './dentists/dentists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRoot(
      'mongodb://root:example@localhost:27017/dental-booking?authSource=admin',
    ),
    AppointmentsModule,
    AuthModule,
    UserModule,
    DentistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
