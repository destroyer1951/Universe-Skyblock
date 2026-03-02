import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'

function cookingInfoMenu(player, item, recipe, minutes, usage) {
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

        menu.button(15, 'Recipe:', recipe, 'minecraft:redstone')
        menu.button(24, "§6Add Fuel", [], "minecraft:lava_bucket")
        menu.button(33, `§fFuel: §6${getPlayerDynamicProperty(player, "campfireFuel") || 0}§e/§6500`, [], "minecraft:coal")


        menu.show(player).then(a => {
            if (a.canceled) return
        })
}

export function fuelMenu(player) {
    const menu = new ChestFormData("45")
        .title("Add Campfire Fuel")
        .pattern(["xxxxxxxxx", 
                 ".........",
                 ".........",
                 ".........",
                 "xxxxxxxxx"], {x: {itemName: '', itemDesc: [], texture: "textures/blocks/glass_gray"}})

        .button()
}

export function campfireCookingMenu(player) {
    player["afkTimer"] = Date.now() + 350000


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
        .button(34, `§fFuel: §6${getPlayerDynamicProperty(player, "campfireFuel") || 0}§e/§6500`, [], "minecraft:coal")

        .show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 10: {
                    return cookingInfoMenu(player, items.candiedApple, ["4x Apple", "16x Sugar"], 20, 20)
                }
            }
        })
}