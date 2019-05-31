import Queue    from './queue'
import Group    from './group'
import Player   from '../player/player'

class GenericFinder {
    public MAX_GROUP_SIZE:  number
    public LEVEL_DEV:   number
    public queues:      {[key: string]: Queue}
    public groups:      {[key: string]: Array<Group>}
    public players:     Array<Player>

    constructor(MAX_GROUP_SIZE, LEVEL_DEV) {
        this.MAX_GROUP_SIZE = MAX_GROUP_SIZE
        this.LEVEL_DEV      = LEVEL_DEV
        this.queues         = {}
        this.groups         = {}
        this.players        = []
    }

    public getPlayer(key: string, name: string, level: number, realm: string) : Player {
        for(let i in this.players) {
            let player = this.players[i]
            if(player.level == level
                && player.name == name
                && player.realm == realm)
                return player
        }
        let player = new Player(name, level, realm)
        this.addPlayerToQueue(key, player)
        return player
    }

    public addPlayerToQueue(key: string, player: Player) {
        if(this.queues[key] == undefined)
            this.queues[key] = new Queue([player])
        else
            this.queues[key].addPlayer(player)

        this.players.push(player)

        if(this.canAssembleGroup(key, player.level))
            this.doAssembleGroup(key, player.level)
    }

    public isPlayerInGroup(key: string, playerId: string) : Group {
        if(!this.queues.hasOwnProperty(key)) return null
        let group = null
        let groups = this.groups[key]
        for(let i in groups) {
            let players = groups[i].players
            for(let j in players) {
                if(players[j].id == playerId) {
                    group = groups[i]
                    break
                }
            }
        }
        return group
    }

    public getQueueLength(key) : number {
        if(!this.queues.hasOwnProperty(key)) return 0
        return this.queues[key].getLength()
    }

    private canAssembleGroup(key: string, level: number) : boolean {
        if(this.queues[key].isLocked()) return false
        return this.getLevelFilteredQueues(key, level).length >= this.MAX_GROUP_SIZE
    }

    private doAssembleGroup(key: string, level: number) {
        let players = this.queues[key].removePlayersFromQueue(level, this.LEVEL_DEV, this.MAX_GROUP_SIZE)
        let newGroup = new Group(key, level, players)
        if(!this.groups.hasOwnProperty(key)) this.groups[key] = []
        this.groups[key].push(newGroup)

        console.log(`New group ${newGroup.id} spawned for ${key}`)
    }

    // Interface Classes
    public getLevelFilteredQueues(key: string, level: number) : Array<Player> {
        // OVERRIDE ME
        return []
    }
}

export default GenericFinder