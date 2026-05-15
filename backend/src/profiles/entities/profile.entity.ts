import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DocumentType } from '../enums/document-type.enum';

@Entity({ name: 'profiles' })
@Index('UQ_profile_document', ['documentType', 'documentNumber'], {
  unique: true,
})
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentType,
  })
  documentType!: DocumentType;

  @Column({ name: 'document_number' })
  documentNumber!: string;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ name: 'birth_date', nullable: true, type: 'date' })
  birthDate!: string | null;

  @Column({ name: 'favorite_club', nullable: true, type: 'varchar' })
  favoriteClub!: string | null;

  @Column({ name: 'preferred_position', nullable: true, type: 'varchar' })
  preferredPosition!: string | null;

  @Column({ name: 'sports_objective', nullable: true, type: 'varchar' })
  sportsObjective!: string | null;

  @Column({ name: 'short_bio', nullable: true, type: 'text' })
  shortBio!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
