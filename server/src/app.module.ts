import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObserverModule } from './observer/observer.module';

@Module({
  imports: [ObserverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
