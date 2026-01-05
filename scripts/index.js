import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from './extensions/forms.js';


/*
██    ██     ███████ ████████  █████  ████████ ███████     ██    ██ 
██    ██     ██         ██    ██   ██    ██    ██          ██    ██ 
██    ██     ███████    ██    ███████    ██    ███████     ██    ██ 
 ██  ██           ██    ██    ██   ██    ██         ██      ██  ██  
  ████       ███████    ██    ██   ██    ██    ███████       ████   
*/                                                                 


function getPlayerDynamicProperty(player, objective) {
    return world.getDynamicProperty(`${player.name.toLowerCase()}:${objective}`)
}

function setPlayerDynamicProperty(player, objective, value, add = false) {
    add && typeof value === 'number' && world.getDynamicProperty(`${player.name.toLowerCase()}:${objective}`) ? world.setDynamicProperty(`${player.name.toLowerCase()}:${objective}`,  world.getDynamicProperty(`${player.name.toLowerCase()}:${objective}`) + value) : world.setDynamicProperty(`${player.name.toLowerCase()}:${objective}`, value)
}


function getGlobalDynamicProperty(objective) {
    return world.getDynamicProperty(objective)
}

function setGlobalDynamicProperty(objective, value, add = false) {
    add && typeof value === 'number' && world.getDynamicProperty(objective) ? world.setDynamicProperty(objective, world.getDynamicProperty(objective)+value) : world.setDynamicProperty(objective, value)
}

function getScore(target, objective) {
    try {
        if (world.scoreboard.getObjective(objective).getScore(typeof target === 'string' ? target : target.scoreboardIdentity) === undefined) {
            return 0
        } else { return world.scoreboard.getObjective(objective).getScore(typeof target === 'string' ? target : target.scoreboardIdentity) }
    } catch {
        return 0
    }
}

function setScore(target, objective, amount, add = false) {
    const scoreObj = world.scoreboard.getObjective(objective)
    const score = (add ? scoreObj?.getScore(target) ?? 0 : 0) + amount
    scoreObj?.setScore(target, score)
    return score;
}

function setStat(player, stat, amount, add = false) {
    if (typeof amount !== 'number') return
    if (!add) return setPlayerDynamicProperty(player, stat, amount)
    const multiplier = getPlayerDynamicProperty(player, `${stat}Mult`)
    if (!multiplier && multiplier != 0) return setPlayerDynamicProperty(player, stat, amount, true)
    return setPlayerDynamicProperty(player, stat, amount*multiplier, true)
}

world.afterEvents.playerSpawn.subscribe(data => {
    const player = data.player
    
    const compass = new ItemStack("minecraft:compass")
    compass.lockMode = "slot"
    player.getComponent('inventory').container.setItem(8, compass)
    
    if (!data.initialSpawn) return
    player.sendMessage('§cThis world uses Data Storage Basket created by destroyer1951. Any username changes will result in §lpermanent§r§c data loss. You have been warned.')
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
    }
})



/*
  ██    ██         ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████     ██    ██ 
  ██    ██         ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██          ██    ██ 
  ██    ██         █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████     ██    ██ 
   ██  ██          ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██      ██  ██  
    ████           ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████       ████
*/

