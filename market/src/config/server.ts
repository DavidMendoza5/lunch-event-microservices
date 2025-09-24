import { getAllowedOrigins } from '@utils/originsResolver.util';

enum environments {
  development = 'development',
  production = 'production',
}

const serverConfig: {
  port: number;
  origin: string[];
  environment: 'development' | 'production';
} = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.ENVIRONMENT as environments,
  origin: getAllowedOrigins(process.env.ORIGIN) || ['http://localhost:3000'],
};

export default serverConfig;
