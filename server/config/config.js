/* If running on production, process.env.NODE_ENV is made available by Heroku;
   If running in test environment, process.env.NODE_ENV is made available from our package.json (set on npm 'test' script); 
   If running in dev environment, process.env.NODE_ENV is null/not available. So 'env' would default to 'development' as being set below
*/
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'; // our Local Dev MongoDB server
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'; // our Local Test MongoDB server
}