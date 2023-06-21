import { Stock } from 'src/entities/stocks.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// env variables not loading so not using this file
const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [Stock],
  synchronize: true, // false for production
};

export default config;
