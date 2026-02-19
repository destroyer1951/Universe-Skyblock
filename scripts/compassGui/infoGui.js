import { world, system, ItemStack, Player, GameMode } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'

import { shopMainMenu } from './shopGui.js';
import { craftingMenu } from './craftingGui.js';



class InfoMenu {
    constructor(item, levelReq, obtainmentMethod) {
        this.menu = new ChestFormData("54")
        this.menu.title(`§7${item.nameTag || item.typeId}`)
        this.menu.button(13, `§7${item.nameTag || item.typeId}`, item.getLore(), item.typeId)
        this.menu.button(29, 'Obtainment Method:', obtainmentMethod, 'minecraft:emerald')
        this.menu.button(31, 'Level Requirement:', [`§r§7${levelReq}`], 'minecraft:redstone')
    }

    show(player) {
        return this.menu.show(player).then(a => {
            if (a.canceled) return;
        })
    }
}

export const infoMenus = {}


system.run(() => {

    infoMenus["prismarineShard"] = new InfoMenu(items.prismarineShard, 0, ["", "test obtainment method"])






})