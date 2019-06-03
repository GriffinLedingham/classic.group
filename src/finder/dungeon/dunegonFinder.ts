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
        return this.queues[realm][key].filterByLevel(level, LEVEL_DEV)
    }

    public getRoleFilteredQueues(role: string, key: string, realm: string) : Array<Player> {
        if(!this.queues.hasOwnProperty(realm) || !this.queues[realm].hasOwnProperty(key)) return []
        return this.queues[realm][key].filterByRole(role)
    }

    public canAssembleGroup(key: string, level: number, realm: string) : boolean {
        if(this.queues[realm][key].isLocked()) return false

        let dpsQueued = this.getRoleFilteredQueues('dps', key, realm)
        let healQueued = this.getRoleFilteredQueues('heal', key, realm)
        let tankQueued = this.getRoleFilteredQueues('tank', key, realm)

        return ( (dpsQueued.length >= 3) && (healQueued.length > 0) && (tankQueued.length > 0) )
    }

    public doAssembleGroup(key: string, realm: string) : void {
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

    public getGroupViewTemplateData(group: Group, response: string) : { response: string,
                                                                        groupId: string,
                                                                        shortId: string,
                                                                        dungeon: string,
                                                                        tank: {name: string, level: number, realm: string, class: string},
                                                                        heal: {name: string, level: number, realm: string, class: string},
                                                                        dpsA: {name: string, level: number, realm: string, class: string},
                                                                        dpsB: {name: string, level: number, realm: string, class: string},
                                                                        dpsC: {name: string, level: number, realm: string, class: string}
                                                                    } {
        let tank = null
        let heal = null
        let dps = []

        for(let i in group.players) {
        let player = group.players[i]
        if(player.role.toLowerCase() == 'tank') {
            tank = player
        } else if(player.role.toLowerCase() == 'heal') {
            heal = player
        } else {
            dps.push(player)
        }
        }

        return {
            response: response,
            groupId:  group.id,
            shortId:  group.id.split('-')[0],
            dungeon: group.key,
            tank: {name: tank.name, level: tank.level, realm: tank.realm, class: tank.playerClass},
            heal: {name: heal.name, level: heal.level, realm: heal.realm, class: heal.playerClass},
            dpsA: {name: dps[0].name, level: dps[0].level, realm: dps[0].realm, class: dps[0].playerClass},
            dpsB: {name: dps[1].name, level: dps[1].level, realm: dps[1].realm, class: dps[1].playerClass},
            dpsC: {name: dps[2].name, level: dps[2].level, realm: dps[2].realm, class: dps[2].playerClass}
        }
    }

    public leaveGroup(group: Group, playerId: string, name: string, level: number, realm: string, key: string) : void {
        group.removePlayer(playerId)
        if(group.players.length < 1) this.deleteGroup(realm, key, group.id)
        let player = this.getPlayer(key, name, level, realm)
        player.removeGroupId()
    }
}

export default new DungeonFinder()