import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'

function cookingInfoMenu(player, item, recipe, minutes, usage) {
    player["afkTimer"] = Date.now() + 350000


    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    }

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {


        lore.push(...["","§r§8Star count is randomized!"])
    }

    recipe.forEach((line, i, arr) => {
        if (arr[i] !== "") arr[i] = "§a - §7" + line
    })

    const menu = new ChestFormData("45")
        menu.title(cleanName)
        
        menu.pattern(["xxxxxxxxx", 
                     ".........",
                     ".........",
                     ".........",
                     "xxxxxxxxx"], {x: {itemName: '', itemDesc: [], texture: "textures/blocks/glass_orange"}})

        menu.button(20, `${item.nameTag || item.typeId}`, lore, item.typeId)
        menu.button(22, "§6Start Cooking!", ["", `§fCooking Time: §a${minutes}m`, `§fFuel Usage: §6${usage}`], 'minecraft:campfire')

        menu.button(15, 'Recipe:', recipe, 'minecraft:paper')
        menu.button(24, "§6Add Fuel", [], "minecraft:lava_bucket")
        menu.button(33, `§fFuel: §6${getPlayerDynamicProperty(player, "campfireFuel")}§e/§6500`, [], "minecraft:coal")


        menu.show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 24: {
                    if (getPlayerDynamicProperty(player, "campfireFuel") >= 500) {
                        return player.sendMessage("§cYour campfire fuel is already full!")
                    } else return campfireFuelMenu(player)
                }
            }
        })
}

const fuelTable = {
    "minecraft:oak_planks": 1,
    "minecraft:charcoal": 5,
    "minecraft:coal": 5
}

function campfireFuelMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const menu = new ChestFormData("45")
        .title("Add Campfire Fuel")
        .pattern(["xxxxxxxxx", 
                 ".........",
                 ".........",
                 ".........",
                 "xxxxxxxxx"], {x: {itemName: '', itemDesc: [], texture: "textures/blocks/glass_gray"}})

        .button(21, "Add Oak Planks", ["", "§7Adds§6 1 fuel"], "minecraft:oak_planks")
        .button(22, "Add Charcoal", ["", "§7Adds§6 5 fuel"], "minecraft:charcoal")
        .button(23, "Add Coal", ["", "§7Adds§6 5 fuel"], "minecraft:coal")
        
        
        .show(player).then(a => {
            if (a.canceled) return
            switch (a.selection) {
                case 21: {
                    if (checkItemAmount(player, "minecraft:oak_planks") >= 1) {
                        return addCampfireFuelMenu(player, "minecraft:oak_planks", "Campfire")
                    } else return player.sendMessage("§cYou don't have any Oak Planks to add!")
                }
            }
        })
}

function addCampfireFuelMenu(player, item, station) {
    player["afkTimer"] = Date.now() + 350000

    let cleanName
    if (typeof item === "string") {
        cleanName = item.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    }

    let maxItem = checkItemAmount(player, item.typeId || item)
    const currentFuel = getPlayerDynamicProperty(player, "campfireFuel")
    const maxFuel = maxItem*fuelTable[item.typeId || item]
    if (maxFuel+currentFuel > 500) maxItem = Math.floor((500-currentFuel)/fuelTable[item.typeId || item])

    const menu = new ModalFormData()
        .title(`Add ${cleanName} as ${station} Fuel`)
        .slider(`\nAmount of ${cleanName} to add`, 1, maxItem, {defaultValue: 1, valueStep: 1})
        .show(player).then(a => {
            if (a.canceled) return
            clearItem(player, item.typeId || item, a.formValues[0])
            setPlayerDynamicProperty(player, "campfireFuel", a.formValues[0]*fuelTable[item.typeId || item], true)

        })
}

export function campfireCookingMenu(player) {
    player["afkTimer"] = Date.now() + 350000

    if (!(getPlayerDynamicProperty(player, "campfireFuel"))) setPlayerDynamicProperty(player, "campfireFuel", 0)

    const menu = new ChestFormData("54")
        .title("Campfire Cooking")

        .pattern(["xxxx.xxxx",
                ".........",
                ".........",
                ".........",
                ".........",
                "xxxxxxxxx"], {x: {itemName: '', itemDesc: [], texture: "textures/blocks/glass_gray"}})
        .button(4, "§aCampfire Cooking", ["", "§r§7Cook items and consume", "§7them to receive", "temporary stat buffs!", "", "You may only cook one", "item at a time, even", "with multiple campfires!"], "minecraft:emerald")
        
        
        .button(10, "Candied Apple", ["", "§r§7View Recipe"], "minecraft:apple")


        .button(25, "§6Add Fuel", [], "minecraft:lava_bucket")
        .button(34, `§fFuel: §6${getPlayerDynamicProperty(player, "campfireFuel")}§e/§6500`, [], "minecraft:coal")

        .show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 10: {
                    return cookingInfoMenu(player, items.candiedApple, ["4x Apple", "16x Sugar"], 20, 20)
                }
                case 25: {
                    if (getPlayerDynamicProperty(player, "campfireFuel") >= 500) {
                        return player.sendMessage("§cYour campfire fuel is already full!")
                    } else return campfireFuelMenu(player)
                }
            }
        })
}