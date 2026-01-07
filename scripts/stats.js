import { world, system, ItemStack, Player } from '@minecraft/server'

export function getPlayerDynamicProperty(player, objective) {
    return world.getDynamicProperty(`${player.name.toLowerCase()}:${objective}`)
}

export function setPlayerDynamicProperty(player, objective, value, add = false) {
    add && typeof value === 'number' && world.getDynamicProperty(`${player.name.toLowerCase()}:${objective}`) ? world.setDynamicProperty(`${player.name.toLowerCase()}:${objective}`,  world.getDynamicProperty(`${player.name.toLowerCase()}:${objective}`) + value) : world.setDynamicProperty(`${player.name.toLowerCase()}:${objective}`, value)
}

export function getGlobalDynamicProperty(objective) {
    return world.getDynamicProperty(objective)
}

export function setGlobalDynamicProperty(objective, value, add = false) {
    add && typeof value === 'number' && world.getDynamicProperty(objective) ? world.setDynamicProperty(objective, world.getDynamicProperty(objective)+value) : world.setDynamicProperty(objective, value)
}

export function getScore(target, objective) {
    try {
        if (world.scoreboard.getObjective(objective).getScore(typeof target === 'string' ? target : target.scoreboardIdentity) === undefined) {
            return 0
        } else { return world.scoreboard.getObjective(objective).getScore(typeof target === 'string' ? target : target.scoreboardIdentity) }
    } catch {
        return 0
    }
}

export function setScore(target, objective, amount, add = false) {
    const scoreObj = world.scoreboard.getObjective(objective)
    const score = (add ? scoreObj?.getScore(target) ?? 0 : 0) + amount
    scoreObj?.setScore(target, score)
    return score;
}

export function setStat(player, stat, amount, add = false) {
    if (typeof amount !== 'number') return
    if (!add) return setPlayerDynamicProperty(player, stat, amount)
    const multiplier = getPlayerDynamicProperty(player, `${stat}Mult`)
    if (!multiplier && multiplier != 0) return setPlayerDynamicProperty(player, stat, amount, true)
    return setPlayerDynamicProperty(player, stat, amount*multiplier, true)
}