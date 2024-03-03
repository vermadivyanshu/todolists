import { List } from "src/list/list.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique: true})
  username: string;

  @Column({nullable: false})
  password: string;

  @OneToMany(() => List, (list) => list.user)
  lists: List[]

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}