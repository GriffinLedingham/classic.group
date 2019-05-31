import { Router } from 'express'
import controllers from '../controllers'

function notFound(res) {
  res.status(404)
  return 'Not found'
}

function routes(controller, paramString, res) {
  let result = ''
  if (paramString.length > 0) {
    const params = paramString.split('/')
    if (controllers[controller] === undefined
        || controllers[controller][params[1]] === undefined) {
      result = notFound(res)
    } else {
      result = controllers[controller][params[1]](...params.slice(2, Object.keys(params).length))
    }
  } else if (controllers[controller] === undefined) {
    result = notFound(res)
  } else {
    result = controllers[controller].index()
  }
  return result
}

const router = Router()
router.get('/:controller*?', (req, res) => {
  if (req.params['0'] === undefined) {
    res.send(routes(req.params.controller, '', res))
  } else {
    res.send(routes(req.params.controller, req.params['0'], res))
  }
})

export default router
