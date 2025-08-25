
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  //endpoint: process.env.API_URL,
  //masterKey: process.env.API_KEY,
    port: process.env.PORT,
    MONGO_BD: process.env.MONGO_BD,
    JWT_SECRET: process.env.JWT_SECRET
};



// config.js 
// can add for other env variables here without exposing them directly
// if (result.error) {
//   throw result.error;
// }
// const { parsed: envs } = result;
// console.log(envs);
// module.exports = envs;