export class MenuItemDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  image_url?: string;
}

export class CategoryDto {
  id: number;
  name: string;
  description?: string;
  items: MenuItemDto[];
}

export class SyncMenuDto {
  restaurantSlug: string;
  categories: CategoryDto[];
}
