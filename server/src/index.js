const app = require('./app');
const env = require('./config/env');

app.listen(env.PORT, () => console.log(`API REST lista en http://localhost:${env.PORT}`));