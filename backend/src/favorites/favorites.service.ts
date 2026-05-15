import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {
    const existing = await this.favoritesRepository.findOne({
      where: {
        userId,
        type: createFavoriteDto.type,
        itemId: createFavoriteDto.itemId,
      },
    });

    if (existing) {
      throw new ConflictException('El ítem ya está en favoritos');
    }

    const favorite = this.favoritesRepository.create({
      userId,
      ...createFavoriteDto,
    });

    return this.favoritesRepository.save(favorite);
  }

  findAll(userId: string) {
    return this.favoritesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: string, id: string) {
    const favorite = await this.favoritesRepository.findOne({
      where: { id, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoritesRepository.remove(favorite);
  }
}
