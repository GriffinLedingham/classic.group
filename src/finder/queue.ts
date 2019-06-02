import Player from "../player/player"

class Queue {
    public players: {[key: string]: Player}
    public locked:  boolean

    constructor(players = []) {
        this.players    = {}
        for(let i in players) {
            this.players[players[i].id] = players[i]
        }

        this.locked     = false
    }

    getLength() {
        return Object.keys(this.players).length
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
        let filterPlayers = []

        for(let i in this.players) {
            let player = this.players[i]
            if((player.level > level - levelDeviation) && (player.level < level + levelDeviation))
                filterPlayers.push(player)
        }

        return filterPlayers
    }

    filterByRole(role) {

        let filterPlayers = []

        for(let i in this.players) {
            let player = this.players[i]
            if(player.role.toLowerCase() == role.toLowerCase())
                filterPlayers.push(player)
        }

        return filterPlayers
    }

    addPlayer(player: Player) {
        this.players[player.id] = player
    }

    removePlayer(playerId: string) {
        if(this.players.hasOwnProperty(playerId))
            delete this.players[playerId]
    }

    removePlayersFromQueueByLevel(level: number, levelDeviation: number, count: number) : Array<Player> {
        let removedPlayers  = []
        let removedIds      = []
        let filterPlayers = this.filterByLevel(level, levelDeviation)
        for(let i in filterPlayers) {
            removedPlayers.push(filterPlayers[i])
            removedIds.push(filterPlayers[i].id)
            if(removedPlayers.length >= count) break
        }
        for(let i in removedIds) {
            delete this.players[removedIds[i]]
        }
        return removedPlayers
    }

    removePlayerFromQueue(playerId: string) : boolean {
        let result = false

        if(this.players.hasOwnProperty(playerId)) {
            delete this.players[playerId]
            result = true
        }

        return result
    }

    removePlayersFromQueueByRole(role: string, count: number) : Array<Player> {
        let removedPlayers  = []
        let removedIds      = []
        let filterPlayers = this.filterByRole(role)
        for(let i in filterPlayers) {
            removedPlayers.push(filterPlayers[i])
            removedIds.push(filterPlayers[i].id)
            if(removedPlayers.length >= count) break
        }
        for(let i in removedIds) {
            delete this.players[removedIds[i]]
        }
        return removedPlayers
    }
}

export default Queue