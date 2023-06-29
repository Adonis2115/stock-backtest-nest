import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OHLC } from './entities/ohlc.entity';
import { Stock } from './entities/stocks.entity';
import { StocksModule } from './stocks/stocks.module';
import { MomentumModule } from './scanner/momentum/momentum.module';
import { TrendModule } from './strategy/trend/trend.module';
import { RsiModule } from './scanner/rsi/rsi.module';
import { BacktestRsiModule } from './strategy/backtest-rsi/backtest-rsi.module';

@Module({
  imports: [
    StocksModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [Stock, OHLC],
      synchronize: true,
    }),
    MomentumModule,
    TrendModule,
    RsiModule,
    BacktestRsiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
