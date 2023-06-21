import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Stock } from './stocks.entity';

@Entity('ohlc')
export class OHLC {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  open: number;

  @Column({ nullable: false })
  high: number;

  @Column({ nullable: false })
  low: number;

  @Column({ nullable: false })
  close: number;

  @Column({ nullable: false })
  volume: number;

  @Column({ nullable: false })
  time: Date;

  @ManyToOne(() => Stock, (stock) => stock.data)
  stock: Stock;
}
