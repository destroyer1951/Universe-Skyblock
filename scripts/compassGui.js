import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from './extensions/forms.js';

import { items, makeItem, rollStars } from './items.js'
import { prices } from './prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from './stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements } from './index.js'

/** @param {Player} player  */
export function mainMenu(player) {
    new ChestFormData("27")
        .title('Skyblock Menu')
        .button(4, 'Levels', ['', '§7Check your Skill Levels!'], 'minecraft:turtle_scute', 1)
        .button(12, 'Codes', ['', '§7Redeem Codes for Rewards!'], 'minecraft:name_tag', 1)
        .button(13, 'Your Island', ['', '§7Warp to your Island!'], 'minecraft:compass', 1)
        .button(14, 'Shop', ['', '§7Buy and Sell some Items!'], 'minecraft:gold_ingot', 1)
        .button(22, 'Crafting', ['', '§7Craft custom items!'], 'minecraft:crafting_table', 1)

        .show(player).then(a => {
            if (a.canceled) return;
            switch (a.selection) {
                case 4: {
                    return levelsMenu(player)
                }
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
                case 22: {
                    return craftingMenu(player)
                }
            }
        })
};

export function craftingMenu(player) {
    new ChestFormData("54")
        .title("Crafting Menu")
        .button("4", "§aCustom Crafting", ["", "§r§7This is a list of all", "§r§7custom crafting recipes", "§r§7currently in the game.","","§r§7Custom crafting items","§r§7may only be crafted","§r§7through this menu!"], "minecraft:emerald")
        .button("10", "Ink Rod", ["", "§r§7View Recipe"], "minecraft:fishing_rod", 1)

        .show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 4: {
                    return craftingMenu(player)
                }
                case 10: {
                    return inkRodMenu(player)
                }
            }
        })
}


/** @param {Player} player  */
export function levelsMenu(player) {
    const miningLevel = getPlayerDynamicProperty(player, "miningLevel")
    //const farmingLevel = getPlayerDynamicProperty(player, "farmingLevel")
    const fishingLevel = getPlayerDynamicProperty(player, "fishingLevel")
    //const combatLevel = getPlayerDynamicProperty(player, "combatLevel")
    const skyblockLevel = getPlayerDynamicProperty(player, "skyblockLevel")

    const miningXP = getPlayerDynamicProperty(player, "miningXP")
    const fishingXP = getPlayerDynamicProperty(player, "fishingXP")
    const skyblockXP = getPlayerDynamicProperty(player, "skyblockXP")
    //const farmingXP = getPlayerDynamicProperty(player, "farmingXP")
    //const combatXP = getPlayerDynamicProperty(player, "combatXP")

    const miningLevelProgress = xpRequirements[miningLevel + 1] ? xpRequirements[miningLevel] : "MAX"
    const fishingLevelProgress = xpRequirements[fishingLevel + 1] ? xpRequirements[fishingLevel] : "MAX"
    const skyblockLevelProgress = xpRequirements[skyblockLevel + 1] ? xpRequirements[skyblockLevel] : "MAX"
        //const farmingLevelProgress = xpRequirements[farmingLevel + 1] ? xpRequirements[farmingLevel] : "MAX"
        //const combatLevelProgress = xpRequirements[combatLevel + 1] ? xpRequirements[combatLevel] : "MAX"



    new ChestFormData("27")
        .title('Skill Levels')
        .button(11, `§cCombat Level`, ['', '§l§5COMING SOON'], 'minecraft:iron_sword', 1)
        .button(12, `§bMining Level: ${miningLevel}`, ['', `Progress: ${miningXP}/${miningLevelProgress} XP`, '', '§7Mining XP is earned through', 'breaking cobblestone and', 'related ores'], 'minecraft:iron_pickaxe', 1)
        .button(13, `§aSkyblock Level: ${skyblockLevel}`, ['', `Progress: ${skyblockXP}/${skyblockLevelProgress} XP`, '', '§7Your Skyblock Level is an', 'average of the 4 other', 'skill levels!'], 'minecraft:turtle_scute', 1)
        .button(14, `§9Fishing Level: ${fishingLevel}`, ['', `Progress: ${fishingXP}/${fishingLevelProgress} XP`, '', '§7Fishing XP is earned through', 'fishing and catching rare items'], 'minecraft:fishing_rod', 1)
        .button(15, `§eFarming Level`, ['', '§l§5COMING SOON'], 'minecraft:wheat', 1)
        .show(player).then(a => {
            if (a.canceled) return;
            switch (a.selection) {

            }
        })
}

