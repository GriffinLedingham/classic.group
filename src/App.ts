import * as express       from 'express'
import * as path          from 'path'
import routes             from './routes'
import * as exphbs        from 'express-handlebars'
import * as bodyParser    from 'body-parser'
import * as cookieParser  from 'cookie-parser'


class App {
  public express
  public dungeonFinder
  public groupFinder

  constructor() {
    this.express = express()
    this.express.use(express.static('static'));
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(cookieParser())
    this.express.engine('handlebars', exphbs())
    this.express.set('view engine', 'handlebars')
    this.express.set('views', path.join(__dirname, '/../src/views'))
    this.mountRoutes()
  }

  private mountRoutes() : void {
    this.express.use('/', routes)
  }
}

export default new App().express