const checkItemAmount = (player, itemId, clearItems = false, itemName="") => {
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

const checkInvEmpty = (player) => {
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
function clearItem(player, itemId, decrement=0, itemName="") { // i think herobrine and ai just writes all of my code for me
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
const getFreeSlots = (player) => {
    const inventory = player.getComponent("inventory").container
    let slots = 0
    for (let i = 0; i < 36; i++) {
        let item = inventory.getItem(i)
        if (!item) slots++
    }
    return slots
}

function rollWeightedItem(table) {
    const totalWeight = table.reduce((sum, e) => sum + e.weight, 0)
    let roll = Math.random() * totalWeight

    for (const entry of table) {
        roll -= entry.weight
        if (roll <= 0) {
            return typeof entry.item === "function"
                ? entry.item()
                : entry.item
        }
    }
}


/*
██    ██     ██ ████████ ███████ ███    ███ ███████     ██    ██ 
██    ██     ██    ██    ██      ████  ████ ██          ██    ██ 
██    ██     ██    ██    █████   ██ ████ ██ ███████     ██    ██ 
 ██  ██      ██    ██    ██      ██  ██  ██      ██      ██  ██  
  ████       ██    ██    ███████ ██      ██ ███████       ████   
*/                                                        
                                                                 

function makeItem(typeId, configure) { // i wrote this code and i dont even understand it anymore am i the best developer of all time
  const item = new ItemStack(typeId)
  configure(item)
  return item
}

function rollStars(maxStars=5) {
    let stars = 1
    let starString = "§l"

    for (let i = 2; i <= maxStars; i++) {
        if (Math.random() < 1 / i) {
            stars++
        } else {
            break
        }
  }

    for (let i = stars; i > 0; i--) {
        starString += "* "
    }

    return starString.trim()
}

const items = {}
system.run(() => {
    // General shop items
    items.lavaBucket = makeItem("minecraft:lava_bucket", item => {
        item.nameTag = "§r§fLava Bucket"
    })
    items.ice = makeItem("minecraft:ice", item => {
        item.nameTag = "§r§fIce"
    })
    items.oakLog = makeItem("minecraft:oak_log", item => {
        item.nameTag = "§r§fOak Log"
    })
    items.grassBlock = makeItem("minecraft:grass_block", item => {
    item.nameTag = "§r§fGrass Block"
    })
    items.dirt = makeItem("minecraft:dirt", item => {
        item.nameTag = "§r§fDirt"
    })
    items.cobblestone = makeItem("minecraft:cobblestone", item => {
        item.nameTag = "§r§fCobblestone"
    })
    items.sand = makeItem("minecraft:sand", item => {
        item.nameTag = "§r§fSand"
    })
    items.boneMeal = makeItem("minecraft:bone_meal", item => {
        item.nameTag = "§r§fBone Meal"
    })
    items.charcoal = makeItem("minecraft:charcoal", item => {
        item.nameTag = "§r§fCharcoal"
    })
    items.oakSapling = makeItem("minecraft:oak_sapling", item => {
        item.nameTag = "§r§fOak Sapling"
    })
    items.darkOakSapling = makeItem("minecraft:dark_oak_sapling", item => {
        item.nameTag = "§r§fDark Oak Sapling"
    })
    items.darkOakLog = makeItem("minecraft:dark_oak_log", item => {
        item.nameTag = "§r§fDark Oak Log"
    })
    items.birchSapling = makeItem("minecraft:birch_sapling", item => {
        item.nameTag = "§r§fBirch Sapling"
    })
    items.birchLog = makeItem("minecraft:birch_log", item => {
        item.nameTag = "§r§fBirch Log"
    })
    items.coal = makeItem("minecraft:coal", item => {
        item.nameTag = "§r§fCoal"
    })
    items.copperIngot = makeItem("minecraft:copper_ingot", item => {
        item.nameTag = "§r§fCopper Ingot"
    })
    items.ironIngot = makeItem("minecraft:iron_ingot", item => {
        item.nameTag = "§r§fIron Ingot"
    })
    items.goldIngot = makeItem("minecraft:gold_ingot", item => {
        item.nameTag = "§r§fGold Ingot"
    })
    items.diamond = makeItem("minecraft:diamond", item => {
        item.nameTag = "§r§fDiamond"
    })
    items.quartzCrystal = makeItem("minecraft:quartz", item => {
        item.nameTag = "§r§fQuartz Crystal"
        item.setLore(["", "§r§8Both exceptionally shiny", "§r§8and exceptionally sharp", "", `§r§e${rollStars()}`])
    })

    Object.defineProperty(items, "padparadscha", {
        get() {
            return makeItem("minecraft:resin_brick", item => {
                item.nameTag = "§r§fPadparadscha"
                item.setLore(["", "§r§8A powerful gemstone,", "§r§8in difficulty and durability", "", `§r§e${rollStars()}`])
            })
        }
    })

    // Farm shop items

    items.wheat = makeItem("minecraft:wheat", item => {
        item.nameTag = "§r§fWheat"
    })
    items.wheatSeeds = makeItem("minecraft:wheat_seeds", item => {
        item.nameTag = "§r§fWheat Seeds"
    })
    items.potato = makeItem("minecraft:potato", item => {
        item.nameTag = "§r§fPotato"
    })
    items.sugarCane = makeItem("minecraft:sugar_cane", item => {
        item.nameTag = "§r§fSugar Cane"
    })

    // Fishing shop items

    Object.defineProperty(items, "basicRod", {
        get() {
            return makeItem("minecraft:fishing_rod", item => {
                item.nameTag = "§r§fBasic Fishing Rod"
                item.setLore(["", "§r§8It's not much but", "it gets the job done", '', `§r§e${rollStars()}`])
            })
        }
    })

    items.rawCod = makeItem("minecraft:cod", item => {
        item.nameTag = "§r§fRaw Cod"
    })
    items.rawSalmon = makeItem("minecraft:salmon", item => {
        item.nameTag = "§r§fRaw Salmon"
    })
    items.tropicalFish = makeItem("minecraft:tropical_fish", item => {
        item.nameTag = "§r§fTropical Fish"
    })
    items.inkSac = makeItem("minecraft:ink_sac", item => {
        item.nameTag = "§r§fInk Sac"
    })
    items.cherrySapling = makeItem("minecraft:cherry_sapling", item => {
        item.nameTag = "§r§fCherry Sapling"
    })
    items.cherryLog = makeItem("minecraft:cherry_log", item => {
        item.nameTag = "§r§fCherry Log"
    })

    Object.defineProperty(items, "prismarineShard", {
        get() {
            return makeItem("minecraft:prismarine_shard", item => {
                item.nameTag = "§r§fPrismarine Shard"
                item.setLore([`§r§e${rollStars()}`])
            })
        }
    })

})

const prices = {buy: {}, sell: {}}

// General Shop Items

prices.buy.lavaBucket = 1000
prices.sell.lavaBucket = 100

prices.buy.ice = 200
prices.sell.ice = 10

prices.buy.grassBlock = 1250
prices.sell.grassBlock = 10

prices.buy.dirt = 1000
prices.sell.dirt = 50

prices.buy.cobblestone = 15
prices.sell.cobblestone = 1

prices.buy.sand = 850
prices.sell.sand = 10

prices.buy.boneMeal = 100
prices.sell.boneMeal = 10

prices.buy.charcoal = 100
prices.sell.charcoal = 12

prices.buy.oakSapling = 1000
prices.sell.oakSapling = 5

prices.buy.oakLog = 200
prices.sell.oakLog = 10

prices.buy.darkOakSapling = 2500
prices.sell.darkOakSapling = 5

prices.buy.darkOakLog = 200
prices.sell.darkOakLog = 8

prices.buy.birchSapling = 1750
prices.sell.birchSapling = 10

prices.buy.birchLog = 200
prices.sell.birchLog = 10

prices.buy.coal = 100
prices.sell.coal = 12

prices.buy.copperIngot = 3000
prices.sell.copperIngot = 20

prices.buy.ironIngot = 10000
prices.sell.ironIngot = 35

prices.buy.goldIngot = 25000
prices.sell.goldIngot = 50

prices.buy.diamond = "§cN/A"
prices.sell.diamond = 1

prices.buy.quartzCrystal = "§cN/A"
prices.sell.quartzCrystal = 1

prices.buy.padparadscha = "§cN/A"
prices.sell.padparadscha = 1

// Farm shop items

prices.buy.wheat = 50
prices.sell.wheat = 6

prices.buy.wheatSeeds = 500
prices.sell.wheatSeeds = 1

prices.buy.potato = 1000
prices.sell.potato = 3

prices.buy.sugarCane = 5000
prices.sell.sugarCane = 5

// Fishing shop items

prices.buy.basicRod = 250
prices.sell.basicRod = 0

prices.buy.rawCod = 50
prices.sell.rawCod = 10

prices.buy.rawSalmon = 50
prices.sell.rawSalmon = 12

prices.buy.tropicalFish = 100
prices.sell.tropicalFish = 20

prices.buy.inkSac = 100
prices.sell.inkSac = 45

prices.buy.cherrySapling = "§cN/A"
prices.sell.cherrySapling = 10

prices.buy.cherryLog = "§cN/A"
prices.sell.cherryLog = 12

prices.buy.prismarineShard = "§cN/A"
prices.sell.prismarineShard = 500




/*
    ██    ██          ██████  ██    ██ ██ ███████         ██    ██ 
    ██    ██         ██       ██    ██ ██ ██              ██    ██ 
    ██    ██         ██   ███ ██    ██ ██ ███████         ██    ██ 
     ██  ██          ██    ██ ██    ██ ██      ██          ██  ██  
      ████            ██████   ██████  ██ ███████           ████   
*/

/** @param {Player} player  */
function mainMenu(player) {
	new ChestFormData("27")
		.title('Skyblock Menu')
        .button(12, 'Codes', ['', '§7Redeem Codes for Rewards!'], 'minecraft:name_tag', 1)
		.button(13, 'Your Island', ['', '§7Warp to your Island!'], 'minecraft:compass', 1)
        .button(14, 'Shop', ['', '§7Buy and Sell some Items!'], 'minecraft:gold_ingot', 1)

		.show(player).then(a => {
			if (a.canceled) return;
			switch (a.selection) {
                case 12: {
                    return codesMenu(player)
                }
                case 13: {
                    player.teleport(player.getSpawnPoint())
                    return player.sendMessage("§eWarped to your Island")
                }
                case 14: {
                    return shopMainMenu(player)
                }
            }
		})
};


/** @param {Player} player  */
function codesMenu(player) {
    new ModalFormData()
    .title('Codes')
    .label("Join §9discord.gg/HRGNN3pzQN§r to redeem the discord kit, as well as information on the latest codes and updates!!\n\n")
    .textField('Enter Code Here', 'Code')
    .show(player).then(a => {
        if (a.canceled) return;
        const code = a.formValues[0]

        switch (code) {
            case 'UNIVERSESKYBLOCK2026': {
                if (getPlayerDynamicProperty(player, 'UNIVERSESKYBLOCK2026')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, coins, 750, true)
                player.getComponent("inventory").container.addItem(new ItemStack("minecraft:iron_ingot", 6))
            }
            case 'HACKER': {
                if (getPlayerDynamicProperty(player, 'HACKER')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, coins, 500, true)
            }
        }

    })
}

/** @param {Player} player  */
function shopMainMenu(player) {
    new ChestFormData("27")
    .title('Shop Menu')
    .button(11, "Cooking Shop", ["", "§l§5COMING SOON"], 'minecraft:painting')
    .button(12, 'Fishing Shop', ['', '§7Someone has to throw the rod'], 'minecraft:fishing_rod', 1)
    .button(13, 'General Shop', ['', '§7Basic Skyblock Necessities'], 'minecraft:lava_bucket', 1)
    .button(14, 'Farming Shop', ['', '§7Put on your Straw Hats'], 'minecraft:wheat', 1)
    .button(15, 'Building Shop', ['', '§7Brick by Brick'], 'minecraft:brick_block', 1)
    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 11: {
                return
            }
            case 12: {
                return fishingShopMenu(player)
            }
            case 13: {
                return generalShopMenu(player)
            }
            case 14: {
                return farmShopMenu(player)
            }
            case 15: {
                return
            }
        }
    })
}

