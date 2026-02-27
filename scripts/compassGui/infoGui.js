import { world, system, ItemStack, Player, GameMode } from '@minecraft/server'
import { ChestFormData } from '../extensions/forms.js';

import { items } from '../items.js'
import { prices } from '../prices.js'



class InfoMenu {
    constructor(item, levelReq, obtainmentMethod, usage, tool = false) {

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

        obtainmentMethod.forEach((line, i, arr) => {
            if (arr[i] !== "") arr[i] = "§a - §7" + line
        })

        usage.forEach((line, i, arr) => {
            if (arr[i] !== "") arr[i] = "§a - §7" + line
        })

        this.item = item
        this.cleanName = cleanName
        this.menu = new ChestFormData("45")
        this.menu.title(`§8${cleanName}`)
        this.menu.button(13, `${item.nameTag || item.typeId}`, lore, item.typeId)
        this.menu.button(29, 'Obtainment Method:', obtainmentMethod, 'minecraft:emerald')
        this.menu.button(31, 'Level Requirement:', ["", `§r§7${levelReq}`], 'minecraft:redstone')
        if (tool) {
            this.menu.button(33, 'Drops:', usage, 'minecraft:lapis_lazuli')
        } else this.menu.button(33, 'Usage:', usage, 'minecraft:lapis_lazuli')
    }

    show(player) {
        return this.menu.show(player).then(a => {
            if (a.canceled) return;
        })
    }
}

function slotToIndex(slot) { // big gpt saves the day
    const row = Math.floor(slot / 9)
    const col = slot % 9

    // Only allow columns 1–7 (10–16 pattern)
    return (row - 1) * 7 + (col - 1)
}

export function itemDirectyoryMenu(player) {
    player["afkTimer"] = Date.now() + 350000

    const menu = new ChestFormData("54")
        .title('Item Directory')
        



        let slot = 10
        for (let i = 0; i < infoMenus.length; i++) {
            menu.button(slot, infoMenus[i].item.nameTag || infoMenus[i].cleanName, ["", "§7Click to view info!"], infoMenus[i].item.typeId, 1)
            if (slot % 9 === 7) {
                slot += 3 // skip to the next row, column 1
            } else {
                slot++
            }
        }

        // work on this later

        menu.show(player).then(a => {
            if (a.canceled) return;
            
            infoMenus[slotToIndex(a.selection)].show(player)

        })
}


export const infoMenus = []

system.run(() => {

    infoMenus.push(new InfoMenu(items.quartzCrystal, "No Level Requirement", ["", "Currently Unobtainable"], ["", "Currently Useless"]))

    infoMenus.push(new InfoMenu(items.padparadscha, "No Level Requirement", ["", "Currently Unobtainable"], ["", "Currently Useless"]))
    
    infoMenus.push(new InfoMenu(items.prismarineShard, "No Level Requirement", ["", "Fishing"], ["", "Custom crafting recipes", `Sell in shop`]))

    infoMenus.push(new InfoMenu(items.blubber, "No Level Requirement", ["", "Buy from shop", "Fishing"], ["", "Custom crafting recipes", `Sell in shop`]))

    infoMenus.push(new InfoMenu(items.prismarineCrystals, "No Level Requirement", ["", "Fishing"], ["", "Custom crafting recipes", `Sell in shop`]))

    infoMenus.push(new InfoMenu(items.basicRod, "No Level Requirement", ["", "Buy from General Shop"], ["", "Raw Cod", "Raw Salmon", "Tropical Fish", "Cherry Log", "Ink Sac", "Copper Ingot", "Prismarine Shard"], true))
    
    infoMenus.push(new InfoMenu(items.inkRod, "Fishing Level 3", ["", "Custom Crafting"], ["", "Ink Sac", "Coal", "Prismarine Shard"], true))

    infoMenus.push(new InfoMenu(items.whaleRod, "Fishing Level 5", ["", "Custom Crafting"], ["", "Raw Cod", "Raw Salmon", "Blubber", "Ink Sac", "Prismarine Shard"], true))

    infoMenus.push(new InfoMenu(items.prismarineRod, "Fishing Level 9", ["", "Custom Crafting"], ["", "Raw Cod", "Raw Salmon", "Tropical Fish", "Blubber", "Ink Sac", "Prismarine Shard", "Prismarine Crystals"], true))

    infoMenus.push(new InfoMenu(items.denseStone, "Mining Level 4", ["", "Custom Crafting"], ["", "Custom Crafting"]))

    infoMenus.push(new InfoMenu(items.coalPickaxe, "Mining Level 3", ["", "Custom Crafting"], ["", "Coal Ore", "Iron ore"], true))

    infoMenus.push(new InfoMenu(items.densePickaxe, "Mining Level 5", ["", "Custom Crafting"], ["", "Granite", "Diorite", "Andesite"], true))

    infoMenus.push(new InfoMenu(items.hybridPickaxe, "Mining Level 6", ["", "Custom Crafting"], ["", "Granite", "Diorite", "Andesite", "Coal Ore", "Iron Ore"], true))

    infoMenus.push(new InfoMenu(items.ironPickaxe, "Mining Level 7", ["", "Custom Crafting"], ["", "Coal Ore", "Copper Ore", "Iron Ore", "Gold Ore"], true))

    infoMenus.push(new InfoMenu(items.copperChunk, "No Level Requirement", ["", "Mining Copper Ore"], ["", "Something Suspicious"]))

    infoMenus.push(new InfoMenu(items.ironChunk, "No Level Requirement", ["", "Mining Iron Ore"], ["", "Currently Useless"]))

    infoMenus.push(new InfoMenu(items.goldChunk, "No Level Requirement", ["", "Mining Gold Ore"], ["", "Currently Useless"]))

    infoMenus.push(new InfoMenu(items.unstablePickaxe, "Mining Level 9", ["", "Custom Crafting"], ["", "Coal Ore", "Copper Ore", "Iron Ore", "Gold Ore", "Diamond Ore"], true))


})