// const fs = require('fs/promises')
// const contacts = require('./contacts.json')
const path = require('path')
require('dotenv').config()
const fs = require('fs').promises
const UserService = require("../services/userService.js")
const http = require("../helpers/status.js")
// const {
//   signupSchema,
//   loginSchema,
// } = require("../helpers/users_validation_schema")
const validator = require('../helpers/users_validation_schema')
const USERS_DIR = path.join(process.cwd(), process.env.USERS_DIR)
const jimp = require('jimp')

class UserControllers {
  tokenMaxAge = 30 * 24 * 60 * 60 * 1000

  constructor() { }
  
  signup = async (req, res, next) => {
    try {
      const { email, password } = req.body
      await validator.authSchema.validateAsync(req.body)
      const userData = await UserService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: this.tokenMaxAge, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      console.log(e);
      next(e)
    }
  }

  activate = async (req, res, next) => {
    try {
      const activationLink = req.params.link
      await UserService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e) 
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      await validator.authSchema.validateAsync(req.body)
      const userData = await UserService.login(req.body)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: this.tokenMaxAge, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  getCurrentUser = async (req, res, next) => {
    // const { refreshToken } = req.cookies;
    console.log(req.headers);
    try {
      const user = await UserService.getCurrentUser(refreshToken)
      return res.status(http.OK).json({
        status: "success",
        code: http.OK,
        entity: user
      })
    } catch (e) {
      next(e)
    }
  }

  logout = async (req, res, next) => {
    try {
      const { refreshToken } = res.cookies;
      const token = await UserService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }

  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = res.cookies;
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: this.tokenMaxAge, httpOnly: true})
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  avatars = async (req, res, next) => {
    // console.log(req.user.id);
    const {refreshToken} = req.cookies
    try {
      const updatedUser = await UserService.updateAvatar(refreshToken, req.file)
      return res.status(http.OK).json({
        status: "success",
        code: http.OK,
        entity: updatedUser,
      })
    } catch (e) {
      next(e)
    }
  }
}


module.exports = new UserControllers()