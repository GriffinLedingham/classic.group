import * as express   from 'express'
import routes         from './routes'
import DungeonFinder  from './finder/dungeon/dunegonFinder'
import GroupFinder    from './finder/group/groupFinder'
import Player         from './player/player'

class App {
  public express
  public dungeonFinder
  public groupFinder

  constructor() {
    this.express = express()
    this.mountRoutes()

    let player1 = new Player('griffin', 5, 'Ravenholdt')
    let player2 = new Player('bob', 4, 'Ravenholdt')

    DungeonFinder.addPlayerToQueue('deadmines', player1)
    DungeonFinder.addPlayerToQueue('deadmines', player2)
  }

  private mountRoutes() : void {
    this.express.use('/', routes)
  }
}

export default new App().express
