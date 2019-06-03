import DungeonFinder  from '../finder/dungeon/dunegonFinder'

const IndexController = {
  index:    (req, res) => {
    if(req.method == 'GET') {
      return findGET(req, res)
    }
    else if(req.method == 'POST') {
      return findPOST(req, res)
    }
    else {
      res.status(404)
      res.render('404', {})
    }
  },

  find:  (req, res) => {
    IndexController.index(req, res)
  },

  queue: (req, res, response?: string, name?: string, level?: number, realm?: string, key?: string) => {
    return queueGET(req, res, response, name, level, realm, key)
  },

  group: (req, res, groupId, response?: string, name?: string, level?: number, realm?: string, key?: string, playerId?: string) => {
    return groupGET(req, res, groupId, response, name, level, realm, key, playerId)
  },

  leave: (req, res, groupId: string) => {
    return leaveGET(req, res, groupId)
  },

  switch: (req, res) => {
    return switchGET(req, res)
  }
}

function findGET(req, res) {
  const name      = req.cookies.name
  const level     = req.cookies.level
  const realm     = req.cookies.realm
  const key       = req.cookies.dungeon
  const groupId   = req.cookies.group
  const player    = req.cookies.player

  let group = null
  if(name != undefined && level != undefined && realm != undefined && key != undefined && groupId != undefined && player != undefined
      && (group = DungeonFinder.isPlayerInGroup(key, player, realm)) != null ) {
    // Display the current group view
    return IndexController.group(req, res, group.id)
  }
  else if(name != undefined && level != undefined && realm != undefined && key != undefined && player != undefined && group == undefined ) {
    // Display the user's current queue
    return IndexController.queue(req, res, `You are in the ${key} queue`)
  }
  else {
    // Display dungeon finder landing
    res.render('findDungeon', {
      name:   name  || null,
      level:  level || null,
      realm:  realm || null
    })
  }
}

function findPOST(req, res) {
  const key         = req.body.dungeon
  const name        = req.body.name
  const level       = req.body.level
  const realm       = req.body.realm
  const role        = req.body.role
  const playerClass = req.body.class

  if(name == '') return res.render('findDungeon', {})

  let player = DungeonFinder.getPlayer(key, name, level, realm, role, playerClass)

  res.cookie('name',    name,       { maxAge: 900000, httpOnly: true });
  res.cookie('level',   level,      { maxAge: 900000, httpOnly: true });
  res.cookie('dungeon', key,        { maxAge: 900000, httpOnly: true });
  res.cookie('realm',   realm,      { maxAge: 900000, httpOnly: true });
  res.cookie('player',  player.id,  { maxAge: 900000, httpOnly: true });

  let group
  if((group = DungeonFinder.isPlayerInGroup(key, player.id, realm)) != null) {
    res.cookie('group', group.id, { maxAge: 900000, httpOnly: true });
    return IndexController.group(
      req,
      res,
      group.id,
      `A group has been found`,
      name,
      level,
      realm,
      key,
      player.id
    )
  }
  else {
    return IndexController.queue(
      req,
      res,
      `You are in the ${key} queue`,
      name,
      level,
      realm,
      key
    )
  }
}

function queueGET(req, res, response: string, name: string, level: number, realm: string, key: string) {
  if(name == undefined)  name  = req.cookies.name
  if(level == undefined) level = req.cookies.level
  if(realm == undefined) realm = req.cookies.realm
  if(key == undefined)   key   = req.cookies.dungeon
  if(name != undefined && level != undefined && realm != undefined && key != undefined) {
    return res.render('dungeonQueue', {
      response: response,
      currentDPS:   DungeonFinder.getRoleFilteredQueues('dps', key, realm).length,
      currentHeal:  DungeonFinder.getRoleFilteredQueues('heal', key, realm).length,
      currentTank:  DungeonFinder.getRoleFilteredQueues('tank', key, realm).length,
      dungeon:      key,
      name:         name,
      level:        level,
      realm:        realm
    })
  }
  else {
    console.log('queueGET :: We shouldn\'t be here')
    // Display dungeon finder landing
    res.render('findDungeon', {})
  }
}

function groupGET(req, res, groupId: string, response: string, name: string, level: number, realm: string, key: string, playerId: string) {
  if(name == undefined)      name      = req.cookies.name
  if(level == undefined)     level     = req.cookies.level
  if(realm == undefined)     realm     = req.cookies.realm
  if(key == undefined)       key       = req.cookies.dungeon
  if(groupId == undefined)   groupId   = req.cookies.group
  if(playerId == undefined)  playerId  = req.cookies.player
  let group = null
  if(name != undefined && level != undefined && realm != undefined && key != undefined && groupId != undefined && playerId != undefined
      && (group = DungeonFinder.isPlayerInGroup(key, playerId, realm)) != null ) {
    // Display the group view
    return res.render('groupView', DungeonFinder.getGroupViewTemplateData(group, response))
  }
  else {
    console.log('groupGET :: We shouldn\'t be here')
    // Display dungeon finder landing
    return res.render('findDungeon', {})
  }
}

function leaveGET(req, res, groupId: string) : string {
  const name          = req.cookies.name
  const level         = req.cookies.level
  const realm         = req.cookies.realm
  const key           = req.cookies.dungeon
  const groupIdCookie = req.cookies.group
  const playerId      = req.cookies.player

  if(groupIdCookie != groupId) {

  }

  let group = null
  if(name != undefined && level != undefined && realm != undefined && key != undefined && groupId != undefined && playerId != undefined
    && groupIdCookie == groupId
    && (group = DungeonFinder.isPlayerInGroup(key, playerId, realm)) != null ) {
      DungeonFinder.leaveGroup(group, playerId, name, level, realm, key)
  }

  // Clear all of player's session cookies, leave user cookies
  res.clearCookie("dungeon")
  res.clearCookie("group")

  // Display dungeon finder landing
  return '<script>location.href = \'/\';</script>'
}

function switchGET(req, res) : string {
  const player = req.cookies.player
  if(player != undefined)
    DungeonFinder.deletePlayer(player)

  res.clearCookie("dungeon")
  res.clearCookie("group")
  res.clearCookie("name")
  res.clearCookie("player")
  res.clearCookie("realm")
  res.clearCookie("level")

  // Display dungeon finder landing
  return '<script>location.href = \'/\';</script>'
}

export default IndexController