import { Module } from '@nestjs/common';
import { ObserverGateway } from './observer.gateway';
import { GameService } from 'src/services/game/game.service';

@Module({
    providers: [ ObserverGateway ],
    imports: [GameService]
})
export class ObserverModule {}