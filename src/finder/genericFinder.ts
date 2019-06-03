import Queue    from './queue'
import Group    from './group'
import Player   from '../player/player'

class GenericFinder {
    public MAX_GROUP_SIZE:  number
    public LEVEL_DEV:   number
    public queues:      {[key: string]: {[key: string]: Queue}}
    public groups:      {[key: string]: {[key: string]: {[key: string]: Group}}}
    public players:     {[key: string] : Player}

    constructor(MAX_GROUP_SIZE, LEVEL_DEV) {
        this.MAX_GROUP_SIZE = MAX_GROUP_SIZE
        this.LEVEL_DEV      = LEVEL_DEV
        this.queues         = {}
        this.groups         = {}
        this.players        = {}
    }

    public getPlayer(key: string, name: string, level: number, realm: string, role: string = null, playerClass: string = null) : Player {
        let player = null
        for(let i in this.players) {
            let itPlayer = this.players[i]
            if(itPlayer.level == level
                && itPlayer.name == name
                && itPlayer.realm == realm) {
                player = itPlayer
            }
        }

        if(player != null && (player.groupId != null || player.queueKey != null))
            return player

        if(player == null)
            player = new Player(name, level, realm, role, playerClass)

        this.addPlayerToQueue(key, player)
        return player
    }

    public deletePlayer(playerId: string) : boolean {
        let result = false
        if(this.players.hasOwnProperty(playerId)) {
            let player = this.players[playerId]
            if(player.queueKey != null)
                this.queues[player.realm][player.queueKey].removePlayer(playerId)
            delete this.players[playerId]
            result = true
        }

        return result
    }

    public getGroup(key: string, realm: string, groupId: string) : Group {
        if(!this.groups.hasOwnProperty(realm) || !this.groups[realm].hasOwnProperty(key)) return null
        if(this.groups[realm][key].hasOwnProperty(groupId)) {
            return this.groups[realm][key][groupId]
        }
        return null
    }

    public deleteGroup(realm: string, key: string, groupId: string) {
        if(this.groups[realm][key].hasOwnProperty(groupId))
            delete this.groups[realm][key][groupId]
    }

    public addPlayerToQueue(key: string, player: Player) {
        if(this.queues[player.realm] == undefined) {
            this.queues[player.realm] = {}
            this.queues[player.realm][key] = new Queue([player])
        } else {
            if(!this.queues[player.realm].hasOwnProperty(key)) this.queues[player.realm][key] = new Queue()
            this.queues[player.realm][key].addPlayer(player)
        }

        player.setQueueKey(key)
        this.players[player.id] = (player)

        for(let i in this.queues) {
            let realmQueues = this.queues[i]
            for(let j in realmQueues) {
                console.log(`${i} - ${j} Queue: ${realmQueues[j].getLength()}`)
            }
        }
        for(let i in this.groups) {
            let realmGroups = this.groups[i]
            for(let j in realmGroups) {
                console.log(`${i} - ${j} Groups: ${Object.keys(realmGroups[j]).length}`)
            }
        }

        if(this.canAssembleGroup(key, player.level, player.realm))
            this.doAssembleGroup(key, player.realm)
    }

    public isPlayerInGroup(key: string, playerId: string, realm: string) : Group {
        if(!this.groups.hasOwnProperty(realm) || !this.groups[realm].hasOwnProperty(key)) return null
        let group = null
        let groups = this.groups[realm][key]
        for(let i in groups) {
            let players = groups[i].players
            for(let j in players) {
                if(players[j].id == playerId) {
                    group = groups[i]
                    break
                }
            }
            if(group != null) break
        }
        return group
    }

    public getQueueLength(key: string, realm: string) : number {
        if(!this.queues.hasOwnProperty(realm) || !this.queues[realm].hasOwnProperty(key)) return 0
        return this.queues[realm][key].getLength()
    }

    public canAssembleGroup(key: string, level: number, realm: string) : boolean {
        if(this.queues[realm][key].isLocked()) return false
        return this.getLevelFilteredQueues(key, level, realm).length >= this.MAX_GROUP_SIZE
    }

    public doAssembleGroup(key: string, realm: string) {
        // OVERRIDE ME
    }

    // Interface Classes
    public getLevelFilteredQueues(key: string, level: number, realm: string) : Array<Player> {
        // OVERRIDE ME
        return []
    }
}

export default GenericFinder