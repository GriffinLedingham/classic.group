import { Router } from 'express'
import controllers from '../controllers'

function notFound(res) {
  res.status(404)
  return 'Not found'
}

function routes(controller, paramString, req, res) {
  let result = ''
  if (paramString.length > 0) {
    const params = paramString.split('/')
    if (controllers[controller] === undefined
        || controllers[controller][params[1]] === undefined) {
      result = notFound(res)
    } else {
      result = controllers[controller][params[1]](req, res, ...params.slice(2, Object.keys(params).length))
    }
  } else if (controllers[controller] === undefined) {
    result = notFound(res)
  } else {
    result = controllers[controller].index(req, res)
  }
  return result
}

const router = Router()
router.all('/:controller*?', (req, res) => {
  if (req.params['0'] === undefined) {
    const result = routes(req.params.controller, '', req, res)
    if(result != undefined) res.send(result)
  } else {
    const result = routes(req.params.controller, req.params['0'], req, res)
    if(result != undefined) res.send(result)
  }
})

export default router
