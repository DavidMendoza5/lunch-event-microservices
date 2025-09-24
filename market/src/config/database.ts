export type DatabaseConfig = Record<
  string,
  {
    username: string;
    password: string;
    database: string;
    host: string;
  }
>;

const config: DatabaseConfig = {
  development: {
    username: process.env.DATABASE_USERNAME || 'mysql',
    password: process.env.DATABASE_PASSWORD || 'mysql',
    database: process.env.DATABASE_NAME || 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
  },
  production: {
    username: process.env.DATABASE_USERNAME || 'mysql',
    password: process.env.DATABASE_PASSWORD || 'mysql',
    database: process.env.DATABASE_NAME || 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
  },
};

export default config;
