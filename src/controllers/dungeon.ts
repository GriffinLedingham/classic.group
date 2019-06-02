import DungeonFinder  from '../finder/dungeon/dunegonFinder'
import Player         from '../player/player'

const DungeonController = {
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
    DungeonController.index(req, res)
  },

  queue: (req, res, response: string = null, name = null, level = null, realm = null, key = null) => {
    return queueGET(req, res, response, name, level, realm, key)
  },

  group: (req, res, groupId, response: string = null, name = null, level = null, realm = null, key = null, playerId = null) => {
    return groupGET(req, res, groupId, response, name, level, realm, key, playerId)
  },

  leave: (req, res, groupId) => {
    return leaveGET(req, res, groupId)
  },

  switch: (req, res) => {
    return switchGET(req, res)
  }
}

function findGET(req, res) {
  const name = req.cookies.name
  const level = req.cookies.level
  const realm = req.cookies.realm
  const key = req.cookies.dungeon
  const groupId = req.cookies.group
  const player = req.cookies.player
  let group = null
  if(name != undefined && level != undefined && realm != undefined && key != undefined && groupId != undefined && player != undefined
      && (group = DungeonFinder.isPlayerInGroup(key, player, realm)) != null ) {
    // Display the current group view
    return DungeonController.group(req, res, group.id)
  }
  else if(name != undefined && level != undefined && realm != undefined && key != undefined && player != undefined && group == undefined ) {
    // Display the user's current queue
    return DungeonController.queue(req, res, `You are in the ${key} queue`)
  }
  else {
    // Display dungeon finder landing
    let templateData = {
      name:null,
      level:null,
      realm:null
    }
    if(name != undefined) templateData.name = name
    if(level != undefined) templateData.level = level
    if(realm != undefined) templateData.realm = realm
    res.render('findDungeon', templateData)
  }
}

function findPOST(req, res) {
  const key = req.body.dungeon
  const name = req.body.name
  const level = req.body.level
  const realm = req.body.realm
  const role = req.body.role
  const playerClass = req.body.class

  let player = DungeonFinder.getPlayer(key, name, level, realm, role, playerClass)

  res.cookie('name',    name,       { maxAge: 900000, httpOnly: true });
  res.cookie('level',   level,      { maxAge: 900000, httpOnly: true });
  res.cookie('dungeon', key,        { maxAge: 900000, httpOnly: true });
  res.cookie('realm',   realm,      { maxAge: 900000, httpOnly: true });
  res.cookie('player',  player.id,  { maxAge: 900000, httpOnly: true });

  let group
  if((group = DungeonFinder.isPlayerInGroup(key, player.id, realm)) != null) {
    res.cookie('group', group.id, { maxAge: 900000, httpOnly: true });
    return DungeonController.group(
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
    return DungeonController.queue(
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

function queueGET(req, res, response: string = null, name = null, level = null, realm = null, key = null) {
  if(name == null)  name  = req.cookies.name
  if(level == null) level = req.cookies.level
  if(realm == null) realm = req.cookies.realm
  if(key == null)   key   = req.cookies.dungeon
  if(name != undefined && level != undefined && realm != undefined && key != undefined) {
    return res.render('dungeonQueue', {
      response: response,
      currentDPS: DungeonFinder.getRoleFilteredQueues('dps', key, realm).length,
      currentHeal: DungeonFinder.getRoleFilteredQueues('heal', key, realm).length,
      currentTank: DungeonFinder.getRoleFilteredQueues('tank', key, realm).length,
      dungeon: key,
      name: name,
      level: level,
      realm: realm
    })
  }
  else {
    console.log('queueGET :: We shouldn\'t be here')
    // Display dungeon finder landing
    res.render('findDungeon', {})
  }
}

function groupGET(req, res, groupId = null, response = null, name = null, level = null, realm = null, key = null, playerId = null) {
  if(name == null) name = req.cookies.name
  if(level == null) level = req.cookies.level
  if(realm == null) realm = req.cookies.realm
  if(key == null) key = req.cookies.dungeon
  if(groupId == null) groupId = req.cookies.group
  if(playerId == null) playerId = req.cookies.player
  let group = null
  if(name != undefined && level != undefined && realm != undefined && key != undefined && groupId != undefined && playerId != undefined
      && (group = DungeonFinder.isPlayerInGroup(key, playerId, realm)) != null ) {
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

    let templateData = {
      response: response,
      groupId:  group.id,
      shortId:  group.id.split('-')[0],
      dungeon: key,
      tank: {name: tank.name, level: tank.level, realm: tank.realm, class: tank.playerClass},
      heal: {name: heal.name, level: heal.level, realm: heal.realm, class: heal.playerClass},
      dpsA: {name: dps[0].name, level: dps[0].level, realm: dps[0].realm, class: dps[0].playerClass},
      dpsB: {name: dps[1].name, level: dps[1].level, realm: dps[1].realm, class: dps[1].playerClass},
      dpsC: {name: dps[2].name, level: dps[2].level, realm: dps[2].realm, class: dps[2].playerClass}
    }

    return res.render('groupView', templateData)
  }
  else {
    console.log('groupGET :: We shouldn\'t be here')
    // Display dungeon finder landing
    return res.render('findDungeon', {})
  }
}

function leaveGET(req, res, groupId: string) {
  const name = req.cookies.name
  const level = req.cookies.level
  const realm = req.cookies.realm
  const key = req.cookies.dungeon
  const groupIdCookie = req.cookies.group
  const playerId = req.cookies.player

  if(groupIdCookie != groupId) {

  }

  let group = null
  if(name != undefined && level != undefined && realm != undefined && key != undefined && groupId != undefined && playerId != undefined
    && groupIdCookie == groupId
    && (group = DungeonFinder.isPlayerInGroup(key, playerId, realm)) != null ) {
      group.removePlayer(playerId)
      if(group.players.length < 1) DungeonFinder.deleteGroup(realm, key, groupId)
      let player = DungeonFinder.getPlayer(key, name, level, realm)
      player.removeGroupId()
  }

  // Clear all of player's session cookies, leave user cookies
  res.clearCookie("dungeon");
  res.clearCookie("group");

  // Display dungeon finder landing
  return '<script>location.href = \'/\';</script>';
}

function switchGET(req, res) {
  const player = req.cookies.player
  if(player != undefined)
    DungeonFinder.deletePlayer(player)

  res.clearCookie("dungeon");
  res.clearCookie("group");
  res.clearCookie("name");
  res.clearCookie("player");
  res.clearCookie("realm");
  res.clearCookie("level");

  // Display dungeon finder landing
  return '<script>location.href = \'/\';</script>';
}

export default DungeonController