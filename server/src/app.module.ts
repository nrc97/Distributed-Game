import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObserverModule } from './observer/observer.module';
import { GameService } from './services/game/game.service';

@Module({
  imports: [ObserverModule],
  controllers: [AppController],
  providers: [AppService, GameService],
})
export class AppModule {}
