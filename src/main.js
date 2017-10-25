const roleHarvester = require('./roles_harvester')
const roleUpgrader = require('./roles_upgrader')

module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log('Clearing non-existing creep memory:', name)
    }
  }

  const creeps = {
    'harvester': [],
    'upgrader': []
  }

  _.forEach(Game.creeps, (creep) => creeps[creep.memory.role].push(creep))

  console.log('Harvesters: ' + creeps.harvester.length)

  if (creeps.harvester.length < 2) {
    let newName = 'Harvester' + Game.time
    console.log('Spawning new harvester: ' + newName)
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
      { memory: { role: 'harvester' } })
  }

  if (creeps.upgrader.length < 3) {
    let newName = 'Upgrader' + Game.time
    console.log('Spawning new upgrader: ' + newName)
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
      { memory: { role: 'upgrader' } })
  }

  if (Game.spawns['Spawn1'].spawning) {
    let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 })
  }

  for (let name in Game.creeps) {
    let creep = Game.creeps[name]
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep)
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep)
    }
  }
}
