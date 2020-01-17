import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObserverModule } from './observer/observer.module';
import { GameService } from './services/game/game.service';
import { PlayersController } from './controllers/players/players.controller';

@Module({
  imports: [ObserverModule],
  controllers: [AppController, PlayersController],
  providers: [AppService, GameService],
})
export class AppModule {}
