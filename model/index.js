import mongoose from 'mongoose'

import UserSchema from './User'
import TestSchema from './Test'


const Schema = mongoose.Schema

const createSchema = (schema) => {
  const model = new Schema(schema, { timestamps: true })
  return model
}

const User = mongoose.model('User', createSchema(UserSchema))
const Test = mongoose.model('Test', createSchema(TestSchema))


export {
  User,
  Test
}

