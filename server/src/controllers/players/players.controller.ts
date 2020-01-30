import { Controller, Post, Body } from '@nestjs/common';
import { Player } from 'src/models/player.model';
import { GameService } from 'src/services/game/game.service';

@Controller('api/players')
export class PlayersController {
    constructor(private gameService: GameService) {}
    @Post()
    async create(@Body() data: Player): Promise<Player> {
      console.log('new player', data);
      return await this.gameService.newPlayer();
    }
}
