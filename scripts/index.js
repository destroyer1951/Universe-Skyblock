import { world, system, ItemStack, Player, EntityPushThroughComponent } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from './extensions/forms.js';

import { items, makeItem, rollStars } from './items.js'
import { prices } from './prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from './stats.js'
import * as Menus from './compassGui/mainGui.js'
import { shopMainMenu } from './compassGui/shopGui.js'
import * as tables from './myLootTables.js'
import { showAkuaMenu } from './compassGui/otherGui.js'

const { 
    mainMenu,  
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
    compass.setLore(["", "§r§7Right Click to Open the Main Menu!"])
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
        let levelColor = "§7"
        const level = getPlayerDynamicProperty(data.sender, 'skyblockLevel')
        if (level >= 5) levelColor = "§f"
        if (level >= 10) levelColor = "§a"
        if (level >= 15) levelColor = "§q"
        if (data.message.includes("§")) return data.sender.sendMessage("§cYou cannot use formatting codes in chat messages!")
        world.sendMessage(`§8[${levelColor}${level}§8] §8<§7${data.sender.name}§8> §f${data.message}`)
    }
})

export const xpRequirements = [
    50, // 0 - 1
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
    100000, // 14 - 15
    125000, // 15 - 16
    150000,
    180000,
    220000,
    300000, // 19 - 20
    999999999999999
]

export const levelCoins = [
    100,
    200,
    300,
    500,
    750,
    1500,
    2500,
    5000,
    8500,
    12000,
    17000,
    22500,
    27500,
    32500,
    40000, // 14 - 15
    50000,
    60000,
    70000,
    85000,
    100000, // 19 - 20
    1
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
    "How did you mess that up", // screw up the cobble gen
    "That's a secret!", // use code NAISHO
    "Pristine", // somehow get a 5 star gold chunk
    "Real Steel" // craft your first iron pickaxe
] // achievement idea: "You actually suck", get this by failing the lava thing like 10 times

export function achieve(player, name) {
    if (getPlayerDynamicProperty(player, name)) return
    world.sendMessage(`${player.name} has reached the achievement §a[${name}]`)
    player.playSound("random.levelup")
    setPlayerDynamicProperty(player, name, true)

    switch (name) { // implement this if you want achievement specific rewards (you prolly do at some point)
        case "Real Steel":  {
            setStat(player, "coins", 2000, true)
            return
        }
        case "Pristine": {
            setStat(player, "coins", 10000, true)
            return
        }
    }
}

