import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'


export function craftingMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const fishingLevel = getPlayerDynamicProperty(player, "fishingLevel")
    const miningLevel = getPlayerDynamicProperty(player, "miningLevel")

    const menu = new ChestFormData("54")
        menu.title("Crafting Menu")
        menu.button(4, "§aCustom Crafting", ["", "§r§7This is a list of all", "§r§7custom crafting recipes", "§r§7currently in the game.","","§r§7Custom crafting items","§r§7may only be crafted","§r§7through this menu!"], "minecraft:emerald")

        if (fishingLevel < 3)  { 
            menu.button(10, "Ink Rod", ["", "§r§cRequires Fishing Level 3!"], "minecraft:fishing_rod", 1) 
        } else menu.button(10, "Ink Rod", ["", "§r§7View Recipe"], "minecraft:fishing_rod", 1)

        if (miningLevel < 3)  { 
            menu.button(11, "Coal Pickaxe", ["", "§r§cRequires Mining Level 3!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(11, "Coal Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (miningLevel < 4)  { 
            menu.button(12, "Dense Stone", ["", "§r§cRequires Mining Level 4!"], "minecraft:stone_bricks", 1)
        } else menu.button(12, "Dense Stone", ["", "§r§7View Recipe"], "minecraft:stone_bricks", 1)

        if (miningLevel < 5)  { 
            menu.button(13, "Dense Pickaxe", ["", "§r§cRequires Mining Level 5!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(13, "Dense Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (fishingLevel < 6)  { 
            menu.button(14, "Whale Rod", ["", "§r§cRequires Fishing Level 5!"], "minecraft:fishing_rod", 1)
        } else menu.button(14, "Whale Rod", ["", "§r§7View Recipe"], "minecraft:fishing_rod", 1)

        if (miningLevel < 6)  { 
            menu.button(15, "Hybrid Pickaxe", ["", "§r§cRequires Mining Level 6!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(15, "Hybrid Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (miningLevel < 7)  { 
            menu.button(16, "§7Iron Pickaxe", ["", "§r§cRequires Mining Level 7!"], "minecraft:iron_pickaxe", 1)
        } else menu.button(16, "§7Iron Pickaxe", ["", "§r§7View Recipe"], "minecraft:iron_pickaxe", 1)

        menu.button(19, "Iron Axe", ["", "§r§7View Recipe"], "minecraft:iron_axe", 1)

        if (miningLevel < 9)  { 
            menu.button(20, "§8Unstable Pickaxe", ["", "§r§cRequires Mining Level 9!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(20, "§8Unstable Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        menu.button(21, "super cool", [], "minecraft:stone", 1)


        menu.show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 4: {
                    return craftingMenu(player)
                }
                case 10: {
                    if (fishingLevel < 3)  { 
                        return player.sendMessage("§cYou need Fishing Level 3 to craft this item!")
                    } else return inkRodMenu(player)
                }
                case 11: {
                    if (miningLevel < 3)  { 
                        return player.sendMessage("§cYou need Mining Level 3 to craft this item!")
                    } else return coalPickaxeMenu(player)
                }
                case 12: {
                    if (miningLevel < 4)  { 
                        return player.sendMessage("§cYou need Mining Level 4 to craft this item!")
                    } else return denseStoneMenu(player)
                }
                case 13: {
                    if (miningLevel < 5)  { 
                        return player.sendMessage("§cYou need Mining Level 5 to craft this item!")
                    } else return densePickaxeMenu(player)
                }
                case 14: {
                    if (fishingLevel < 5)  { 
                        return player.sendMessage("§cYou need Fishing Level 5 to craft this item!")
                    } else return whaleRodMenu(player)
                }
                case 15: {
                    if (miningLevel < 6)  { 
                        return player.sendMessage("§cYou need Mining Level 6 to craft this item!")
                    } else return hybridPickaxeMenu(player)
                }
                case 16: {
                    if (miningLevel < 7)  { 
                        return player.sendMessage("§cYou need Mining Level 7 to craft this item!")
                    } else return ironPickaxeMenu(player)
                }
                case 19: {
                    return ironAxeMenu(player)
                }
                case 20: {
                    if (miningLevel < 9)  { 
                        return player.sendMessage("§cYou need Mining Level 9 to craft this item!")
                    } else return unstablePickaxeMenu(player)
                }
                case 21: {
                    return craftTemplateMenu(player, items.unstablePickaxe, [
                        "aaa",
                        " b ",
                        " b "
                    ], [["a", items.denseStone, 3], ["b", "minecraft:stick", 2]])
                }
            }
        })
}

/** 
 * @param {Player} player
*/
function inkRodMenu(player) { // bum outdated function dont copy me
    player["afkTimer"] = Date.now() + 350000
    const itemLore = items.inkRod.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

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

    .button(24, items.inkRod.nameTag, itemLore, items.inkRod.typeId)

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
                player.playSound("random.levelup")
                return inkRodMenu(player)
            }
        } else return inkRodMenu(player)
    })
}

function coalPickaxeMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.coalPickaxe
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2
    if (checkItemAmount(player, "minecraft:coal") >= 3) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, "minecraft:stick") >= 2) { req2 = "§a" } else { req2 = "§c" }
    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x3 Coal`, `§r${req2}x2 Stick`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(21, "Stick", [], "minecraft:stick")
    .button(30, "Stick", [], "minecraft:stick")

    .button(11, "Coal", [], "minecraft:coal")
    .button(12, "Coal", [], "minecraft:coal")
    .button(13, "Coal", [], "minecraft:coal")

    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c") {
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {
                
                clearItem(player, "minecraft:stick", 2)
                clearItem(player, "minecraft:coal", 3)

                player.getComponent("inventory").container.addItem(items.coalPickaxe)
                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return coalPickaxeMenu(player)
            }
        } else return coalPickaxeMenu(player)
    })
}

function whaleRodMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.whaleRod
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2
    let req3
    let req4
    if (checkItemAmount(player, "minecraft:oak_fence") >= 32) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, "minecraft:water_bucket") >= 1) { req2 = "§a" } else { req2 = "§c" }
    if (checkItemAmount(player, "minecraft:cod") >= 64) { req3 = "§a" } else { req3 = "§c" }
    if (checkItemAmount(player, "minecraft:prismarine_shard") >= 1) { req4 = "§a" } else { req4 = "§c" }
    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x32 Oak Fence`, `§r${req2}x1 Water Bucket`, `§r${req3}x64 Raw Cod`, `§r${req4}x1 Prismarine Shard`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(29, "Oak Fence", [], "minecraft:oak_fence", 32)

    .button(21, "Water Bucket", [], "minecraft:water_bucket")

    .button(13, "Raw Cod", [], "minecraft:cod", 32)
    .button(22, "Raw Cod", [], "minecraft:cod", 32)

    .button(31, "Prismarine Shard", [], "minecraft:prismarine_shard")

    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c" || req3 == "§c" || req4 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {
                
                clearItem(player, "minecraft:oak_fence", 32)
                clearItem(player, "minecraft:water_bucket", 1)
                clearItem(player, "minecraft:cod", 64)
                clearItem(player, "minecraft:prismarine_shard", 1)

                player.getComponent("inventory").container.addItem(items.whaleRod)
                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return whaleRodMenu(player)
            }
        } else return whaleRodMenu(player)
    })
}

function denseStoneMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.denseStone
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    if (checkItemAmount(player, "minecraft:cobblestone") >= 9) { req1 = "§a" } else { req1 = "§c" }
    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x9 Cobblestone`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(11, "Cobblestone", [], "minecraft:cobblestone")
    .button(12, "Cobblestone", [], "minecraft:cobblestone")
    .button(13, "Cobblestone", [], "minecraft:cobblestone")
    .button(20, "Cobblestone", [], "minecraft:cobblestone")
    .button(21, "Cobblestone", [], "minecraft:cobblestone")
    .button(22, "Cobblestone", [], "minecraft:cobblestone")
    .button(29, "Cobblestone", [], "minecraft:cobblestone")
    .button(30, "Cobblestone", [], "minecraft:cobblestone")
    .button(31, "Cobblestone", [], "minecraft:cobblestone")

    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {

                clearItem(player, "minecraft:cobblestone", 9)

                player.getComponent("inventory").container.addItem(item)
                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return denseStoneMenu(player)
            }
        } else return denseStoneMenu(player)
    })
}

function densePickaxeMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.densePickaxe
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2
    if (checkItemAmount(player, items.denseStone.typeId, false, items.denseStone.nameTag) >= 30) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, "minecraft:stick") >= 2) { req2 = "§a" } else { req2 = "§c" }
    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x30 Dense Stone`, `§r${req2}x2 Stick`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(11, "Dense Stone", [], "minecraft:stone_bricks", 10)
    .button(12, "Dense Stone", [], "minecraft:stone_bricks", 10)
    .button(13, "Dense Stone", [], "minecraft:stone_bricks", 10)

    .button(21, "Stick", [], "minecraft:stick")
    .button(30, "Stick", [], "minecraft:stick")


    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {

                clearItem(player, items.denseStone.typeId, 30, items.denseStone.nameTag)
                clearItem(player, "minecraft:stick", 2)

                player.getComponent("inventory").container.addItem(items.densePickaxe) // CHANGE THIS EVERY TIME MOST IMPORTANT

                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return densePickaxeMenu(player)
            }
        } else return densePickaxeMenu(player)
    })
}

function hybridPickaxeMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.hybridPickaxe
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2
    let req3
    if (checkItemAmount(player, items.blubber.typeId, false, items.blubber.nameTag) >= 12) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, items.coalPickaxe.typeId, false, items.coalPickaxe.nameTag) >= 1) { req2 = "§a" } else { req2 = "§c" }
    if (checkItemAmount(player, items.densePickaxe.typeId, false, items.densePickaxe.nameTag) >= 1) { req3 = "§a" } else { req3 = "§c" }
    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x12 Blubber`, `§r${req2}x1 Coal Pickaxe`, `§r${req3}x1 Dense Pickaxe`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(11, "Blubber", [], "minecraft:slime_ball", 2)
    .button(12, "Blubber", [], "minecraft:slime_ball", 2)
    .button(13, "Blubber", [], "minecraft:slime_ball", 2)
    .button(29, "Blubber", [], "minecraft:slime_ball", 2)
    .button(30, "Blubber", [], "minecraft:slime_ball", 2)
    .button(31, "Blubber", [], "minecraft:slime_ball", 2)

    .button(20, "Coal Pickaxe", ['', '§r§l§e*'], "minecraft:stone_pickaxe")

    .button(22, "Dense Pickaxe", ['', '§r§l§e*'], "minecraft:stone_pickaxe")


    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c" || req3 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {

                clearItem(player, items.blubber.typeId, 12, items.blubber.nameTag)
                clearItem(player, items.coalPickaxe.typeId, 1, items.coalPickaxe.nameTag)
                clearItem(player, items.densePickaxe.typeId, 1, items.densePickaxe.nameTag)

                player.getComponent("inventory").container.addItem(items.hybridPickaxe) // CHANGE THIS EVERY TIME MOST IMPORTANT

                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return hybridPickaxeMenu(player)
            }
        } else return hybridPickaxeMenu(player)
    })
}

function ironPickaxeMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.ironPickaxe
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2
    let req3
    if (checkItemAmount(player, "minecraft:iron_ingot") >= 2) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, "minecraft:iron_bars") >= 2) { req2 = "§a" } else { req2 = "§c" }
    if (checkItemAmount(player, "minecraft:iron_block") >= 1) { req3 = "§a" } else { req3 = "§c" }

    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x2 Iron Ingot`, `§r${req2}x2 Iron Bars`, `§r${req3}x1 Iron Block`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(11, "Iron Ingot", [], "minecraft:iron_ingot")
    .button(12, "Iron Block", [], "minecraft:iron_block")
    .button(13, "Iron Ingot", [], "minecraft:iron_ingot")

    .button(21, "Iron Bars", [], "minecraft:iron_bars")
    .button(30, "Iron Bars", [], "minecraft:iron_bars")


    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c" || req3 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {

                clearItem(player, "minecraft:iron_ingot", 2)
                clearItem(player, "minecraft:iron_bars", 2)
                clearItem(player, "minecraft:iron_block", 1)

                player.getComponent("inventory").container.addItem(items.ironPickaxe) // CHANGE THIS EVERY TIME MOST IMPORTANT

                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                achieve(player, "Real Steel")
                return ironPickaxeMenu(player)
            }
        } else return ironPickaxeMenu(player)
    })
}

function ironAxeMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.ironAxe
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2

    if (checkItemAmount(player, "minecraft:iron_ingot") >= 3) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, "minecraft:iron_bars") >= 2) { req2 = "§a" } else { req2 = "§c" }

    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x3 Iron Ingot`, `§r${req2}x2 Iron Bars`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(11, "Iron Ingot", [], "minecraft:iron_ingot")
    .button(12, "Iron Ingot", [], "minecraft:iron_ingot")
    .button(13, "Iron Ingot", [], "minecraft:iron_ingot")

    .button(21, "Iron Bars", [], "minecraft:iron_bars")
    .button(30, "Iron Bars", [], "minecraft:iron_bars")


    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {

                clearItem(player, "minecraft:iron_ingot", 3)
                clearItem(player, "minecraft:iron_bars", 2)

                player.getComponent("inventory").container.addItem(items.ironAxe) // CHANGE THIS EVERY TIME MOST IMPORTANT

                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return ironAxeMenu(player)
            }
        } else return ironAxeMenu(player)
    })
}


function unstablePickaxeMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const item = items.unstablePickaxe
    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }

    let req1
    let req2

    if (checkItemAmount(player, items.denseStone.typeId, false, items.denseStone.nameTag) >= 192) { req1 = "§a" } else { req1 = "§c" }
    if (checkItemAmount(player, "minecraft:iron_ingot") >= 4) { req2 = "§a" } else { req2 = "§c" }

    new ChestFormData("45")
    .title(item.nameTag.replace(/§./g, ""))
    .pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}}) // make sure to change these from coal and stick
    .button(23, "§eCraft this item!", ["", "§r§7Required materials:",'', `§r${req1}x192 Dense Stone`, `§r${req2}x4 Iron Ingot`], "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    .button(11, "Dense Stone", [], "minecraft:stone_bricks", 64)
    .button(12, "Dense Stone", [], "minecraft:stone_bricks", 64)
    .button(13, "Dense Stone", [], "minecraft:stone_bricks", 64)

    .button(21, "Iron Ingot", [], "minecraft:iron_ingot", 2)
    .button(30, "Iron Ingot", [], "minecraft:iron_ingot", 2)


    .button(24, item.nameTag, itemLore, item.typeId)

    .show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (req1 == "§c" || req2 == "§c") { // ABSOLUTELY REMEMBER TO CHANGE THIS IS REALLY BAD
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {

                clearItem(player, "minecraft:iron_ingot", 4)
                clearItem(player, items.denseStone.typeId, 192, items.denseStone.nameTag)

                player.getComponent("inventory").container.addItem(items.unstablePickaxe)

                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")
                return unstablePickaxeMenu(player)
            }
        } else return unstablePickaxeMenu(player)
    })
}


function craftTemplateMenu(player, item, pattern, key) {
    player["afkTimer"] = Date.now() + 350000

    const itemLore = item.getLore()
    if (itemLore.length !== 0 && itemLore[itemLore.length-1].includes("*")) {
        itemLore.push(...["","§r§8Star count is randomized", "§r§8upon craft!","§r§8Stars may affect stats!"])
    }


    const requirements = []
    let hasAllMaterials = false
    for (let i = 0; i < key.length; i++) {
        const letter = key[i][0]
        const thisItem = key[i][1]
        const amountPer = key[i][2]
        let count = 0
        pattern.forEach((element, index) => {
            count += element.split(letter).length - 1
        })
        const totalAmount = count * amountPer

        if (typeof thisItem === "string") {
            if (checkItemAmount(player, thisItem) >= totalAmount) {
                requirements.push(["§a", thisItem, totalAmount])
            } else {
                requirements.push(["§c", thisItem, totalAmount])
            }

        } else {
            if (checkItemAmount(player, thisItem.typeId, false, thisItem.nameTag) >= totalAmount) {
                requirements.push(["§a", thisItem, totalAmount])
            } else {
                requirements.push(["§c", thisItem, totalAmount])
            }
        }
    }

    if (requirements.every(req => req[0] === "§a")) {
        hasAllMaterials = true
    }

    const menu = new ChestFormData("45")
    menu.title(item.nameTag.replace(/§./g, ""))
    menu.pattern([
        "xxxxxxxxx",
        "xx___xxxx",
        "xx_____xx",
        "xx___xxxx",
        "xxxxxxxxx",
    ], {x: {itemName: "", texture: "minecraft:copper_bars"}})


    let craftLore = ["", "§r§7Required materials:"]
    for (let i = 0; i < requirements.length; i++) {

        const thisItem = requirements[i][1]
        let cleanName 
        if (thisItem.nameTag) { 
            cleanName = thisItem.nameTag.replace(/§./g, "")
        } else {
            cleanName = thisItem.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        }

        craftLore.push(`§r${requirements[i][0]}x${requirements[i][2]} ${cleanName}`)
    }


    menu.button(23, "§eCraft this item!", craftLore, "minecraft:crafting_table")

    // here are your grid square indexes
    // 11, 12, 13
    // 20, 21, 22
    // 29, 30, 31

    for (let i = 0; i < key.length; i++) {
        const letter = key[i][0]
        const thisItem = key[i][1]
        const amountPer = key[i][2]
        const texture = typeof thisItem === "string" ? thisItem : thisItem.typeId

        let cleanName 
        if (thisItem.nameTag) { 
            cleanName = thisItem.nameTag.replace(/§./g, "")
        } else {
            cleanName = thisItem.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        }

        pattern.forEach((element, index) => {
            for (let j = 0; j < element.length; j++) {
                if (element[j] === letter) {
                    const slot = (index+1) * 9 + (j+2)
                    menu.button(slot, cleanName, [], texture, amountPer)
                }
            }
        })
    }

    menu.button(24, item.nameTag, itemLore, item.typeId)

    menu.show(player).then(a => {
        if (a.canceled) return

        if (a.selection === 23) {
            if (!hasAllMaterials) {
                return player.sendMessage("§cYou do not have the required materials to craft this item!")
            } else {
                // clear items
                for (let i = 0; i < key.length; i++) {
                    const thisItem = key[i][1]
                    const totalAmount = requirements[i][2]
                    if (typeof thisItem === "string") {
                        clearItem(player, thisItem, totalAmount)
                    } else {
                        clearItem(player, thisItem.typeId, totalAmount, thisItem.nameTag)
                    }
                }

                player.getComponent("inventory").container.addItem(item)
                player.sendMessage(`§aSuccessfully crafted ${item.nameTag}§a!`)
                player.playSound("random.levelup")

            }
        }
    })
}



function testMenu(player) {

    
    const item = items.unstablePickaxe
    const pattern = [
        "aaa",
        " b ",
        " b ",]
    const key = [["a", items.denseStone, 3], ["b", "minecraft:stick", 2]]


}