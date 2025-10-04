import { getAllowedOrigins } from '@utils/originsResolver.util';

enum environments {
  development = 'development',
  production = 'production',
}

const serverConfig: {
  port: number;
  origin: string[];
  environment: 'development' | 'production';
  paginationLimit: number;
} = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.ENVIRONMENT as environments,
  origin: getAllowedOrigins(process.env.ORIGIN) || ['http://localhost:3000'],
  paginationLimit: Number(process.env.PAGINATION_LIMIT) || 10,
};

export default serverConfig;
