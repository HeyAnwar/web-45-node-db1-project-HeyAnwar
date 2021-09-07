const dbConfig = require('../../data/db-config')
const Accounts = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
  try {
    const { name, budget } = req.body
    if (name === undefined || budget === undefined) {
      res.status(400).json({
        message: 'name and budget are required'
      })
    } else if (typeof budget !== 'number' || isNaN(budget)) {
      res.status(400).json({
        message: 'budget of account must be a number'
      })
    } else if (typeof name !== 'string') {
      res.status(400).json({
        message: 'name of account must be a string'
      })
    } else if (name.trim().length < 3 || name.trim().length > 100) {
      res.status(400).json({
        message: 'name of account must be between 3 and 100'
      })
    } else if (req.body.budget < 0 || req.body.budget > 1000000) {
      res.status(400).json({
        message: 'budget of account is too large or too small'
      })
    } else {
      next()
    }
  } catch (err) {
    res.status(201)
    next(err)
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const existing = await dbConfig('accounts')
      .where('name', req.body.name.trim())
      .first()
    if (existing) {
      res.status(400).json({
        message: 'account not found'
      })
      next()
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id)
    if (account) {
      req.account = account
      next()
    } else {
      res.status(404).json({
        message: 'account not found'
      })
      next()
    }
  } catch (err) {
    next(err)
  }
}
