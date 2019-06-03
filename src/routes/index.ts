/*
 *
 * This file is pretty overkill. I originally had controllers
 * broken out and separate, but decided to chuck it all in an
 * index controller.
 *
 * All this really does now is do some fancy parameter catching
 * to pass into the controller.
 *
 */

import { Router } from 'express'
import indexController from '../controllers/index'

function notFound(res) {
  res.status(404)
  res.render('404', {})
}

function routes(paramString, req, res) {
  let result = ''
  if (paramString.length > 0) {
    const params = paramString.split('/')
    if (indexController === undefined
        || indexController[params[0]] === undefined) {
      return notFound(res)
    } else {
      result = indexController[params[0]](req, res, ...params.slice(1, Object.keys(params).length))
    }
  } else if (indexController === undefined) {
    return notFound(res)
  } else {
    result = indexController.index(req, res)
  }
  return result
}

const router = Router()
router.all('/*?', (req, res) => {
  if (req.params['0'] === undefined) {
    const result = routes('', req, res)
    if(result != undefined) res.send(result)
  } else {
    const result = routes(req.params['0'], req, res)
    if(result != undefined) res.send(result)
  }
})

export default router
