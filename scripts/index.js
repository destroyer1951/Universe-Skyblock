import { world, system, ItemStack, Player, EntityPushThroughComponent } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from './extensions/forms.js';

import { items, makeItem, rollStars } from './items.js'
import { prices } from './prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from './stats.js'
import * as Menus from './compassGui/mainGui.js'
import * as tables from './myLootTables.js'
import { FishingEvent, FishingResult } from './fishingEvent.js'

const { 
    mainMenu, 
    codesMenu, 
    shopMainMenu, 
    generalShopMenu, 
    farmShopMenu, 
    fishingShopMenu, 
} = Menus


/*
██    ██     ███████ ████████  █████  ████████ ███████     ██    ██ 
██    ██     ██         ██    ██   ██    ██    ██          ██    ██ 
██    ██     ███████    ██    ███████    ██    ███████     ██    ██ 
 ██  ██           ██    ██    ██   ██    ██         ██      ██  ██  
  ████       ███████    ██    ██   ██    ██    ███████       ████   
*/                                                                 


world.afterEvents.playerSpawn.subscribe(data => {
    const player = data.player
    
    const compass = new ItemStack("minecraft:compass")
    compass.lockMode = "slot"
    compass.nameTag = "§r§fMain Menu"
    compass.setLore(["", "§7Right Click to Open the Main Menu!"])
    player.getComponent('inventory').container.setItem(8, compass)
    player.addEffect("saturation", 20000000, { amplifier: 25, showParticles: false })
    
    if (!data.initialSpawn) return
    player.sendMessage('§cThis world uses Data Storage Basket created by destroyer1951. Any username changes will result in §lpermanent§r§c data loss. You have been warned.')

    if (!getPlayerDynamicProperty(player, 'coins')) setPlayerDynamicProperty(player, 'coins', 0)
    if (!getPlayerDynamicProperty(player, 'skyblockLevel')) setPlayerDynamicProperty(player, 'skyblockLevel', 0)
    if (!getPlayerDynamicProperty(player, 'skyblockXP')) setPlayerDynamicProperty(player, 'skyblockXP', 0)
    if (!getPlayerDynamicProperty(player, 'miningLevel')) setPlayerDynamicProperty(player, 'miningLevel', 0)
    if (!getPlayerDynamicProperty(player, 'miningXP')) setPlayerDynamicProperty(player, 'miningXP', 0)
    if (!getPlayerDynamicProperty(player, 'fishingLevel')) setPlayerDynamicProperty(player, 'fishingLevel', 0)
    if (!getPlayerDynamicProperty(player, 'fishingXP')) setPlayerDynamicProperty(player, 'fishingXP', 0)
    if (!getPlayerDynamicProperty(player, 'farmingLevel')) setPlayerDynamicProperty(player, 'farmingLevel', 0)
    if (!getPlayerDynamicProperty(player, 'farmingXP')) setPlayerDynamicProperty(player, 'farmingXP', 0)
    if (!getPlayerDynamicProperty(player, 'cookingLevel')) setPlayerDynamicProperty(player, 'cookingLevel', 0)
    if (!getPlayerDynamicProperty(player, 'cookingXP')) setPlayerDynamicProperty(player, 'cookingXP', 0)
})

