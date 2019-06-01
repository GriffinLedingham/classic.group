import DungeonFinder  from '../finder/dungeon/dunegonFinder'
import GroupFinder    from '../finder/group/groupFinder'
import Player         from '../player/player'

const FindController = {
  index:    (req, res) : void => {},

  dungeon:  (req, res) => {
    if(req.method == 'GET') {
      res.render('findDungeon', { title: 'Hey', message: 'Hello there!' })
    } else {
      const key = req.body.dungeon
      const name = req.body.name
      const level = req.body.level
      const realm = req.body.realm

      let output = ``
      let player = DungeonFinder.getPlayer(key, name, level, realm)
      let group
      if( (group = DungeonFinder.isPlayerInGroup(key, player.id)) != null) {
        return FindController.group(req, res, group.id, `You have joined the group ${group.id}!`)
      } else {
        output += `You have joined the ${key} queue! There are ${DungeonFinder.getQueueLength(key)} players in the queue.`
      }

      res.render('dungeonQueue', { response: output, dungeon: key, name: name, level: level, realm: realm })
    }
  },

  group: (req, res, groupId, response) => {
    res.render('groupView',{ response: response })
  }
}

export default FindController