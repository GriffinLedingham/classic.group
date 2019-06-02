import Player       from '../player/player'
import * as UUID    from 'uuid/v4'

class Group {
    public id:      string
    public ts:      number
    public key:     string
    public level:   number
    public players: Array<Player>

    constructor(key: string, players: Array<Player>) {
        this.id         = UUID()
        this.ts         = +new Date()
        this.key        = key
        this.players    = players
    }

    public getLeader() {
        return this.players[0]
    }

    public getPlebs() {
        return this.players.slice(1,this.players.length)
    }

    public removePlayer(playerId: string) {
        for(let i in this.players) {
            if(this.players[i].id == playerId) {
                this.players.splice(parseInt(i),1)
                break
            }
        }
    }
}

export default Group