world.beforeEvents.chatSend.subscribe(data => {
    if (data.message.startsWith('-') && data.sender.hasTag('chatcmds')) {
        data.cancel = true
        const player = data.sender
        switch (data.message.split(' ', 2)[0].toLowerCase().substring(1)) {
            case 'setlore':{
                const item = player.getComponent('equippable').getEquipment('Mainhand')
                system.run(() => {
                    if (data.message.includes('\\n')) {
                        const lore = data.message.substring(9).split('\\n')
                        for (let i = 0; i < lore.length; i++) {
                            lore[i] = '§r' + lore[i]
                        }
                        item.setLore(lore)
                    } else item.setLore([`§r${data.message.substring(9)}`])
                    player.getComponent('equippable').setEquipment('Mainhand', item)
                })
                return;
            } case 'rename':{
                const item = player.getComponent('equippable').getEquipment('Mainhand')
                system.run(() => {
                    item.nameTag = `§r§f${data.message.substring(8)}`
                    player.getComponent('equippable').setEquipment('Mainhand', item)
                })
                return;
            } case 'setplayerprop':{
                let propData
                propData = data.message.substring(15).match(/(?:[^\s"]+|"[^"]*")+/g).map(arg => arg.replace(/"/g, ""));
                const property = propData[1]
                let name = propData[0].toLowerCase().replace('@', '')
                let newValue = propData[2]
                let add
                if (Number.isFinite(Number(newValue))) {
                    newValue = Number(newValue)
                    if (propData[3] == 'add' || propData[3] == 'true') add = true
                }
                let oldValue = world.getDynamicProperty(`${name}:${property}`)
                if (!oldValue && add) oldValue = 0
                if (add) {
                    world.setDynamicProperty(`${name}:${property}`, oldValue+newValue)
                } else {
                    world.setDynamicProperty(`${name}:${property}`, newValue)
                }
                

player.sendMessage(`§aInformation for the player property §e${property}

§aPlayer Name: §e${name}
§aProperty Name: §e${property}
§aOld Value: §e${oldValue}
§aNew Value: §e${world.getDynamicProperty(`${name}:${property}`)}`)
                return;
            } case 'getplayerprop':{
                let propData
                propData = data.message.substring(15).match(/(?:[^\s"]+|"[^"]*")+/g).map(arg => arg.replace(/"/g, ""));
                const property = propData[1]
                let name = propData[0].toLowerCase().replace('@', '')
                const value = world.getDynamicProperty(`${name}:${property}`)

player.sendMessage(`§aInformation for the player property §e${property}

§aPlayer Name: §e${name}
§aProperty Name: §e${property}
§aValue: §e${value}`)
                return;
            } case 'setglobalprop':{
                const propData = data.message.substring(15).split(' ')
                const property = propData[0]
                let newValue = propData[1]
                let add = false
                if (Number.isFinite(Number(newValue))) {
                    newValue = Number(newValue)
                    if (propData[2] == 'add' || propData[2] == 'true') add = true
                }


                const oldValue = getGlobalDynamicProperty(property)
                setGlobalDynamicProperty(property, newValue, add)
                player.sendMessage(`§aInformation for the global property §e${property}

§aName: §e${property}
§aOld Value: §e${oldValue}
§aNew Value: §e${getGlobalDynamicProperty(property)}`)
                return;
            } case 'getglobalprop':{
                const property = data.message.substring(15)
                player.sendMessage(`§aInformation for the global property §e${property}

§aName: §e${property}
§aValue: §e${getGlobalDynamicProperty(property)}`)
                return;
            } case 'item': {
                const itemData = data.message.substring(6).split(' ')
                const itemId = itemData[0]
                let amount = 1
                if (itemData[1] && Number.isFinite(Number(itemData[1]))) amount = Number(itemData[1])
                system.run(() => {
                    const item = items[itemId]
                    item.amount = amount
                    player.getComponent('inventory').container.addItem(item)
                })
            }
        }
    } else {
        data.cancel = true
        if (data.message.includes("§")) return data.sender.sendMessage("§cYou cannot use formatting codes in chat messages!")
        world.sendMessage(`§8[§a${getPlayerDynamicProperty(data.sender, 'skyblockLevel')}§8] §8<§7${data.sender.name}§8> §f${data.message}`)
    }
})

export const xpRequirements = [
    50,
    125,
    250,
    600,
    1500,
    3500,
    5000,
    10000,
    20000,
    30000,
    40000,
    50000,
    65000,
    80000,
    100000,
    125000 // 15
]

export const levelCoins = [
    100,
    200,
    350,
    750,
    1500,
    3500,
    6500,
    10000,
    17500,
    25000,
    40000,
    75000,
    110000,
    150000,
    200000 // 15
]

function checkLevelUp(player, skill) {
    let level = getPlayerDynamicProperty(player, `${skill}Level`)
    let xp = getPlayerDynamicProperty(player, `${skill}XP`)
    let color = "§f"
    switch (skill) {
        case "mining": color = "§b"; break;
        case "fishing": color = "§9"; break;
        case "farming": color = "§a"; break;
        case "cooking": color = "§4"; break;
    }
    const skillDisplay = skill[0].toUpperCase() + skill.slice(1)

    if (xp >= xpRequirements[level]) {

        setPlayerDynamicProperty(player, `${skill}Level`, level + 1)
        setPlayerDynamicProperty(player, `${skill}XP`, xp - xpRequirements[level])

        setPlayerDynamicProperty(player, 'coins', levelCoins[level], true)

        const levelAverage = ((getPlayerDynamicProperty(player, 'miningLevel') + getPlayerDynamicProperty(player, 'fishingLevel'))/2).toFixed(1) // remember to add farming and cooking later
        setPlayerDynamicProperty(player, 'skyblockLevel', levelAverage)

        player.sendMessage(`§b-------------------------------------\n\n§l§e LEVEL UP >> §r§aYour ${color}${skillDisplay}§a level is now §l${color}${level + 1}§r§a!\n §r§6+${levelCoins[level]} Coins\n\n§b-------------------------------------`)
        player.playSound("random.levelup")
    }
}



/*
  ██    ██         ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████     ██    ██ 
  ██    ██         ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██          ██    ██ 
  ██    ██         █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████     ██    ██ 
   ██  ██          ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██      ██  ██  
    ████           ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████       ████
*/

export const checkItemAmount = (player, itemId, clearItems = false, itemName="") => {
    const inventory = player.getComponent("inventory").container
    let itemAmount = 0
    for (let i = 0; i < 36; i++) {
        let item = inventory.getItem(i)
        if (item?.typeId !== itemId) continue
        if (itemName && item.nameTag !== itemName) continue;
        itemAmount += item.amount
        if (clearItems) inventory.setItem(i)
    }
    return itemAmount
}

export const checkInvEmpty = (player) => {
    const inventory = player.getComponent("inventory").container
    for (let i = 0; i < 36; i++) {
        let item = inventory.getItem(i)
        if (item) return false
    }
    return true
}

/**
 * Decreases the specified item on the player by an amount.
 * 
 * Decrement of 0 will clear all items of that type.
 * @param {Player} player The player to edit.
 * @param {string} itemId The item to remove.
 * @param {number} decrement The amount of the item to remove.
 * @returns {boolean} If items were cleared or not.
 */
export function clearItem(player, itemId, decrement=0, itemName="") { // i think herobrine and ai just writes all of my code for me
    const inventory = player.getComponent("inventory").container;
    if (decrement === 0) {
        let cleared = false
        for (let i = 0; i < inventory.size; i++) {
            let item = inventory.getItem(i);
            if (item?.typeId === itemId) {
                if (itemName && item.nameTag !== itemName) continue;
                inventory.setItem(i);
                cleared = true
            }
        }
        return cleared;
    }
    if (checkItemAmount(player, itemId, false, itemName) < decrement) return false;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (!item || item.typeId !== itemId) continue;
        if (itemName && item.nameTag !== itemName) continue;

        if (item.amount <= decrement) {
            decrement -= item.amount;
            inventory.setItem(i);
        } else {
            item.amount -= decrement;
            inventory.setItem(i, item);
            return true;
        }

        if (decrement === 0) {
            return true;
        }
    }
    return false;
};

/** @param {Player} player */
export const getFreeSlots = (player) => {
    const inventory = player.getComponent("inventory").container
    let slots = 0
    for (let i = 0; i < 36; i++) {
        let item = inventory.getItem(i)
        if (!item) slots++
    }
    return slots
}

export function rollWeightedItem(table, luck = 0) { // god bless gpt
    const adjusted = table.map(e => ({
        item: e.item,
        // rare items (low weight) scale much harder with luck
        weight: e.weight * (1 + luck * 0.15 / e.weight)
    }))

    const totalWeight = adjusted.reduce((sum, e) => sum + e.weight, 0)
    let roll = Math.random() * totalWeight

    for (const entry of adjusted) {
        roll -= entry.weight
        if (roll <= 0) {
            return entry.item()
        }
    }

    // safety fallback
    return adjusted[adjusted.length - 1].item()
}

/** @param {ItemStack} item */
function itemStatReader(item) {
    let stats = {
        luck: 0
    }
    const lore = item.getLore()
    if (lore.length === 0) return
    for (const i of lore) {
        if (i.toLowerCase().includes("luck:")) {
            let clean = i.replace(/§./g, '')
            clean = clean.substring(6)
            stats.luck = Number(clean)
        } else continue
    }
    return stats
}



/*
██    ██     ██████   █████  ███    ██ ███    ██ ███████ ██████      ██    ██ 
██    ██     ██   ██ ██   ██ ████   ██ ████   ██ ██      ██   ██     ██    ██ 
██    ██     ██████  ███████ ██ ██  ██ ██ ██  ██ █████   ██   ██     ██    ██ 
 ██  ██      ██   ██ ██   ██ ██  ██ ██ ██  ██ ██ ██      ██   ██      ██  ██  
  ████       ██████  ██   ██ ██   ████ ██   ████ ███████ ██████        ████   
*/



// im banning boats and minecarts in a function because i have no idea what im doing


world.beforeEvents.playerInteractWithBlock.subscribe(data => {
    if (data.block.typeId === "minecraft:anvil" || data.block.typeId === "minecraft:enchanting_table") return data.cancel = true
})

world.beforeEvents.playerPlaceBlock.subscribe(data => {
    const block = data.block
    const player = data.player
    if (player.getComponent("minecraft:equippable").getEquipment("Mainhand").nameTag === '§r§f') return data.cancel = true
})


/*
██    ██     ███████ ███████ ██████  ██    ██ ███████ ██████      ██    ██ 
██    ██     ██      ██      ██   ██ ██    ██ ██      ██   ██     ██    ██ 
██    ██     ███████ █████   ██████  ██    ██ █████   ██████      ██    ██ 
 ██  ██           ██ ██      ██   ██  ██  ██  ██      ██   ██      ██  ██  
  ████       ███████ ███████ ██   ██   ████   ███████ ██   ██       ████   
*/                                                               
                                                                           
world.afterEvents.worldLoad.subscribe(() => {
    world.gameRules.keepInventory = true
    world.gameRules.doFireTick = false
    world.gameRules.commandBlockOutput = false
    world.gameRules.commandBlocksEnabled = false
    world.gameRules.doDayLightCycle = false
    world.gameRules.doWeatherCycle = false
    world.gameRules.doMobSpawning = false
    world.gameRules.mobGriefing = false
    world.gameRules.locatorBar = false
    world.gameRules.pvp = false
    world.gameRules.showRecipeMessages = false
    world.gameRules.recipesUnlock = false
    world.gameRules.tntExplodes = false
})


const achievements = [ // idk why this list is here tbh
    "How did you mess that up",
    "That's a secret!",
] // achievement idea: "You actually suck", get this by failing the lava thing like 10 times

function achieve(player, name) {
    if (getPlayerDynamicProperty(player, name)) return
    world.sendMessage(`${player.name} has reached the achievement §a[${name}]`)
    player.playSound("random.levelup")
    setPlayerDynamicProperty(player, name, true)

    /*switch (name) { // implement this if you want achievement specific rewards (you prolly do at some point)
        case "How did you mess that up":  {

        }
    }*/
}

/*
system.run(() => {
    setGlobalDynamicProperty("islandPos", {x: 1100, y: 100, z: 1000})
    setGlobalDynamicProperty("playerIDIndex", 1)
})
*/

world.beforeEvents.playerInteractWithEntity.subscribe(data => {
    const player = data.player
    const entity = data.target

    if (entity.nameTag == "Right Click Me!" && entity.typeId == "minecraft:npc") {
        data.cancel = true

        setPlayerDynamicProperty(player, "playerID", getGlobalDynamicProperty("playerIDIndex"))
        setGlobalDynamicProperty("playerIDIndex", 1, true)

        system.run(() => {
            const islandPos = getGlobalDynamicProperty("islandPos")
            if (islandPos.x >= 65000) {
                islandPos.x = 1100
                islandPos.z += 700
            }
        player.runCommand(`tickingarea add ${islandPos.x} ${islandPos.y} ${islandPos.z} ${islandPos.x+65} ${islandPos.y} ${islandPos.z+65} island true`)
        player.teleport({x: islandPos.x+32.5, y: islandPos.y+6, z: islandPos.z+32.5})
        player.setSpawnPoint({x: islandPos.x+32.5, y: islandPos.y+3, z: islandPos.z+32.5, dimension: player.dimension})
        
        system.runTimeout(() => {
            player.runCommand(`structure load island ${islandPos.x} ${islandPos.y} ${islandPos.z}`)
            player.teleport({x: islandPos.x+32.5, y: islandPos.y+6, z: islandPos.z+32.5})
            player.runCommand(`tickingarea remove island`)
            islandPos.x += 500
            setGlobalDynamicProperty("islandPos", islandPos)
        }, 10)

        })
    }
})

system.runInterval(() => {
    world.getPlayers({gameMode: "Survival"}).forEach(player => {
        if (player.location.y < -20) {
            if (player.getSpawnPoint()) {
                player.teleport({x: player.getSpawnPoint().x, y: player.getSpawnPoint().y, z: player.getSpawnPoint().z})
            } else {
                player.teleport({x:100, y:100, z:100})
            }
        }
    })
}, 5)

let fishQueue

world.afterEvents.itemUse.subscribe(data => {
    const player = data.source
    const item = data.itemStack

    const tool = player.getComponent("equippable").getEquipment("Mainhand")
    if (tool) {
        const durability = tool.getComponent("durability")
        if (durability) {
            durability.unbreakable = true
            player.getComponent('inventory').container.setItem(player.selectedSlotIndex, tool)
        }
    }

    switch (item.typeId) {
        case "minecraft:bucket": {
            const block = player.getBlockFromViewDirection({maxDistance:7})?.block
            if (block?.typeId == "minecraft:obsidian") {

                block.dimension.setBlockType(block.location, "minecraft:air")
                clearItem(player, "minecraft:bucket", 1)
                player.getComponent("inventory").container.addItem(new ItemStack("minecraft:lava_bucket"))
                achieve(player, "How did you mess that up")
            }
            return
        } case "minecraft:compass": {
            mainMenu(player)
            return
        } case "minecraft:fishing_rod": {
            fishQueue = player.name
        }
    }
})
/** @param { Player } player */
FishingEvent.playerReleaseFishing.subscribe(data => {
    /** @type {{ player: Player }} */
    const { player, beforeItemStack, attachedToEntity } = data // attached entity is if the bobber grabs an entity
    const { result, fishedItems, location, duration } = data.fishingInfo // duration is in ticks, result is success if item is detected caught, fished items is an array of itemStacks caught
    

    
    if (result !== FishingResult.Success) return

    if (player["fishDebounce"]) return
    player["fishDebounce"] = true

    const rod = beforeItemStack

    let entity
    const entities = player.dimension.getEntities({location: location, maxDistance: 2, type: "minecraft:item"})
    entities.forEach(e => {
        if (e.getComponent("minecraft:item").itemStack.typeId === "minecraft:element_1") entity = e
    })


    let luck = 0
    const stats = itemStatReader(rod)
    let item = items.rawCod

    switch (rod.nameTag) {
        case items.basicRod.nameTag: {
            item = rollWeightedItem(tables.basicRodLootTable, stats.luck)
            break
        }
        case items.inkRod.nameTag: {
            item = rollWeightedItem(tables.inkRodLootTable, stats.luck)
            break
        }
        case items.whaleRod.nameTag: {
            item = rollWeightedItem(tables.whaleRodLootTable, stats.luck)
            break
        }
    }

    switch (item.typeId) {
        case "minecraft:cod": {
            setStat(player, "fishingXP", 25, true)
            break
        }
        case "minecraft:salmon": {
            setStat(player, "fishingXP", 40, true)
            break
        }
        case "minecraft:tropical_fish": {
            setStat(player, "fishingXP", 125, true)
            break
        }
        case "minecraft:cherry_log": {
            setStat(player, "fishingXP", 150, true)
            break
        }
        case "minecraft:ink_sac": {
            setStat(player, "fishingXP", 60, true)
            break
        }
        case "minecraft:copper_ingot": {
            setStat(player, "fishingXP", 400, true)
            break
        }
        case "minecraft:prismarine_shard": {
            setStat(player, "fishingXP", 1250, true)
            break
        }
        case "minecraft:coal": {
            setStat(player, "fishingXP", 250, true)
            break
        }
        case "minecraft:slime_ball": {
            setStat(player, "fishingXP", 90, true)
            break
        }
    }
    checkLevelUp(player, "fishing")

    const velocity = entity.getVelocity()

    const newEntity = entity.dimension.spawnItem(item, entity.location)
    const newVelo = {x: velocity.x*.75, y:velocity.y*.50, z:velocity.z*.75}
    newEntity.applyImpulse(newVelo)
    entity.kill()

    system.runTimeout(() => {
        player["fishDebounce"] = false
    }, 10)
})


world.beforeEvents.entityRemove.subscribe(data => { // it all makes sense now

    try {
        if (data.removedEntity.getComponent("item").itemStack.typeId !== "minecraft:element_1") return
    } catch (e) {
        return
    }

    const entity = data.removedEntity
    const players = entity.dimension.getPlayers({location: data.removedEntity.location, maxDistance: 2})

    players.forEach(player => {
        const inv = player.getComponent("inventory").container

        system.run(() => {
        player.playSound("note.cow_bell")
        player.sendMessage("§c§lUh oh! §r§cYou stood too close to the fishing bobber and scared all the fish away!")
            for (let i = 0; i < 36; i++) {
                if (!(inv.getItem(i)?.typeId == "minecraft:element_1")) continue
                inv.setItem(i, undefined)
            }
        })
    })
})


world.afterEvents.playerBreakBlock.subscribe(data => {
    const player = data.player
    const oldBlock = data.block
    const brokenBlock = data.brokenBlockPermutation

    const tool = player.getComponent("equippable").getEquipment("Mainhand")
    if (!tool) return
    const durability = tool.getComponent("durability")
    if (!durability) return
    durability.unbreakable = true
    player.getComponent('inventory').container.setItem(player.selectedSlotIndex, tool)

    switch (brokenBlock.type.id) {
        case 'minecraft:coal_ore': {
            setStat(player, "miningXP", 140, true)
            break
        }
        case 'minecraft:iron_ore': {
            setStat(player, "miningXP", 1500, true)
            break
        }
        case 'minecraft:granite': {
            setStat(player, "miningXP", 20, true)
            break
        }
        case 'minecraft:diorite': {
            setStat(player, "miningXP", 20, true)
            break
        }
        case 'minecraft:andesite': {
            setStat(player, "miningXP", 20, true)
            break
        }
    }
    checkLevelUp(player, "mining")

    if (brokenBlock.type.id !== 'minecraft:cobblestone') return

    if (!(
        (oldBlock.east(1).typeId === "minecraft:lava" || // im good code
        oldBlock.west(1).typeId === "minecraft:lava" ||
        oldBlock.north(1).typeId === "minecraft:lava" ||
        oldBlock.south(1).typeId === "minecraft:lava") &&
        ((oldBlock.east(1).typeId === "minecraft:water" ||
        oldBlock.west(1).typeId === "minecraft:water" ||
        oldBlock.north(1).typeId === "minecraft:water" ||
        oldBlock.south(1).typeId === "minecraft:water") ||
        (oldBlock.east(1).isWaterlogged ||
        oldBlock.west(1).isWaterlogged ||
        oldBlock.north(1).isWaterlogged ||
        oldBlock.south(1).isWaterlogged))
    )) return

    setStat(player, "miningXP", 15, true)
    checkLevelUp(player, "mining")


    const stats = itemStatReader(tool)

    let newBlock = rollWeightedItem(tables.defaultPickaxeLootTable)
    switch (tool.nameTag) {
        case items.coalPickaxe.nameTag: {
            newBlock = rollWeightedItem(tables.coalPickaxeLootTable, stats.luck)
            break
        }
        case items.densePickaxe.nameTag: {
            newBlock = rollWeightedItem(tables.densePickaxeLootTable, stats.luck)
            break
        }
    }
    
    if (newBlock === "minecraft:air") return
    return player.dimension.setBlockType(oldBlock.location, newBlock)

})

system.runInterval(() => {
    const players = world.getPlayers()
    players.forEach(player => {
        player.onScreenDisplay.setActionBar(
            `Coins: §6${getPlayerDynamicProperty(player, "coins")}
§9discord.gg/HRGNN3pzQN`)
    })
}, 8)
