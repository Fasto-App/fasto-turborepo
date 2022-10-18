import next from 'next';

const PORT = Number(process.env.PORT) || 4000

const nextApp = next({
  dev: process.env.NEXT_PUBLIC_ENVIRONMENT  === 'development',
  dir: __dirname,
  hostname: process.env.HOST_NAME,
  port: PORT,
});

export default nextApp;