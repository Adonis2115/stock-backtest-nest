import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OHLC } from './ohlc.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  symbol: string;

  @Column({ nullable: false })
  lotSize: number;

  @OneToMany(() => OHLC, (ohlc) => ohlc.stock)
  data: OHLC[];
}
