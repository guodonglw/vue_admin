var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL:"'http://192.168.11.217:4000/api'",
  // BASE_URL:"'http://192.168.11.241:4001/api'",
})