/** @param {Player} player  */
function generalShopMenu(player) {
    new ChestFormData("54")
    .title('Shop Menu')

    .button(10, 'Lava Bucket', ["", `§7Buy Price:§6 ${prices.buy.lavaBucket}`, `§7Sell Price:§6 ${prices.sell.lavaBucket}`], 'minecraft:lava_bucket', 1)
    .button(11, 'Ice', ["", `§7Buy Price:§6 ${prices.buy.ice}`, `§7Sell Price:§6 ${prices.sell.ice}`], 'minecraft:ice', 1)
    .button(12, 'Grass Block', ["", `§7Buy Price:§6 ${prices.buy.grassBlock}`, `§7Sell Price:§6 ${prices.sell.grassBlock}`], 'minecraft:grass_block', 1)
    .button(13, 'Dirt', ["", `§7Buy Price:§6 ${prices.buy.dirt}`, `§7Sell Price:§6 ${prices.sell.dirt}`], 'minecraft:dirt', 1)
    .button(14, 'Cobblestone', ["", `§7Buy Price:§6 ${prices.buy.cobblestone}`, `§7Sell Price:§6 ${prices.sell.cobblestone}`], 'minecraft:cobblestone', 1)
    .button(15, 'Sand', ["", `§7Buy Price:§6 ${prices.buy.sand}`, `§7Sell Price:§6 ${prices.sell.sand}`], 'minecraft:sand', 1)
    .button(16, 'Bone Meal', ["", `§7Buy Price:§6 ${prices.buy.boneMeal}`, `§7Sell Price:§6 ${prices.sell.boneMeal}`], 'minecraft:bone_meal', 1)

    .button(19, 'Charcoal', ["", `§7Buy Price:§6 ${prices.buy.charcoal}`, `§7Sell Price:§6 ${prices.sell.charcoal}`], 'minecraft:charcoal', 1)
    .button(20, 'Oak Sapling', ["", `§7Buy Price:§6 ${prices.buy.oakSapling}`, `§7Sell Price:§6 ${prices.sell.oakSapling}`], 'minecraft:oak_sapling', 1)
    .button(21, 'Oak Log', ["", `§7Buy Price:§6 ${prices.buy.oakLog}`, `§7Sell Price:§6 ${prices.sell.oakLog}`], 'minecraft:oak_log', 1)
    .button(22, 'Dark Oak Sapling', ["", `§7Buy Price:§6 ${prices.buy.darkOakSapling}`, `§7Sell Price:§6 ${prices.sell.darkOakSapling}`], 'minecraft:dark_oak_sapling', 1)
    .button(23, 'Dark Oak Log', ["", `§7Buy Price:§6 ${prices.buy.darkOakLog}`, `§7Sell Price:§6 ${prices.sell.darkOakLog}`], 'minecraft:dark_oak_log', 1)
    .button(24, 'Birch Sapling', ["", `§7Buy Price:§6 ${prices.buy.birchSapling}`, `§7Sell Price:§6 ${prices.sell.birchSapling}`], 'minecraft:birch_sapling', 1)
    .button(25, 'Birch Log', ["", `§7Buy Price:§6 ${prices.buy.birchLog}`, `§7Sell Price:§6 ${prices.sell.birchLog}`], 'minecraft:birch_log', 1)

    .button(28, 'Coal', ["", `§7Buy Price:§6 ${prices.buy.coal}`, `§7Sell Price:§6 ${prices.sell.coal}`], 'minecraft:coal', 1)
    .button(29, 'Copper Ingot', ["", `§7Buy Price:§6 ${prices.buy.copperIngot}`, `§7Sell Price:§6 ${prices.sell.copperIngot}`], 'minecraft:copper_ingot', 1)
    .button(30, 'Iron Ingot', ["", `§7Buy Price:§6 ${prices.buy.ironIngot}`, `§7Sell Price:§6 ${prices.sell.ironIngot}`], 'minecraft:iron_ingot', 1)
    .button(31, 'Gold Ingot', ["", `§7Buy Price:§6 ${prices.buy.goldIngot}`, `§7Sell Price:§6 ${prices.sell.goldIngot}`], 'minecraft:gold_ingot', 1)
    .button(32, 'Diamond', ["", "§7Buy Price:§c N/A", `§7Sell Price:§6 ${prices.sell.diamond}`], 'minecraft:diamond', 1)
    .button(33, 'Quartz Crystal', ["", "§7Buy Price:§c N/A", `§7Sell Price:§6 ${prices.sell.quartzCrystal}`], 'minecraft:quartz', 1)
    .button(34, 'Padparadscha', ["", "§7Buy Price:§c N/A", `§7Sell Price:§6 ${prices.sell.padparadscha}`], 'minecraft:resin_brick', 1)

    /*
    .button(37, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(38, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(39, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(40, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(41, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(42, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(43, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    */
    

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: {
                return buyUnstackablePreviewMenu(player, prices.buy.lavaBucket, prices.sell.lavaBucket, items.lavaBucket)
            }
            case 11: {
                return buyPreviewMenu(player, prices.buy.ice, prices.sell.ice, items.ice)
            }
            case 12: {
                return buyPreviewMenu(player, prices.buy.grassBlock, prices.sell.grassBlock, items.grassBlock)
            }
            case 13: {
                return buyPreviewMenu(player, prices.buy.dirt, prices.sell.dirt, items.dirt)
            }
            case 14: {
                return buyPreviewMenu(player, prices.buy.cobblestone, prices.sell.cobblestone, items.cobblestone)
            }
            case 15: {
                return buyPreviewMenu(player, prices.buy.sand, prices.sell.sand, items.sand)
            }
            case 16: {
                return buyPreviewMenu(player, prices.buy.boneMeal, prices.sell.boneMeal, items.boneMeal)
            }
            case 19: {
                return buyPreviewMenu(player, prices.buy.charcoal, prices.sell.charcoal, items.charcoal)
            }
            case 20: {
                return buyPreviewMenu(player, prices.buy.oakSapling, prices.sell.oakSapling, items.oakSapling)
            }
            case 21: {
                return buyPreviewMenu(player, prices.buy.oakLog, prices.sell.oakLog, items.oakLog)
            }
            case 22: {
                return buyPreviewMenu(player, prices.buy.darkOakSapling, prices.sell.darkOakSapling, items.darkOakSapling)
            }
            case 23: {
                return buyPreviewMenu(player, prices.buy.darkOakLog, prices.sell.darkOakLog, items.darkOakLog)
            }
            case 24: {
                return buyPreviewMenu(player, prices.buy.birchSapling, prices.sell.birchSapling, items.birchSapling)
            }
            case 25: {
                return buyPreviewMenu(player, prices.buy.birchLog, prices.sell.birchLog, items.birchLog)
            }
            case 28: {
                return buyPreviewMenu(player, prices.buy.coal, prices.sell.coal, items.coal)
            }
            case 29: {
                return buyPreviewMenu(player, prices.buy.copperIngot, prices.sell.copperIngot, items.copperIngot)
            }
            case 30: {
                return buyPreviewMenu(player, prices.buy.ironIngot, prices.sell.ironIngot, items.ironIngot)
            }
            case 31: {
                return buyPreviewMenu(player, prices.buy.goldIngot, prices.sell.goldIngot, items.goldIngot)
            }
            case 32: {
                return buyNamedUnavailablePreviewMenu(player, prices.sell.diamond, items.diamond) 
            }
            case 33: {
                return buyNamedUnavailablePreviewMenu(player, prices.sell.quartzCrystal, items.quartzCrystal) 
            }
            case 34: {
                return buyNamedUnavailablePreviewMenu(player, prices.sell.padparadscha, items.padparadscha) 
            }
        }
    })
}

