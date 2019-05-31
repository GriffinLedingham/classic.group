import Queue            from '../queue'
import GenericFinder    from '../genericFinder'
import Player           from '../../player/player'

const MAX_GROUP_SIZE    = 2
const LEVEL_DEV         = 5

class DungeonFinder extends GenericFinder {
    constructor() {
        super(MAX_GROUP_SIZE, LEVEL_DEV)
    }

    getLevelFilteredQueues(key: string, level: number) : Array<Player> {
        if(!this.queues.hasOwnProperty(key)) return []
        return this.queues[key].filterByLevel(level, LEVEL_DEV);
    }
}

export default new DungeonFinder()