export function messageDelayed(player, delay, message) {
    system.runTimeout(() => {
        player.sendMessage(message)
    }, delay)
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

    if (entity.typeId === "minecraft:npc") {
        switch (entity.nameTag) {
            case "§r§bAkua": {
                data.cancel = true
                //setPlayerDynamicProperty(player, "akuaQuest1", false)
                if (getPlayerDynamicProperty(player, "akuaQuest1")) {

                    system.run(() => {
                        showAkuaMenu(player)
                    })

                } else {

                    if (!player["chatDebounce"] || player["chatDebounce"] < Date.now()) {
                        player["chatDebounce"] = Date.now() + 16000

                        if (!player["akuaChat"]) {
                            player.sendMessage("§8[§eNPC§8] §8<§bAkua§8>§r What are you doing here? How did you find me??")

                            messageDelayed(player, 60, "§8[§eNPC§8] §8<§bAkua§8>§r Wait.. You aren't with them?")
                            messageDelayed(player, 100, "§8[§eNPC§8] §8<§bAkua§8>§r I guess I can trust you then..")
                            messageDelayed(player, 150, "§8[§eNPC§8] §8<§bAkua§8>§r In that case, I need some stuff from you.")
                            messageDelayed(player, 210, "§8[§eNPC§8] §8<§bAkua§8>§r Please bring me: §e64x Raw Cod§r, §e32x Ink Sac§r, §e2x Prismarine Shard§r, §e4x Iron Ingots§r")
                            messageDelayed(player, 290, "§8[§eNPC§8] §8<§bAkua§8>§r Then we can talk.")

                            system.runTimeout(() => {
                                player["akuaChat"] = true
                            }, 290)

                        } else {
                            system.run(() => {

                                let req1 = checkItemAmount(player, "minecraft:cod")
                                let req2 = checkItemAmount(player, "minecraft:ink_sac")
                                let req3 = checkItemAmount(player, "minecraft:prismarine_shard", false, items.prismarineShard.nameTag)
                                let req4 = checkItemAmount(player, "minecraft:iron_ingot")

                                if (req1 >= 64 && req2 >= 32 && req3 >= 2 && req4 >= 4) {
                                    clearItem(player, "minecraft:cod", 64)
                                    clearItem(player, "minecraft:ink_sac", 32)
                                    clearItem(player, "minecraft:prismarine_shard", 2, items.prismarineShard.nameTag)
                                    clearItem(player, "minecraft:iron_ingot", 4)
                                    
                                    setPlayerDynamicProperty(player, "akuaQuest1", true)
                                    player.sendMessage("§8[§eNPC§8] §8<§bAkua§8>§r That took you long enough. Most other people find all of that stuff easy.")
                                    messageDelayed(player, 80, "§8[§eNPC§8] §8<§bAkua§8>§r Well, I guess I do owe you something.")
                                    messageDelayed(player, 150, "§8[§eNPC§8] §8<§bAkua§8>§r Talk to me again to see what I can offer you.")

                                } else return player.sendMessage("§8[§eNPC§8] §8<§bAkua§8>§r Please bring me: §e64x Raw Cod§r, §e32x Ink Sac§r, §e2x Prismarine Shard§r, §e4x Iron Ingots§r")

                            })
                            player["chatDebounce"] = Date.now() + 2000
                        }
                    }
                }
                return
            }
            case "§3§r§fConstruction Worker": {
                data.cancel = true
                if (!player["chatDebounce"] || player["chatDebounce"] < Date.now()) {
                    player["chatDebounce"] = Date.now() + 4000
                    player.sendMessage("§8[§eNPC§8] §8<§fConstruction Worker§8>§r We still have to work on this area. Not sure what to build here yet.")
                }
                return
            }
            case "§2§r§fConstruction Worker": {
                data.cancel = true
                if (!player["chatDebounce"] || player["chatDebounce"] < Date.now()) {
                    player["chatDebounce"] = Date.now() + 4000
                    player.sendMessage("§8[§eNPC§8] §8<§fConstruction Worker§8>§r Glad I finally got this house built!")
                }
                return
            }
            case "§r§fAmelia": {
                data.cancel = true
                if (!player["chatDebounce"] || player["chatDebounce"] < Date.now()) {
                    player["chatDebounce"] = Date.now() + 4000
                    player.sendMessage("§8[§eNPC§8] §8<§fAmelia§8>§r I'm so glad they were able to build my house first!")
                }
                return
            }
            case "§r§fShopkeeper Apprentice": {
                data.cancel = true
                if (!player["chatDebounce"] || player["chatDebounce"] < Date.now()) {
                    player["chatDebounce"] = Date.now() + 8000
                    player.sendMessage("§8[§eNPC§8] §8<§rShopkeeper Apprentice§8>§r We had to bring this tent because they're still building around here.")

                    system.runTimeout(() => {
                        player.sendMessage("§8[§eNPC§8] §8<§rShopkeeper Apprentice§8>§r For some reason they built that girl's house first..")
                    }, 70)

                    system.runTimeout(() => {
                        player.sendMessage("§8[§eNPC§8] §8<§rShopkeeper Apprentice§8>§r I think one of the workers has a thing for her.")
                    }, 140)
                }
                return
            }
            case "§r§fShopkeeper": {
                data.cancel = true
                system.run(() => {
                    return shopMainMenu(player)
                })
                return
            }
            case "§1§r§fConstruction Worker": {
                data.cancel = true
                if (!player["chatDebounce"] || player["chatDebounce"] < Date.now()) {
                    player["chatDebounce"] = Date.now() + 4000
                    player.sendMessage("§8[§eNPC§8] §8<§fConstruction Worker§8>§r We're still trying to get this portal to work. Come back later or something.")
                }
                return
            }
            case "Right Click Me!": {
                data.cancel = true

                if (player.getSpawnPoint()) return

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
        }
    }
})