/** @param {Player} player  */
function farmShopMenu(player) {
    new ChestFormData("54")
    .title('Shop Menu')

    .button(10, 'Wheat', ["", `§7Buy Price:§6 ${prices.buy.wheat}`, `§7Sell Price:§6 ${prices.sell.wheat}`], 'minecraft:wheat', 1)
    .button(11, 'Wheat Seeds', ["", `§7Buy Price:§6 ${prices.buy.wheatSeeds}`, `§7Sell Price:§6 ${prices.sell.wheatSeeds}`], 'minecraft:wheat_seeds', 1)
    .button(12, 'Potato', ["", `§7Buy Price:§6 ${prices.buy.potato}`, `§7Sell Price:§6 ${prices.sell.potato}`], 'minecraft:potato', 1)
    .button(13, 'Sugar Cane', ["", `§7Buy Price:§6 ${prices.buy.sugarCane}`, `§7Sell Price:§6 ${prices.sell.sugarCane}`], 'minecraft:sugar_cane', 1)
    .button(14, 'Bone Meal', ["", `§7Buy Price:§6 ${prices.buy.boneMeal}`, `§7Sell Price:§6 ${prices.sell.boneMeal}`], 'minecraft:bone_meal', 1)

    

    /*
    .button(37, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(38, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(39, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(40, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(41, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(42, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(43, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    */
    

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: {
                return buyPreviewMenu(player, prices.buy.wheat, prices.sell.wheat, items.wheat)
            }
            case 11: {
                return buyPreviewMenu(player, prices.buy.wheatSeeds, prices.sell.wheatSeeds, items.wheatSeeds)
            }
            case 12: {
                return buyPreviewMenu(player, prices.buy.potato, prices.sell.potato, items.potato)
            }
            case 13: {
                return buyPreviewMenu(player, prices.buy.sugarCane, prices.sell.sugarCane, items.sugarCane)
            }
            case 14: {
                return buyPreviewMenu(player, prices.buy.boneMeal, prices.sell.boneMeal, items.boneMeal)
            }
        }
    })
}

