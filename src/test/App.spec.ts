import { expect } from 'chai'
import App from '../App'

describe('App', () => {
  describe('Run', () => {
    it('Should listen on port 3000, and close', () => {
      const server = App.listen(3000, () => {
        expect(server.close()).to.be.an('object')
      })
    })
  })
})
