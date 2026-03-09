// // src/menu/dto/sync-menu.dto.ts
// import { IsString, IsArray, ValidateNested, IsOptional, IsNumber, IsBoolean } from 'class-validator';
// import { Type } from 'class-transformer';

// export class SyncMenuItemDto {
//   @IsNumber()
//   id: number;

//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsString()
//   description: string;

//   @IsNumber()
//   price: number;

//   @IsBoolean()
//   is_available: boolean;

//   @IsOptional()
//   @IsString()
//   image_url?: string;
// }

// export class SyncCategoryDto {
//   @IsNumber()
//   id: number;

//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsString()
//   description: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => SyncMenuItemDto)
//   items: SyncMenuItemDto[];
// }

// export class SyncMenuDto {
//   @IsString()
//   restaurantSlug: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => SyncCategoryDto)
//   categories: SyncCategoryDto[];
// }
