import base from './base';
const env = process.env.BUILD_ENV || 'dev';
const envConf = require(`./${env}.env`);
export default Object.assign(base, {...envConf.default});
