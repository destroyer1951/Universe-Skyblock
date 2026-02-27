import { world, system, ItemStack, Player } from '@minecraft/server'
import { ChestFormData } from '../extensions/forms.js';

import { items, rollStars } from '../items.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'


export function craftingMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const fishingLevel = getPlayerDynamicProperty(player, "fishingLevel")
    const miningLevel = getPlayerDynamicProperty(player, "miningLevel")

    const menu = new ChestFormData("54")
        menu.title("Crafting Menu")
        menu.button(4, "§aCustom Crafting", ["", "§r§7This is a list of all", "§r§7custom crafting recipes", "§r§7currently in the game.","","§r§7Custom crafting items","§r§7may only be crafted","§r§7through this menu!"], "minecraft:emerald")

        if (fishingLevel < 3) { 
            menu.button(10, "Ink Rod", ["", "§r§cRequires Fishing Level 3!"], "minecraft:fishing_rod", 1) 
        } else menu.button(10, "Ink Rod", ["", "§r§7View Recipe"], "minecraft:fishing_rod", 1)

        if (miningLevel < 3) { 
            menu.button(11, "Coal Pickaxe", ["", "§r§cRequires Mining Level 3!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(11, "Coal Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (miningLevel < 4) { 
            menu.button(12, "Dense Stone", ["", "§r§cRequires Mining Level 4!"], "minecraft:stone_bricks", 1)
        } else menu.button(12, "Dense Stone", ["", "§r§7View Recipe"], "minecraft:stone_bricks", 1)

        if (miningLevel < 5) { 
            menu.button(13, "Dense Pickaxe", ["", "§r§cRequires Mining Level 5!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(13, "Dense Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (fishingLevel < 5) { 
            menu.button(14, "Whale Rod", ["", "§r§cRequires Fishing Level 5!"], "minecraft:fishing_rod", 1)
        } else menu.button(14, "Whale Rod", ["", "§r§7View Recipe"], "minecraft:fishing_rod", 1)

        if (miningLevel < 6) { 
            menu.button(15, "Hybrid Pickaxe", ["", "§r§cRequires Mining Level 6!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(15, "Hybrid Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (miningLevel < 7) { 
            menu.button(16, "§7Iron Pickaxe", ["", "§r§cRequires Mining Level 7!"], "minecraft:iron_pickaxe", 1)
        } else menu.button(16, "§7Iron Pickaxe", ["", "§r§7View Recipe"], "minecraft:iron_pickaxe", 1)

        menu.button(19, "Iron Axe", ["", "§r§7View Recipe"], "minecraft:iron_axe", 1)

        if (miningLevel < 9) { 
            menu.button(20, "§8Unstable Pickaxe", ["", "§r§cRequires Mining Level 9!"], "minecraft:stone_pickaxe", 1)
        } else menu.button(20, "§8Unstable Pickaxe", ["", "§r§7View Recipe"], "minecraft:stone_pickaxe", 1)

        if (fishingLevel < 9) {
            menu.button(21, "§r§sP§br§si§bs§sm§ba§sr§bi§sn§be §sR§bo§sd", ["", "§r§cRequires Fishing Level 9!"], "minecraft:fishing_rod", 1)
        } else menu.button(21, "§r§sP§br§si§bs§sm§ba§sr§bi§sn§be §sR§bo§sd", ["", "§r§7View Recipe"], "minecraft:fishing_rod", 1)


        menu.show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 4: {
                    return craftingMenu(player)
                }
                case 10: {
                    if (fishingLevel < 3)  {
                        return player.sendMessage("§cYou need Fishing Level 3 to craft this item!")
                    } else return craftTemplateMenu(player, items.inkRod, [
                        "  b",
                        " ba",
                        "b a"
                    ], [["a", "minecraft:ink_sac", 1], ["b", "minecraft:stick", 1]])
                }
                case 11: {
                    if (miningLevel < 3)  { 
                        return player.sendMessage("§cYou need Mining Level 3 to craft this item!")
                    } else return craftTemplateMenu(player, items.coalPickaxe, [
                        "aaa",
                        " b ",
                        " b "
                    ], [["a", "minecraft:coal", 1], ["b", "minecraft:stick", 1]])
                }
                case 12: {
                    if (miningLevel < 4)  { 
                        return player.sendMessage("§cYou need Mining Level 4 to craft this item!")
                    } else return craftTemplateMenu(player, items.denseStone, [
                        "aaa",
                        "aaa",
                        "aaa"
                    ], [["a", "minecraft:cobblestone", 1]])
                }
                case 13: {
                    if (miningLevel < 5)  { 
                        return player.sendMessage("§cYou need Mining Level 5 to craft this item!")
                    } else return craftTemplateMenu(player, items.densePickaxe, [
                        "aaa",
                        " b ",
                        " b "
                    ], [["a", items.denseStone, 10], ["b", "minecraft:stick", 1]])
                }
                case 14: {
                    if (fishingLevel < 5)  { 
                        return player.sendMessage("§cYou need Fishing Level 5 to craft this item!")
                    } else return craftTemplateMenu(player, items.whaleRod, [
                        "  a",
                        " ba",
                        "c d"
                    ], [["a", "minecraft:cod", 32], ["b", "minecraft:water_bucket", 1], ["c", "minecraft:oak_fence", 1], ["d", items.prismarineShard, 1]])
                }
                case 15: {
                    if (miningLevel < 6)  { 
                        return player.sendMessage("§cYou need Mining Level 6 to craft this item!")
                    } else return craftTemplateMenu(player, items.hybridPickaxe, [
                        "bbb",
                        "a c",
                        "bbb"
                    ], [["a", items.coalPickaxe, 1], ["b", items.blubber, 2], ["c", items.densePickaxe, 1]])
                }
                case 16: {
                    if (miningLevel < 7)  { 
                        return player.sendMessage("§cYou need Mining Level 7 to craft this item!")
                    } else return craftTemplateMenu(player, items.ironPickaxe, [
                        "aca",
                        " b ",
                        " b "
                    ], [["a", "minecraft:iron_ingot", 1], ["b", "minecraft:iron_bars", 1], ["c", "minecraft:iron_block", 1]])
                }
                case 19: {
                    return craftTemplateMenu(player, items.ironAxe, [
                        " aa",
                        " ba",
                        " b "
                    ], [["a", "minecraft:iron_ingot", 1], ["b", "minecraft:iron_bars", 1]])
                }
                case 20: {
                    if (miningLevel < 9)  { 
                        return player.sendMessage("§cYou need Mining Level 9 to craft this item!")
                    } else return craftTemplateMenu(player, items.unstablePickaxe, [
                        "aaa",
                        " b ",
                        " b "
                    ], [["a", items.denseStone, 64], ["b", "minecraft:iron_ingot", 2]])
                }
                case 21: {
                    if (fishingLevel < 9)  { 
                        return player.sendMessage("§cYou need Fishing Level 9 to craft this item!")
                    } else return craftTemplateMenu(player, items.prismarineRod, [
                        "  c",
                        " bc",
                        "a d"
                    ], [["a", items.prismarineShard, 10], ["b", "minecraft:ice", 64], ["c", "minecraft:tropical_fish", 32], ["d", items.blubber, 64]])
                }
            }
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

/*
const item = items.unstablePickaxe
const pattern = [
    "aaa",
    " b ",
    " b ",]
const key = [["a", items.denseStone, 3], ["b", "minecraft:stick", 2]]
*/