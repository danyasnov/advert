const {Sequelize} = require('sequelize')
const config = require('./config.json')

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
  },
)
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })
