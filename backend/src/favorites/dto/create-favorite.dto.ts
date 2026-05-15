import { IsEnum, IsUUID } from 'class-validator';
import { FavoriteType } from '../entities/favorite.entity';

export class CreateFavoriteDto {
  @IsEnum(FavoriteType)
  type!: FavoriteType;

  @IsUUID()
  itemId!: string;
}
