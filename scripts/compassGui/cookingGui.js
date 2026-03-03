import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'

function cookingInfoMenu(player, item, itemId, recipe, minutes, usage) {
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

    let recipeDisplay = []
    recipe.forEach((line, i, arr) => {

        let cleanItemName
        if (typeof line.item === "string") {
            cleanItemName = line.item.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        } else {
            if (line.item.nameTag) { 
                cleanItemName = line.item.nameTag.replace(/§./g, "")
            } else {
                cleanItemName = line.item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
            }
        }
        recipeDisplay.push(`§a - §7${line.count}x ${cleanItemName}`)

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

        menu.button(15, 'Recipe:', recipeDisplay, 'minecraft:paper')
        menu.button(24, "§6Add Fuel", [], "minecraft:lava_bucket")
        menu.button(33, `§fFuel: §6${getPlayerDynamicProperty(player, "campfireFuel")}§e/§65000`, [], "minecraft:coal")


        menu.show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {

                case 22: {
                    if (getPlayerDynamicProperty(player, "campfireFuel") < usage) return player.sendMessage("§cYou don't have enough campfire fuel to cook this item!")
                    //if (getPlayerDynamicProperty(player, "campfireCookingItem")) return player.sendMessage("§cYou are already cooking an item!")

                    let hasReqs = true

                    recipe.forEach((line, i, arr) => {
                        if (hasReqs == false) return

                        if (typeof line.item === "string") {

                            if (checkItemAmount(player, line.item) < line.count) {
                                hasReqs = false
                                return player.sendMessage("§cYou don't have the entire recipe to cook this item!")
                            }

                        } else {

                            if (line.item.nameTag) { 

                                if (checkItemAmount(player, line.item.typeId, false, line.item.nameTag) < line.count)  {
                                hasReqs = false
                                return player.sendMessage("§cYou don't have the entire recipe to cook this item!")

                                }

                            } else {

                                if (checkItemAmount(player, line.item.typeId) < line.count) {
                                hasReqs = false
                                return player.sendMessage("§cYou don't have the entire recipe to cook this item!")
                                }
                            }
                        }
                    })
                    if (!hasReqs) return
                    
                    recipe.forEach((line, i, arr) => {
                        if (typeof line.item === "string") {
                            clearItem(player, line.item, line.count)
                        } else {

                            if (line.item.nameTag) { 
                                clearItem(player, line.item.typeId, line.count, line.item.nameTag)
                            } else {
                                clearItem(player, line.item.typeId, line.count)
                            }
                        }
                    })

                    setPlayerDynamicProperty(player, "campfireCookingItem", JSON.stringify({name: item.nameTag, typeId: item.typeId, itemId: itemId}))
                    setPlayerDynamicProperty(player, "campfireCookingTime", Date.now() + minutes*60000)
                    return player.sendMessage(`§aStarted cooking ${item.nameTag}!`)
                }

                case 24: {
                    if (getPlayerDynamicProperty(player, "campfireFuel") >= 5000) {
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
                case 22: {
                    if (checkItemAmount(player, "minecraft:charcoal") >= 1) {
                        return addCampfireFuelMenu(player, "minecraft:charcoal", "Campfire")
                    } else return player.sendMessage("§cYou don't have any Charcoal to add!")
                }
                case 23: {
                    if (checkItemAmount(player, "minecraft:coal") >= 1) {
                        return addCampfireFuelMenu(player, "minecraft:coal", "Campfire")
                    } else return player.sendMessage("§cYou don't have any Coal to add!")
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
    if (maxFuel+currentFuel > 5000) maxItem = Math.floor((5000-currentFuel)/fuelTable[item.typeId || item])

    const menu = new ModalFormData()
        .title(`Add ${cleanName} as ${station} Fuel`)
        .slider(`\nAmount of ${cleanName} to add`, 1, maxItem, {defaultValue: 1, valueStep: 1})
        .show(player).then(a => {
            if (a.canceled) return
            clearItem(player, item.typeId || item, a.formValues[0])
            setPlayerDynamicProperty(player, "campfireFuel", a.formValues[0]*fuelTable[item.typeId || item], true)
            player.playSound("mob.blaze.shoot", {volume: 1, pitch: 1.1})
            player.sendMessage(`§aAdded §6${a.formValues[0]*fuelTable[item.typeId || item]} fuel§a!`)

        })
}

export function campfireCookingMenu(player) {
    player["afkTimer"] = Date.now() + 350000

    if (!(getPlayerDynamicProperty(player, "campfireFuel"))) setPlayerDynamicProperty(player, "campfireFuel", 0)

    let cookingItem
    if (getPlayerDynamicProperty(player, "campfireCookingItem")) cookingItem = JSON.parse(getPlayerDynamicProperty(player, "campfireCookingItem"))

    const menu = new ChestFormData("54")
        menu.title("Campfire Cooking")

        menu.pattern(["xxxx.xxxx",
                ".........",
                ".........",
                ".........",
                ".........",
                "xxxx.xxxx"], {x: {itemName: '', itemDesc: [], texture: "textures/blocks/glass_gray"}})
        menu.button(4, "§aCampfire Cooking", ["", "§r§7Cook items and consume", "§7them to receive", "temporary stat buffs!", "", "You may only cook one", "item at a time, even", "with multiple campfires!"], "minecraft:emerald")
        
        menu.button(25, "§6Add Fuel", [], "minecraft:lava_bucket")
        menu.button(34, `§fFuel: §6${getPlayerDynamicProperty(player, "campfireFuel")}§e/§65000`, [], "minecraft:coal")

        if (cookingItem) {
            menu.button(49, cookingItem.name, ["", `§a${((getPlayerDynamicProperty(player, "campfireCookingTime")-Date.now())/60000).toFixed(1)}m §7left`], cookingItem.typeId)
        } else menu.button(49, "§cNothing Yet!", ["", "§7Start cooking to see", "§7your progress here!"], "minecraft:barrier")

        
        menu.button(10, "Candied Apple", ["", "§r§7View Recipe"], "minecraft:apple")


        menu.show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 25: {
                    if (getPlayerDynamicProperty(player, "campfireFuel") >= 5000) {
                        return player.sendMessage("§cYour campfire fuel is already full!")
                    } else return campfireFuelMenu(player)
                }
                case 10: {
                    return cookingInfoMenu(player, items.candiedApple, "candiedApple", [{item: "minecraft:apple", count: 4}, {item: "minecraft:sugar", count: 8}], 20, 20)
                }
            }
        })
}