function fishingShopMenu(player) {
    new ChestFormData("54")
    .title('Shop Menu')

    .button(10, 'Basic Fishing Rod', ["", `§7Buy Price:§6 ${prices.buy.basicRod}`, `§7Sell Price:§6 ${prices.sell.basicRod}`], 'minecraft:fishing_rod', 1)
    .button(11, 'Raw Cod', ["", `§7Buy Price:§6 ${prices.buy.rawCod}`, `§7Sell Price:§6 ${prices.sell.rawCod}`], 'minecraft:cod', 1)
    .button(12, 'Raw Salmon', ["", `§7Buy Price:§6 ${prices.buy.rawSalmon}`, `§7Sell Price:§6 ${prices.sell.rawSalmon}`], 'minecraft:salmon', 1)
    .button(13, 'Tropical Fish', ["", `§7Buy Price:§6 ${prices.buy.tropicalFish}`, `§7Sell Price:§6 ${prices.sell.tropicalFish}`], 'minecraft:tropical_fish', 1)
    .button(14, 'Ink Sac', ["", `§7Buy Price:§6 ${prices.buy.inkSac}`, `§7Sell Price:§6 ${prices.sell.inkSac}`], 'minecraft:ink_sac', 1)
    .button(15, 'Cherry Sapling', ["", `§7Buy Price:§6 ${prices.buy.cherrySapling}`, `§7Sell Price:§6 ${prices.sell.cherrySapling}`], 'minecraft:cherry_sapling', 1)
    .button(16, 'Cherry Log', ["", `§7Buy Price:§6 ${prices.buy.cherryLog}`, `§7Sell Price:§6 ${prices.sell.cherryLog}`], 'minecraft:cherry_log', 1)
    .button(19, 'Prismarine Shard', ["", `§7Buy Price:§6 ${prices.buy.prismarineShard}`, `§7Sell Price:§6 ${prices.sell.prismarineShard}`], 'minecraft:prismarine_shard', 1)

    

    /*
    .button(37, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(38, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(39, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(40, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(41, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(42, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    .button(43, '', ["", "§7Buy Price:§6 1", "§7Sell Price:§6 1"], 'minecraft:', 1)
    */
    

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: {
                return buyPreviewMenu(player, prices.buy.basicRod, prices.sell.basicRod, items.basicRod)
            }
            case 11: {
                return buyPreviewMenu(player, prices.buy.rawCod, prices.sell.rawCod, items.rawCod)
            }
            case 12: {
                return buyPreviewMenu(player, prices.buy.rawSalmon, prices.sell.rawSalmon, items.rawSalmon)
            }
            case 13: {
                return buyPreviewMenu(player, prices.buy.tropicalFish, prices.sell.tropicalFish, items.tropicalFish)
            }
            case 14: {
                return buyPreviewMenu(player, prices.buy.inkSac, prices.sell.inkSac, items.inkSac)
            }
            case 15: {
                return buyUnavailablePreviewMenu(player, prices.sell.cherrySapling, items.cherrySapling)
            }
            case 16: {
                return buyUnavailablePreviewMenu(player, prices.sell.cherryLog, items.cherryLog)
            }
            case 19: {
                return buyUnavailablePreviewMenu(player, prices.sell.prismarineShard, items.prismarineShard)
            }
        }
    })
}

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
function buyPreviewMenu(player, buyPrice, sellPrice, item) {
    const freeSlots = getFreeSlots(player)
    if (freeSlots == 0) return player.sendMessage("§cYou need free inventory space for this!")
    let cleanName = item.nameTag.replace(/§./g, "")
    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, 'Buy Custom', [`§8${cleanName}`, "", `§7Per item price: §6${buyPrice}`], "minecraft:red_dye", 1)
    
    .button(13, `${item.nameTag}`, item.getLore(), item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice) return cantBuyOneMenu(player)
                
                setPlayerDynamicProperty(player, "coins", -buyPrice, true)
                item.amount = 1
                player.getComponent("inventory").container.addItem(item)
                player.playSound("random.orb")
                player.sendMessage(`§aYou purchased §ex1 ${item.nameTag}§a for §6${buyPrice} coins`)
                return buyPreviewMenu(player, buyPrice, sellPrice, item)

            } case 11: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice*2) return cantBuyMultipleMenu(player)
                return buyCustomMenu(player, buyPrice, item)
            } case 15: {
                
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 ${item.nameTag}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)

            } case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

