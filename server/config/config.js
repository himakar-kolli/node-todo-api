/* 
  If running on 'production', process.env.NODE_ENV is made available by Heroku;
  If running in 'test' environment, process.env.NODE_ENV is made available from our package.json (set on npm 'test' script); 
  If running in 'dev' environment, process.env.NODE_ENV is null/not available. So 'env' would default to 'development' as being set below
*/
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  const config = require('./config.json'); // config here is our javascript object with all of our properties
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]; // this line sets process.env.PORT, process.env.MONGODB_URI & process.env.JWT_SECRET here
  });
}