import { Controller, Post, Body } from '@nestjs/common';
import { Player } from 'src/models/player.model';
import { GameService } from 'src/services/game/game.service';

@Controller('players')
export class PlayersController {
    constructor(private gameService: GameService) {}
    @Post('create')
    async create(@Body() data: Player): Promise<Player> {
      return this.gameService.newPlayer();
    }
}