function buyUnavailablePreviewMenu(player, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")
    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    .button(11, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    
    .button(13, `${item.nameTag}`, item.getLore(), item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                return buyUnavailablePreviewMenu(player, sellPrice, item)
            } 
            case 11: {
                return buyUnavailablePreviewMenu(player, sellPrice, item)
            }
            case 15: {
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 ${item.nameTag}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)
            } 
            case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

function buyNamedUnavailablePreviewMenu(player, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")
    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    .button(11, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    
    .button(13, `${item.nameTag}`, item.getLore(), item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                return buyNamedUnavailablePreviewMenu(player, sellPrice, item)
            } 
            case 11: {
                return buyNamedUnavailablePreviewMenu(player, sellPrice, item)
            }
            case 15: {
                if (checkItemAmount(player, item.typeId, false, item.nameTag) >= 1) {
                    clearItem(player, item.typeId, 1, item.nameTag)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 ${item.nameTag}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)
            } 
            case 16: {
                if (checkItemAmount(player, item.typeId, false, item.nameTag) < 1) return cantSellMenu(player)
                return sellNamedCustomMenu(player, sellPrice, item)
            }
        }
    })
}


function buyUnstackablePreviewMenu(player, buyPrice, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "") 
    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, '§dThis item is unstackable!', [`§8${cleanName}`, "", "§7You cannot buy multiple", "§7of this item!"], "minecraft:barrier", 1)
    
    .button(13, `${item.nameTag}`, item.getLore(), item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice) return cantBuyOneMenu(player)

                setPlayerDynamicProperty(player, "coins", -buyPrice, true)
                item.amount = 1
                player.getComponent("inventory").container.addItem(item)
                player.playSound("random.orb")
                player.sendMessage(`§aYou purchased §ex1 ${item.nameTag}§a for §6${buyPrice} coins`)
                return buyUnstackablePreviewMenu(player, buyPrice, sellPrice, item)

            } case 11: {
                return buyUnstackablePreviewMenu(player, buyPrice, sellPrice, item)
            }
            case 15: {
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 ${item.nameTag}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)
            }
            case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
