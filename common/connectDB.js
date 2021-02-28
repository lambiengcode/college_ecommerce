import mongoose from 'mongoose'

export const connectDatabase = () => {
  mongoose.Promise = require('bluebird')  
  mongoose.connect(`${process.env.DB_URL}`, {
  //mongoose.connect(`mongodb://${process.env.DB_URL}/${process.env.DB_NAME}`, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true
  })
    .then(async () => {
      console.log('EC2 Database connection created')
    }).catch((err) => {
      console.log(err)
    })
}
