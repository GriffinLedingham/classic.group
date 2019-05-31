import DungeonFinder  from '../finder/dungeon/dunegonFinder'
import GroupFinder    from '../finder/group/groupFinder'
import Player         from '../player/player'

const FindController = {
  index: () => 'Find Index',

  dungeon: (key, name, level, realm) => {
    let player = DungeonFinder.getPlayer(key, name, level, realm)
    let output = ``

    let group
    if( (group = DungeonFinder.isPlayerInGroup(key, player.id)) != null) {
      output += `You have joined the group ${group.id} for ${key}!`
    } else {
      output += `You have joined the ${key} queue! There are ${DungeonFinder.getQueueLength(key)} players in the queue.`
    }

    return output
  }
}

export default FindController