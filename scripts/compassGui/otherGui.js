import { world, system, ItemStack, Player } from '@minecraft/server'
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { messageDelayed } from '../index.js'
import { buyPreviewMenu, buyUnstackablePreviewMenu } from './shopGui.js';

export function showAkuaMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    new ChestFormData("27")
        .title('Akua\'s Shop')
        
        .button(12, "Copper Chunk", ["", "§7§oI borrowed these from", "§7§othat portal up there"], "minecraft:copper_nautilus_armor")
        .button(13, "Cherry Log", ["", "§7§oJust went fishing", "§7§ofor these"], "minecraft:cherry_log")
        .button(14, "Counterfeit Pickaxe", ["", "§7§oUhh.."], "minecraft:diamond_pickaxe")

        .show(player).then(a => {
            if (a.canceled) return;
            switch (a.selection) {
                case 12: {
                    return buyUnstackablePreviewMenu(player, 2000, 350, items.copperChunk)
                }
                case 13: {
                    return buyPreviewMenu(player, 200, 22, items.cherryLog)
                }
                case 14: {
                    player.sendMessage("§8[§eNPC§8] §8<§bAkua§8>§r §o§7Uhh..")
                    messageDelayed(player, 70, "§8[§eNPC§8] §8<§bAkua§8>§r I'm not ready to let go of that one yet")
                    messageDelayed(player, 120, "§8[§eNPC§8] §8<§bAkua§8>§r Come back at a §elater time§r maybe..")
                    return
                }
            }
        })
}