function buyCustomMenu(player, buyPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")
    let maxBuyable = Math.floor(getPlayerDynamicProperty(player, "coins")/buyPrice)
    if (maxBuyable > 2304) maxBuyable = 2304
    const freeSlots = getFreeSlots(player)
    let index = 0

    const form = new ModalFormData()
    .title(`§8${cleanName}`)
    if (maxBuyable > freeSlots*64)  {
        maxBuyable = freeSlots*64
        form.label("\n§cYour maximum purchaseable is limited by your inventory space!\n\nFree up inventory slots to buy more items!")
        index = 1
    }
    form.slider("Amount to buy", 1, maxBuyable, {defaultValue: 1, valueStep: 1})

    form.show(player).then(a => {
        if (a.canceled) return;

        setPlayerDynamicProperty(player, "coins", -(buyPrice*a.formValues[index]), true)
        let amountLeft = a.formValues[index]

        while (amountLeft > 0) {
            if (amountLeft >= 64) {
                item.amount = 64
                player.getComponent("inventory").container.addItem(item)
                amountLeft -= 64
                continue
            } else {
                item.amount = amountLeft
                player.getComponent("inventory").container.addItem(item)
                amountLeft = 0
                break
            }
        }
        item.amount = 1
        player.playSound("random.orb")
        return player.sendMessage(`§aYou purchased §ex${a.formValues[index]} ${item.nameTag}§a for §6${buyPrice*a.formValues[index]} coins`)
    })
}

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
function sellCustomMenu(player, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")
    let maxSellable = checkItemAmount(player, item.typeId)

    const form = new ModalFormData()
    .title(`§8${cleanName}`)
    .slider("Amount to sell", 1, maxSellable, {defaultValue: 1, valueStep: 1})

    .show(player).then(a => {
        if (a.canceled) return;

        clearItem(player, item.typeId, a.formValues[0])
        setPlayerDynamicProperty(player, "coins", (sellPrice*a.formValues[0]), true)

        player.playSound("random.orb")
        return player.sendMessage(`§aYou sold §ex${a.formValues[0]} ${item.nameTag}§a for §6${sellPrice*a.formValues[0]} coins`)
    })
}

function sellNamedCustomMenu(player, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")
    let maxSellable = checkItemAmount(player, item.typeId, false, item.nameTag)

    const form = new ModalFormData()
    .title(`§8${cleanName}`)
    .slider("Amount to sell", 1, maxSellable, {defaultValue: 1, valueStep: 1})

    .show(player).then(a => {
        if (a.canceled) return;

        clearItem(player, item.typeId, a.formValues[0], item.nameTag)
        setPlayerDynamicProperty(player, "coins", (sellPrice*a.formValues[0]), true)

        player.playSound("random.orb")
        return player.sendMessage(`§aYou sold §ex${a.formValues[0]} ${item.nameTag}§a for §6${sellPrice*a.formValues[0]} coins`)
    })
}

function cantBuyOneMenu(player) {
    new ChestFormData("27")
    .title(`Insufficient Funds!`)
    .button(13, "§cInsufficient Funds!", ["", "§7You can't afford", "§7to purchase this!"], "minecraft:hopper")
    .show(player).then(a => {
        return shopMainMenu(player)
    })
}

function cantBuyMultipleMenu(player) {
    new ChestFormData("27")
    .title(`Insufficient Funds!`)
    .button(13, "§cInsufficient Funds!", ["", "§7You can't afford to", "§7purchase multiple of this!"], "minecraft:hopper")
    .show(player).then(a => {
        return shopMainMenu(player)
    })
}
function cantSellMenu(player) {
    new ChestFormData("27")
    .title(`Insufficient Funds!`)
    .button(13, "§cInsufficient Funds!", ["", "§7You can't afford to", "§7sell this!"], "minecraft:hopper")
    .show(player).then(a => {
        return shopMainMenu(player)
    })
}


