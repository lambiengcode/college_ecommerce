import BaseAPI from '.'
import { User } from '../model'
import { fetchAPI, generateToken, convertPasswordHMAC256, genUpdate, lowerCase } from '../common/function'
import FB from 'fb'
import { userRole } from '../common/constants'

export default class UserServices {
  static async count (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      const payload = await User.countDocuments({})
      res.json(payload)
    })
  }

  static async get (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      const payload = await User.find({})
      res.json(payload)
    })
  }

  static async getById (req, res) {
    BaseAPI.authorizationAPI(req, res, async (createdUser) => {
      const payload = await User.find({ id: req.params.id, createdUser: createdUser })
      res.json(payload)
    })
  }

  static async checkUser (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      try {
        const { id } = req.params
        const payload = await User.findOne({ id })
        if (payload) {
          res.json(true)
        } else {
          res.json(false)
        }
      } catch (error) {
        res.status(500).send('error :' + error)
      }
    })
  }

  static async checkuserLocal (id) {
    const payload = await User.findOne({ id })
    return !!payload
  }

  static async postLoginPassword (req, res) {
    try {
      const { email, password, isLogin } = req.body
      res.json(await UserServices.onCreateUser({ isLogin, email, password: convertPasswordHMAC256(password) }))
    } catch (error) {
      res.status(500).send('error :' + error)
    }
  }

  static async postLoginFacebook (req, res) {
    try {
      const { token } = req.body
      FB.api('/me', { fields: ['id', 'name', 'email', 'link', 'picture.type(large)'], access_token: token }, async (response) => {
        const { id, name, email, picture } = response
        res.json(await UserServices.onCreateUser({ id, name, email, picture: (picture && picture.data && picture.data.url) ? picture.data.url : '' }))
      })
    } catch (error) {
      res.status(500).send('error :' + error)
    }
  }

  static async postLoginGoogle (req, res) {
    try {
      const { token } = req.body
      const response = await fetchAPI(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
      res.json(await UserServices.onCreateUser(response))
    } catch (error) {
      res.status(500).send('error :' + error)
    }
  }

  static async onCreateUser (response) {
    return new Promise(async (resolve, reject) => {
      const { id, picture, password, email, isLogin, isLoginAdmin } = response
      console.log(response)
      const emailFormat = lowerCase(email)

      const oldUser = password ? await User.findOne({ id: emailFormat }) : await User.findOne({ id })

      const jwtToken = generateToken(id || emailFormat)
      if (oldUser) {
        if (isLogin || isLoginAdmin) {
          if (oldUser.password !== password) {
            resolve({ errMess: 'namePwNotFound' })
          } else {
            if (isLoginAdmin) {
              if (oldUser.role === userRole.admin) {
                await User.findOneAndUpdate({ id }, { image: picture })
                resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }))
              } else {
                resolve({ errMess: 'notAdmin' })
              }
            } else {
              await User.findOneAndUpdate({ id }, { image: picture })
              resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }))
            }
          }
        } else {
          if (password) {
            resolve({ errMess: 'userExisted' })
          } else {
            await User.findOneAndUpdate({ id }, { image: picture })
            resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }))
          }
        }
      } else {
        if (isLogin) {
          resolve({ errMess: 'namePwNotFound' })
        } else {
          const stateCreate = {
            id: password ? emailFormat : id,
            firstName: response.family_name,
            lastName: response.given_name,
            locale: response.locale,
            email: emailFormat,
            image: picture
          }

          if (password) {
            stateCreate.password = password
          }
          const result = await User.create(stateCreate)
          resolve({ jwtToken, data: result })
        }
      }
    })
  }

  static async update (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      try {
        const { id } = req.body
        const updateField = genUpdate(req.body,
          ['fullName', 'locale', 'image', 'email', 'gender', 'phone', 'address', 'status'])
        await User.findOneAndUpdate({ id }, updateField, { new: true }, (err, result) => {
          if (result || !err) {
            res.json(result)
          } else {
            res.json(false)
          }
        })
      } catch (error) {
        res.status(500).send('error :' + error)
      }
    })
  }

  static async changePassword (req, res) {
    try {
      const { id, oldPassword, newPassword } = req.body

      await User.findOneAndUpdate(
        { id, password: convertPasswordHMAC256(oldPassword) }, { password: convertPasswordHMAC256(newPassword) }, { new: true }, (err, result) => {
          if (result || !err) {
            res.json(result)
          } else {
            res.json(false)
          }
        })
    } catch (error) {
      res.status(500).send('error :' + error)
    }
  }

  static async delete (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      try {
        const { id, status } = req.body
        await User.findOneAndUpdate({ id }, { status }, { new: true }, async (err, result) => {
          if (result || !err) {
            res.json(result)
          } else {
            res.json(false)
          }
        })
      } catch (error) {
        res.send('error :' + error)
      }
    })
  }
}