/** @param {Player} player  */
export function codesMenu(player) {
    new ModalFormData()
    .title('Codes')
    .label("Join §9discord.gg/HRGNN3pzQN§r to redeem the discord kit, as well as information on the latest codes and updates!!\n\n")
    .textField('Enter Code Here', 'Code')
    .show(player).then(a => {
        if (a.canceled) return;
        const code = a.formValues[1]

        switch (code) {
            case 'UNIVERSESKYBLOCK2026': {
                if (getPlayerDynamicProperty(player, 'UNIVERSESKYBLOCK2026')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, "coins", 750, true)
                player.getComponent("inventory").container.addItem(new ItemStack("minecraft:iron_ingot", 6))

                setPlayerDynamicProperty(player, 'UNIVERSESKYBLOCK2026', 1)
                player.sendMessage("§aSuccessfully redeemed code §eUNIVERSESKYBLOCK2026§a!\n§r§a+§6750 coins\n§r§a+§f6 Iron Ingots")
                return player.playSound("random.levelup")
            }
            case 'HACKER': { // you can only get this code from looking at this code file hahahahahaha open source
                if (getPlayerDynamicProperty(player, 'HACKER')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, "coins", 5000, true)

                setPlayerDynamicProperty(player, 'HACKER', 1)
                player.sendMessage("§aSuccessfully redeemed code §eHACKER§a!\n§r§a+§65000 coins")
                return player.playSound("random.levelup")
            }
            default: {
                return player.sendMessage('§cInvalid Code!')
            }
        }

    })
}

/** @param {Player} player  */
export function shopMainMenu(player) {
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
export function generalShopMenu(player) {
    new ChestFormData("54")
    .title('General Shop Menu')

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
export function farmShopMenu(player) {
    new ChestFormData("54")
    .title('Farming Shop Menu')

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

export function fishingShopMenu(player) {
    new ChestFormData("54")
    .title('Fishing Shop Menu')

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
                return buyUnstackableSellUnavailablePreviewMenu(player, prices.buy.basicRod, items.basicRod)
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
export function buyPreviewMenu(player, buyPrice, sellPrice, item) {
    const freeSlots = getFreeSlots(player)
    if (freeSlots == 0) return player.sendMessage("§cYou need free inventory space for this!")
    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else cleanName = "placeholder"

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, 'Buy Custom', [`§8${cleanName}`, "", `§7Per item price: §6${buyPrice}`], "minecraft:red_dye", 1)

    .button(13, `${item.nameTag ? item.nameTag : cleanName}`, lore, item.typeId, 1)

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
                player.sendMessage(`§aYou purchased §ex1 ${item.nameTag ? item.nameTag : cleanName}§a for §6${buyPrice} coins`)
                return buyPreviewMenu(player, buyPrice, sellPrice, item)

            } case 11: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice*2) return cantBuyMultipleMenu(player)
                return buyCustomMenu(player, buyPrice, item)
            } case 15: {
                
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 ${item.nameTag ? item.nameTag : cleanName}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)

            } case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

