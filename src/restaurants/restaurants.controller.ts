import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  // GET /restaurants
  @Get()
  async findAll() {
    return this.restaurantsService.findAll();
  }

  // GET /restaurants/:id/menu
  @Get(':id/menu')
  async getRestaurantMenu(@Param('id') id: string) {
    return this.restaurantsService.getRestaurantMenu(id);
  }
}
