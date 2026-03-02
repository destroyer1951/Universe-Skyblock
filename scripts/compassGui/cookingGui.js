import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'

function cookingInfoMenu(player, item, recipe) {
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

    const menu = new ChestFormData("45")
        menu.title(cleanName)
        
        menu.button(20, `${item.nameTag || item.typeId}`, lore, item.typeId)
        menu.button(22, "§6Cook This Item!", [], 'minecraft:campfire')

        menu.button(15, 'Recipe:', recipe, 'minecraft:redstone')
        menu.button(24, '', [], 'minecraft:lava_bucket')
        menu.button(33, "Fuel", [], 'minecraft:coal')

        menu.pattern(["xxxxxxxxx", // "glass_orange.png"
                     ".........",
                     ".........",
                     ".........",
                     "xxxxxxxxx"], {x: {itemName: '', itemDesc: [], texture: "textures/blocks/glass_orange"}})

        menu.show(player).then(a => {
            if (a.canceled) return
        })
}


export function campfireCookingMenu(player) {
    player["afkTimer"] = Date.now() + 350000


    const menu = new ChestFormData("54")
        .title("Campfire Cooking")

        .button(10, "Candied Apple", ["", "§r§7View Recipe"], "minecraft:apple")

        .show(player).then(a => {
            if (a.canceled) return

            switch (a.selection) {
                case 10: {
                    return cookingInfoMenu(player, items.candiedApple, ["not telling"])
                }
            }
        })
}