system.runInterval(() => {
    world.getPlayers({excludeGameModes: ["Creative", "Spectator"]}).forEach(player => {
        if (player.location.y < -20) {
            if (player.getSpawnPoint()) {
                player.teleport({x: player.getSpawnPoint().x, y: player.getSpawnPoint().y, z: player.getSpawnPoint().z})
            } else {
                player.teleport({x:100, y:100, z:100})
            }
        }
    })
}, 10)

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

    if (item.typeId === "minecraft:candle") {
        player.sendMessage("version 1.4")
    }
})


world.afterEvents.itemCompleteUse.subscribe(data => {
    const item = data.itemStack
    const player = data.source
    if (data.itemStack.typeId !== "minecraft:fishing_rod") return

    player.removeTag("isFished")
    player.addTag("isFished")
    system.runTimeout(() => {
        player.removeTag("isFished")
    }, 2)
})

function rollFishingTable(rod, luck) {
    switch (rod.nameTag) {
        case items.basicRod.nameTag: {
            const item = rollWeightedItem(tables.basicRodLootTable, luck)
            return item
        }
        case items.inkRod.nameTag: {
            const item = rollWeightedItem(tables.inkRodLootTable, luck)
            return item
        }
        case items.whaleRod.nameTag: {
            const item = rollWeightedItem(tables.whaleRodLootTable, luck)
            return item
        }
    }
}

world.afterEvents.entitySpawn.subscribe(data => {
    const entity = data.entity
    try { entity.getComponent("minecraft:item") } catch { return }
    const fishedItem = entity.getComponent("minecraft:item")?.itemStack
    if (!fishedItem) return
    if (fishedItem.typeId !== "minecraft:element_1") return

    const dimension = entity.dimension
    const location = entity.location
    const velocity = entity.getVelocity()
    entity.kill()

    const newVelo = {x: velocity.x*.75, y:velocity.y*.50, z:velocity.z*.75}

    system.runTimeout(() => {
        dimension.getPlayers({location: location, maxDistance: 36, tags: ["isFished"]}).forEach(player => {
            const rod = player.getComponent("equippable").getEquipment("Mainhand")
            if (!rod || rod.typeId !== "minecraft:fishing_rod") return
            
            let luck = 0
            const stats = itemStatReader(rod)
            if (stats.luck) luck += stats.luck
            let item = items.rawCod

            item = rollFishingTable(rod, luck)

            switch (item.typeId) {
                case "minecraft:cod": {
                    setStat(player, "fishingXP", 40, true)
                    break
                }
                case "minecraft:salmon": {
                    setStat(player, "fishingXP", 65, true)
                    break
                }
                case "minecraft:tropical_fish": {
                    setStat(player, "fishingXP", 175, true)
                    break
                }
                case "minecraft:cherry_log": {
                    setStat(player, "fishingXP", 250, true)
                    break
                }
                case "minecraft:ink_sac": {
                    setStat(player, "fishingXP", 75, true)
                    break
                }
                case "minecraft:copper_ingot": {
                    setStat(player, "fishingXP", 500, true)
                    break
                }
                case "minecraft:prismarine_shard": {
                    setStat(player, "fishingXP", 1750, true)
                    break
                }
                case "minecraft:coal": {
                    setStat(player, "fishingXP", 450, true)
                    break
                }
                case "minecraft:slime_ball": {
                    setStat(player, "fishingXP", 150, true)
                    break
                }
            }
            checkLevelUp(player, "fishing")

            const newEntity = dimension.spawnItem(item, location)
            newEntity.applyImpulse(newVelo)

        })
    },1)

})

world.beforeEvents.entityItemPickup.subscribe(data => {
    const typeId = data.item.getComponent("minecraft:item").itemStack.typeId
    const player = data.entity
    if (typeId !== "minecraft:element_1") return

    data.cancel = true

    system.run(()=> {
        data.item.remove()
        if (!(player instanceof Player)) return 
        player.playSound("note.cow_bell")
        player.sendMessage("§c§lUh oh! §r§cYou stood too close to the fishing bobber and scared all the fish away!")
    })
})

