import { Controller, Post, Body, Headers } from '@nestjs/common';
import { MenuService } from './menu.service';
import { SyncMenuDto } from './dto/sync-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('sync')
  async syncMenu(
    @Headers('x-api-key') apiKey: string,
    @Body() body: SyncMenuDto,
  ) {
    return this.menuService.syncMenu(apiKey, body);
  }
}