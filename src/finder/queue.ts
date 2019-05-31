import Player from "../player/player"

class Queue {
    public players: Array<Player>
    public locked:  boolean

    constructor(players = []) {
        this.players    = players
        this.locked     = false
    }

    getLength() {
        return this.players.length
    }

    isLocked() {
        return this.locked
    }

    lock() {
        this.locked = true
    }

    unlock() {
        this.locked = false
    }

    filterByLevel(level, levelDeviation) {
        return this.players.filter( player => (player.level > level - levelDeviation) && (player.level < level + levelDeviation) )
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    removePlayersFromQueue(level: number, levelDeviation: number, count: number) : Array<Player> {
        let removedPlayers  = []
        let removedIds      = []
        let filterPlayers = this.filterByLevel(level, levelDeviation)
        for(let i in filterPlayers) {
            removedPlayers.push(filterPlayers[i])
            removedIds.push(filterPlayers[i].id)
            if(removedPlayers.length >= count) break
        }
        for(let i = this.players.length - 1; i >= 0; i--) {
            if(removedIds.indexOf(this.players[i].id) != -1) {
                removedIds.splice(removedIds.indexOf(this.players[i].id), 1)
                this.players.splice(i,1)
            }
            if(removedIds.length == 0)
                break
        }
        return removedPlayers
    }
}

export default Queue