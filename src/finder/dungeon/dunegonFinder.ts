import Queue            from '../queue'
import GenericFinder    from '../genericFinder'
import Player           from '../../player/player'
import Group            from '../group'

// Debugging group view, remove and uncomment
const MAX_GROUP_SIZE    = 5
const LEVEL_DEV         = 5

class DungeonFinder extends GenericFinder {
    constructor() {
        super(MAX_GROUP_SIZE, LEVEL_DEV)
    }

    public getLevelFilteredQueues(key: string, level: number, realm: string) : Array<Player> {
        if(!this.queues.hasOwnProperty(realm) || !this.queues[realm].hasOwnProperty(key)) return []
        return this.queues[realm][key].filterByLevel(level, LEVEL_DEV);
    }

    public getRoleFilteredQueues(role: string, key: string, realm: string) : Array<Player> {
        if(!this.queues.hasOwnProperty(realm) || !this.queues[realm].hasOwnProperty(key)) return []
        return this.queues[realm][key].filterByRole(role);
    }

    public canAssembleGroup(key: string, level: number, realm: string) : boolean {
        if(this.queues[realm][key].isLocked()) return false

        let dpsQueued = this.getRoleFilteredQueues('dps', key, realm)
        let healQueued = this.getRoleFilteredQueues('heal', key, realm)
        let tankQueued = this.getRoleFilteredQueues('tank', key, realm)

        return ( (dpsQueued.length >= 3) && (healQueued.length > 0) && (tankQueued.length > 0) )
    }

    public doAssembleGroup(key: string, realm: string) {
        let dpsPlayers =  this.queues[realm][key].removePlayersFromQueueByRole('dps', 3)
        let healPlayers = this.queues[realm][key].removePlayersFromQueueByRole('heal', 1)
        let tankPlayers = this.queues[realm][key].removePlayersFromQueueByRole('tank', 1)
        let groupPlayers = dpsPlayers.concat(healPlayers, tankPlayers)

        let newGroup = new Group(key, groupPlayers)
        for(let i in groupPlayers) {
            groupPlayers[i].removeQueueKey()
            groupPlayers[i].setGroupId(newGroup.id)
        }

        if(!this.groups.hasOwnProperty(realm) || !this.groups[realm].hasOwnProperty(key)) {
            if(!this.groups.hasOwnProperty(realm)) this.groups[realm] = {}
            this.groups[realm][key] = {}
        }
        this.groups[realm][key][newGroup.id] = newGroup

        console.log(`New group ${newGroup.id} spawned for ${key} on ${realm}`)
        console.log(JSON.stringify(newGroup,null,2))
        console.log(`Remaining in ${realm} ${key} queue: ${this.queues[realm][key].getLength()}`)
    }
}

export default new DungeonFinder()