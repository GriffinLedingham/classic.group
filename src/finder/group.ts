import Player       from '../player/player'
import * as UUID    from 'uuid/v4'

class Group {
    public id:      string
    public key:     string
    public level:   number
    public players: Array<Player>

    public leader:  Player
    public plebs:   Array<Player>

    constructor(key: string, level: number, players: Array<Player>) {
        this.id         = UUID()

        this.key        = key
        this.level      = level
        this.players    = players

        this.leader     = players[0]
        this.plebs      = players.slice(1,players.length)
    }
}

export default Group