function rollPickaxeTable(tool, luck) {
    switch (tool.nameTag) {
        case items.coalPickaxe.nameTag: {
            const newBlock = rollWeightedItem(tables.coalPickaxeLootTable, luck)
            return newBlock
        }
        case items.densePickaxe.nameTag: {
            const newBlock = rollWeightedItem(tables.densePickaxeLootTable, luck)
            return newBlock
        }
        case items.hybridPickaxe.nameTag: {
            const newBlock = rollWeightedItem(tables.hybridPickaxeLootTable, luck)
            return newBlock
        }
        case items.ironPickaxe.nameTag:{
            const newBlock = rollWeightedItem(tables.ironPickaxeLootTable, luck)
            return newBlock
        }
    }
}


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
        case 'minecraft:granite': {
            setStat(player, "miningXP", 25, true)
            break
        }
        case 'minecraft:diorite': {
            setStat(player, "miningXP", 25, true)
            break
        }
        case 'minecraft:andesite': {
            setStat(player, "miningXP", 25, true)
            break
        }
        case 'minecraft:coal_ore': {
            setStat(player, "miningXP", 70, true)
            break
        }
        case 'minecraft:iron_ore': {
            setStat(player, "miningXP", 600, true)
            if (Math.random() < .12) {
                setStat(player, "miningXP", 600, true)
                player.getComponent('inventory').container.addItem(items.ironChunk)
                player.sendMessage("§9§lRARE! §6>> §r§aYou found a §7Iron Chunk§a!")
                player.playSound("armor.equip_gold", {volume: 1, pitch: 1.5})
            }
            break
        }
        case 'minecraft:copper_ore': {
            setStat(player, "miningXP", 300, true)
            if (Math.random() < .12) {
                setStat(player, "miningXP", 300, true)
                player.getComponent('inventory').container.addItem(items.copperChunk)
                player.sendMessage("§9§lRARE! §6>> §r§aYou found a §nCopper Chunk§a!")
                player.playSound("armor.equip_gold", {volume: 1, pitch: 1.5})
            }
            break
        }
        case 'minecraft:gold_ore': {
            setStat(player, "miningXP", 1400, true)
            if (Math.random() < .12) {
                setStat(player, "miningXP", 1400, true)
                const goldChunk = items.goldChunk
                player.getComponent('inventory').container.addItem(goldChunk)

                const chunkLore = goldChunk.getLore()
                const chunkStars = chunkLore[chunkLore.length - 1].match(/\*/g)
                if (chunkStars && chunkStars.length >= 5) achieve(player, "Pristine")       

                player.sendMessage("§9§lRARE! §6>> §r§aYou found a §eGold Chunk§a!")
                player.playSound("armor.equip_gold", {volume: 1, pitch: 1.5})
            }
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

    let luck = 0
    const stats = itemStatReader(tool)
    if (stats?.luck) luck += stats.luck

    let newBlock = rollWeightedItem(tables.defaultPickaxeLootTable)
    newBlock = rollPickaxeTable(tool, luck) || newBlock
    
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

system.runInterval(() => {
    const players = world.getPlayers({excludeGameModes: ["Creative", "Spectator"]})
    players.forEach(player => {
        
        if (!(player["afkTimer"])) {
            player["afkTimer"] = Date.now() + 250000
        }


        const rotation = player["rotation"]
        if (player.getRotation().y === rotation) {

            if (player["afkTimer"] < Date.now()) {
                
                if (player["afk"] > 4) {
                    world.sendMessage(`§c${player.name} was kicked for being AFK!`)
                    player.runCommand(`kick ${player.name} You were kicked for being AFK!`)
                    return
                }

                player.sendMessage("§cYou are about to be kicked for AFK!")
                for (let i = 0; i < 12; i++) {
                    system.runTimeout(() => {
                        player.playSound("fire.ignite", {volume: 1, pitch: .8})
                    }, i*2)
                }
            }


        } else {
            player["afk"] = 0
            player["afkTimer"] = Date.now() + 250000
        }

        player["rotation"] = player.getRotation().y
    })
}, 35)