/*
██    ██     ██████   █████  ███    ██ ███    ██ ███████ ██████      ██    ██ 
██    ██     ██   ██ ██   ██ ████   ██ ████   ██ ██      ██   ██     ██    ██ 
██    ██     ██████  ███████ ██ ██  ██ ██ ██  ██ █████   ██   ██     ██    ██ 
 ██  ██      ██   ██ ██   ██ ██  ██ ██ ██  ██ ██ ██      ██   ██      ██  ██  
  ████       ██████  ██   ██ ██   ████ ██   ████ ███████ ██████        ████   
*/



// ban boats, minecarts, nether portals, obsidian, anvil,  more coming soon
// restrict crafting recipes like anvil, enchantment table, higher level tools like iron and diamond


/*
██    ██     ███████ ███████ ██████  ██    ██ ███████ ██████      ██    ██ 
██    ██     ██      ██      ██   ██ ██    ██ ██      ██   ██     ██    ██ 
██    ██     ███████ █████   ██████  ██    ██ █████   ██████      ██    ██ 
 ██  ██           ██ ██      ██   ██  ██  ██  ██      ██   ██      ██  ██  
  ████       ███████ ███████ ██   ██   ████   ███████ ██   ██       ████   
*/                                                               
                                                                           



const achievements = [ // idk why this list is here tbh
    "How did you mess that up",
] // achievement idea: "You actually suck", get this by failing the lava thing like 10 times

function achieve(player, name) {
    switch (name) {
        case "How did you mess that up":  {
            if (getPlayerDynamicProperty(player, name)) return
                world.sendMessage(`${player.name} has reached the achievement §a[${name}]`)
                player.playSound("random.levelup")
                setPlayerDynamicProperty(player, name, true)
                return
        }
    }
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
    if (entity.nameTag == "Right Click Me!") {
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
            setGlobalDynamicProperty("islandPos", islandPos)
            player.teleport({x: islandPos.x+32.5, y: islandPos.y+6, z: islandPos.z+32.5})
            player.runCommand(`tickingarea remove island`)
            islandPos.x += 700
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

world.afterEvents.itemUse.subscribe(data => {
    const player = data.source
    const item = data.itemStack

    switch (item.typeId) {
        case "minecraft:bucket": {
            const block = player.getBlockFromViewDirection({maxDistance:7}).block
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
        }
    }
})

const fishingLootTable = [
    { item: items.rawCod, weight: 50 },
    { item: items.rawSalmon, weight: 30 },
    { item: items.tropicalFish, weight: 15 },
    { item: items.cherrySapling, weight: 4 },
    { item: items.copperIngot, weight: 1 },
    { item: items.prismarineShard, weight: 0.2 },
]

world.afterEvents.entitySpawn.subscribe(data => {
    try {
        if (!(data.entity.getComponent("item")?.itemStack?.typeId === "minecraft:element_1")) return;
    } catch (e) {
        return
    }
    const entity = data.entity
    const velocity = data.entity.getVelocity()

    const item = rollWeightedItem() // put random item here then thats basically all you have to do

    const lore = item.getLore()

    if (lore) {
        lore[lore.length] = "fxp275"
    } else lore[0] = "fxp275"
    item.setLore(lore)

    const newEntity = entity.dimension.spawnItem(item, entity.location)
    const newVelo = {x: velocity.x*.75, y:velocity.y*.50, z:velocity.z*.75}
    newEntity.applyImpulse(newVelo)
    entity.kill()
})



world.beforeEvents.entityRemove.subscribe(data => { // duuuuude i have no idea whats going on here
    const entity = data.removedEntity
    if (!(entity.getComponent("item")?.itemStack)) return


    const lore = entity.getComponent("item")?.itemStack.getLore()
    if (lore[lore.length-1] && lore[lore.length-1].startsWith("fxp")) {

    let xp = 0
    xp = Number(lore[lore.length-1].substring(3))
    
    const players = data.removedEntity.dimension.getPlayers({location: data.removedEntity.location, maxDistance: 5, closest: 1})

    system.run(() => {
        const inv = players[0].getComponent("inventory").container
        for (let i = 0; i < 36; i++) {
            
            const item = inv.getItem(i)
            const tLore = item?.getLore()

                if (tLore && tLore[tLore.length-1] && (tLore[tLore.length-1].startsWith("fxp"))) { // mostly here so hopefully I dont have to edit this ever again
                    tLore.pop()
                    item.setLore(tLore)
                    inv.setItem(i, undefined)
                    inv.addItem(item)
                }
            }
        setScore(players[0], "temp", xp, true)
    })    
    }

    try {
        if (!(data.removedEntity.getComponent("item")?.itemStack?.typeId === "minecraft:element_1")) return;
    } catch (e) {
        return
    }
    

    const players = entity.dimension.getPlayers({location: data.removedEntity.location, maxDistance: 1.5})

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

system.runInterval(() => {
    const players = world.getPlayers()
    players.forEach(player => {
        player.onScreenDisplay.setActionBar(
            `Coins: §6${getPlayerDynamicProperty(player, "coins")}
§9discord.gg/HRGNN3pzQN`)
    })
}, 4)