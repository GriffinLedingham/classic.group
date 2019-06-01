import * as express   from 'express'
import * as path      from 'path'
import routes         from './routes'
import DungeonFinder  from './finder/dungeon/dunegonFinder'
import GroupFinder    from './finder/group/groupFinder'
import Player         from './player/player'
import * as exphbs    from 'express-handlebars'
import * as bodyParser from 'body-parser'

class App {
  public express
  public dungeonFinder
  public groupFinder

  constructor() {
    this.express = express()
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.engine('handlebars', exphbs())
    this.express.set('view engine', 'handlebars')
    this.express.set('views', path.join(__dirname, '/../src/views'))

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
