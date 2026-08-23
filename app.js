const app = require('./server/src/app');
const env = require('./server/src/config/env');

if (require.main === module) {
  app.listen(env.APP_PORT, () => console.log(`Aplicacion lista en http://localhost:${env.APP_PORT}`));
}

module.exports = app;