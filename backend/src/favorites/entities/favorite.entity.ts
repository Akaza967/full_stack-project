import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FavoriteType {
  TEAM = 'TEAM',
  TOURNAMENT = 'TOURNAMENT',
}

@Entity({ name: 'favorites' })
@Unique(['userId', 'type', 'itemId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'enum', enum: FavoriteType })
  type!: FavoriteType;

  @Column({ name: 'item_id', type: 'uuid' })
  itemId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
