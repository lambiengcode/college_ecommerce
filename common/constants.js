export const optionsSocket = {
  /* socket.io options */
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
}

export const sendGridId = {
  resetPassword: 'd-6600ae71c5324523b12ade29e081c815',
  signUp: 'd-6bbac4cb42d14c338c3504599ebb8bf0',
  contactUs: 'd-61a468ea9e5d41d88827f49f02699584'

}

export const reactionType = {
  follow: 'follow',
  like: 'like',
  bad: 'bad',
  good: 'good'
}

export const typeDevice = {
  LIGHT: 'LIGHT',
  FAN: 'FAN'
}

export const timeType = {
  oneTime: 'oneTime',
  loop: 'loop'
}

export const providerType = {
  facebook: 'facebook',
  google: 'google',
  null: null
}

export const categoryType = {
  normal: 'normal'
}

export const userRole = {
  admin: 'admin',
  member: 'member',
  moderator: 'moderator'
}

export const gender = {
  male: 'MALE',
  female: 'FEMALE',
  other: 'OTHER'
}

export const statusActive = {
  inactive: 'INACTIVE',
  active: 'ACTIVE',
  deleted: 'DELETED'
}

export const defaultModel = {
  date: { type: Date },
  string: { type: String, default: '' },
  stringUnique: { type: String, required: true, unique: true },
  array: { type: Array, default: [] },
  number: { type: Number, default: 0 },
  boolean: { type: Boolean, default: true },
  booleanFalse: { type: Boolean, default: false },
  object: { type: Object, default: {} }
}

export const optionsCcxt = {
  apiKey: process.env.FMX_API_KEY,
  secret: process.env.FMX_SECRET_KEY
}