export function buyUnavailablePreviewMenu(player, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    .button(11, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)

    .button(13, `${item.nameTag}`, lore, item.typeId, 1)

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

export function buyNamedUnavailablePreviewMenu(player, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    .button(11, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)

    .button(13, `${item.nameTag}`, lore, item.typeId, 1)

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


export function buyUnstackablePreviewMenu(player, buyPrice, sellPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "") 

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, '§dThis item is unstackable!', [`§8${cleanName}`, "", "§7You cannot buy multiple", "§7of this item!"], "minecraft:barrier", 1)

    .button(13, `${item.nameTag}`, lore, item.typeId, 1)

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

export function buySellUnavailablePreviewMenu(player, buyPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, 'Buy Custom', [`§8${cleanName}`, "", `§7Per item price: §6${buyPrice}`], "minecraft:red_dye", 1)

    .button(13, `${item.nameTag}`, lore, item.typeId, 1)

    .button(15, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)
    .button(16, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)

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
                return buySellUnavailablePreviewMenu(player, buyPrice, item)

            } 
            case 11: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice*2) return cantBuyMultipleMenu(player)
                return buyCustomMenu(player, buyPrice, item)
            }
            case 15: {
                return buySellUnavailablePreviewMenu(player, buyPrice, item)
            }
            case 16: {
                return buySellUnavailablePreviewMenu(player, buyPrice, item)
            }
        }
    })
}     

export function buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, item) {
    let cleanName = item.nameTag.replace(/§./g, "")

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }


    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, '§dThis item is unstackable!', [`§8${cleanName}`, "", "§7You cannot buy multiple", "§7of this item!"], "minecraft:barrier", 1)
    
    .button(13, `${item.nameTag}`, lore, item.typeId, 1)

    .button(15, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)
    .button(16, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)

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
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, item)

            } 
            case 11: {
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, item)
            }
            case 15: {
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, item)
            }
            case 16: {
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, item)
            }
        }
    })
}   

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
export function buyCustomMenu(player, buyPrice, item) {
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
export function sellCustomMenu(player, sellPrice, item) {
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

export function sellNamedCustomMenu(player, sellPrice, item) {
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

export function cantBuyOneMenu(player) {
    new ChestFormData("27")
    .title(`Insufficient Funds!`)
    .button(13, "§cInsufficient Funds!", ["", "§7You can't afford", "§7to purchase this!"], "minecraft:hopper")
    .show(player).then(a => {
        return shopMainMenu(player)
    })
}

export function cantBuyMultipleMenu(player) {
    new ChestFormData("27")
    .title(`Insufficient Funds!`)
    .button(13, "§cInsufficient Funds!", ["", "§7You can't afford to", "§7purchase multiple of this!"], "minecraft:hopper")
    .show(player).then(a => {
        return shopMainMenu(player)
    })
}
export function cantSellMenu(player) {
    new ChestFormData("27")
    .title(`Insufficient Funds!`)
    .button(13, "§cInsufficient Funds!", ["", "§7You can't afford to", "§7sell this!"], "minecraft:hopper")
    .show(player).then(a => {
        return shopMainMenu(player)
    })
}

/** 
 * @param {Player} player
*/
function inkRodMenu(player) {
    const itemLore = items.inkRod.getLore()
    let stickReq
    let inkReq
    if (checkItemAmount(player, "minecraft:stick") >= 3) { stickReq = "§a" } else { stickReq = "§c" }
    if (checkItemAmount(player, "minecraft:ink_sac") >= 2) { inkReq = "§a" } else { inkReq = "§c" }
    new ChestFormData("45")
    .title("Ink Rod")
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}})
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${stickReq}x3 Stick`, `§r${inkReq}x2 Ink Sac`], "minecraft:crafting_table")

    .button(13, "Stick", [], "minecraft:stick")
    .button(21, "Stick", [], "minecraft:stick")
    .button(29, "Stick", [], "minecraft:stick")

    .button(22, "Ink Sac", [], "minecraft:ink_sac")
    .button(31, "Ink Sac", [], "minecraft:ink_sac")

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (inkReq == "§c" || stickReq == "§c") {
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {
                clearItem(player, "minecraft:stick", 3)
                clearItem(player, "minecraft:ink_sac", 2)
                player.getComponent("inventory").container.addItem(items.inkRod)
                player.sendMessage("§aSuccessfully crafted §fInk Rod§a!")
                return player.playSound("random.levelup")
            }
        } else return inkRodMenu(player)
    })
}