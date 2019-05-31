import Queue            from '../queue'
import GenericFinder    from '../genericFinder'
import Player           from '../../player/player'

const MAX_GROUP_SIZE    = 5
const LEVEL_DEV         = 5

class GroupFinder extends GenericFinder {
    constructor() {
        super(MAX_GROUP_SIZE, LEVEL_DEV)
    }

    getLevelFilteredQueues(key: string, level: number) : Array<Player> {
        return []
    }
}

export default new GroupFinder()