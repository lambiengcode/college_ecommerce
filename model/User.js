import { defaultModel, userRole, statusActive, gender, providerType } from '../common/constants'

export default {
  id: defaultModel.string,
  fullName: defaultModel.string,
  email: defaultModel.string,
  image: defaultModel.string,
  gender: { type: String, default: gender.other },
  phone: defaultModel.string,
  address: defaultModel.string,
  status: { type: String, default: statusActive.active },
  password: defaultModel.string,
  role: { type: String, default: userRole.member },
  provider: { type: String, default: providerType.null }

}
