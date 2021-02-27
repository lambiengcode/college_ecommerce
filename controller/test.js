import BaseAPI from '.'
import { Test } from '../model'
import { genUpdate, generateID } from '../common/function'

export default class TestServices {
 
    static async getById (req,res){ 
        const id = req.params.id
        const payload = await Test.findOne({_id :id })
        res.json(payload)
    }

  static async get (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      const payload = await Test.find({status: 'ACTIVE'})
      res.json(payload)
    })
  }

  static async create (req, res) {
    BaseAPI.authorizationAPI(req, res, async (createdUser) => {
      try {
        const { name, status } = req.body
        const payload = await Test.create({ name, status })
        res.json(payload)
      } catch (error) {
        res.send('error :' + error)
      }
    })
  }

  static async update (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      try {
        const { id } = req.body
        const updateField = genUpdate(req.body, ['name', 'status'])
        await Test.findOneAndUpdate({ _id : id  }, updateField, { new: true }, async (err, result) => {
          if (!err || result) {
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


  static async delete (req, res) {
    BaseAPI.authorizationAPI(req, res, async () => {
      try {
        const { id } = req.body
        await Test.findOneAndUpdate({ _id : id  }, { status: 'DELETED' }, { new: true }, async (err, result) => {
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
