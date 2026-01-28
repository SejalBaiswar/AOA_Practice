import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ✅ Load .env FIRST
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ✅ TypeORM must be async to read env correctly
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const isRds = host?.includes('rds.amazonaws.com');

        return {
          type: 'postgres',

          host,
          port: Number(config.get<number>('DB_PORT')),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),

          entities: [__dirname + '/**/*.entity{.ts,.js}'],

          // ❌ NEVER auto-sync in practice backend
          synchronize: true,

          logging: config.get('NODE_ENV') === 'development',

          // ✅ Migrations only
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsRun: true,

          // ✅ SSL only for AWS RDS
          ssl: isRds ? { rejectUnauthorized: false } : false,

          extra: {
            max: 10,
          },
        };
      },
    }),

    PatientsModule,
    UsersModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}
