import { Module } from '@nestjs/common';
import { ObserverGateway } from './observer.gateway';
import { GameService } from 'src/services/game/game.service';
import { AppModule } from 'src/app.module';

@Module({
    providers: [ ObserverGateway, GameService ],
    imports: [ ],
})
export class ObserverModule {}
