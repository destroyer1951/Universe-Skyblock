import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements } from '../index.js'

export function shopMainMenu(player) {

    const fishingLevel = getPlayerDynamicProperty(player, "fishingLevel")
    const miningLevel = getPlayerDynamicProperty(player, "miningLevel")
    const cookingLevel = getPlayerDynamicProperty(player, "cookingLevel")

    const menu = new ChestFormData("27")
    menu.title('Shop Menu')
    menu.button(11, "Cooking Shop", ["", "§l§5COMING SOON"], 'minecraft:painting')
    if (fishingLevel < 3) {
        menu.button(12, 'Fishing Shop', ['', '§cRequires Fishing Level 3!'], 'minecraft:fishing_rod', 1)
    } else menu.button(12, 'Fishing Shop', ['', '§7Someone has to throw the rod'], 'minecraft:fishing_rod', 1)
    menu.button(13, 'General Shop', ['', '§7Basic Skyblock Necessities'], 'minecraft:lava_bucket', 1)
    menu.button(14, 'Farming Shop', ['', '§7Put on your Straw Hats'], 'minecraft:wheat', 1)
    if (miningLevel < 5) {
        menu.button(15, 'Building Shop', ['', '§cRequires Mining Level 5!'], 'minecraft:brick_block', 1)
    } else menu.button(15, 'Building Shop', ['', '§7Brick by Brick'], 'minecraft:brick_block', 1)
    menu.show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 11: {
                return
            }
            case 12: {
                if (fishingLevel < 3) return player.sendMessage('§cYou need Fishing Level 3 to access this shop!')
                return fishingShopMenu(player)
            }
            case 13: {
                return generalShopMenu(player)
            }
            case 14: {
                return farmShopMenu(player)
            }
            case 15: {
                if (miningLevel < 5) return player.sendMessage('§cYou need Mining Level 5 to access this shop!')
                return buildingShopMenu(player)
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
    .button(16, 'Basic Fishing Rod', ["", `§7Buy Price:§6 ${prices.buy.basicRod}`, `§7Sell Price:§6 ${prices.sell.basicRod}`], 'minecraft:fishing_rod', 1)

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
                return buyUnstackableSellUnavailablePreviewMenu(player, prices.buy.basicRod, () => items.basicRod)
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

    .button(10, 'Bone Meal', ["", `§7Buy Price:§6 ${prices.buy.boneMeal}`, `§7Sell Price:§6 ${prices.sell.boneMeal}`], 'minecraft:bone_meal', 1)
    .button(11, 'Wheat', ["", `§7Buy Price:§6 ${prices.buy.wheat}`, `§7Sell Price:§6 ${prices.sell.wheat}`], 'minecraft:wheat', 1)
    .button(12, 'Wheat Seeds', ["", `§7Buy Price:§6 ${prices.buy.wheatSeeds}`, `§7Sell Price:§6 ${prices.sell.wheatSeeds}`], 'minecraft:wheat_seeds', 1)
    .button(13, 'Potato', ["", `§7Buy Price:§6 ${prices.buy.potato}`, `§7Sell Price:§6 ${prices.sell.potato}`], 'minecraft:potato', 1)
    .button(14, 'Sugar Cane', ["", `§7Buy Price:§6 ${prices.buy.sugarCane}`, `§7Sell Price:§6 ${prices.sell.sugarCane}`], 'minecraft:sugar_cane', 1)

    

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
                return buyPreviewMenu(player, prices.buy.boneMeal, prices.sell.boneMeal, items.boneMeal)
            }
            case 11: {
                return buyPreviewMenu(player, prices.buy.wheat, prices.sell.wheat, items.wheat)
            }
            case 12: {
                return buyPreviewMenu(player, prices.buy.wheatSeeds, prices.sell.wheatSeeds, items.wheatSeeds)
            }
            case 13: {
                return buyPreviewMenu(player, prices.buy.potato, prices.sell.potato, items.potato)
            }
            case 14: {
                return buyPreviewMenu(player, prices.buy.sugarCane, prices.sell.sugarCane, items.sugarCane)
            }
        }
    })
}

export function fishingShopMenu(player) {
    new ChestFormData("54")
    .title('Fishing Shop Menu')

    .button(10, 'Raw Cod', ["", `§7Buy Price:§6 ${prices.buy.rawCod}`, `§7Sell Price:§6 ${prices.sell.rawCod}`], 'minecraft:cod', 1)
    .button(11, 'Raw Salmon', ["", `§7Buy Price:§6 ${prices.buy.rawSalmon}`, `§7Sell Price:§6 ${prices.sell.rawSalmon}`], 'minecraft:salmon', 1)
    .button(12, 'Tropical Fish', ["", `§7Buy Price:§6 ${prices.buy.tropicalFish}`, `§7Sell Price:§6 ${prices.sell.tropicalFish}`], 'minecraft:tropical_fish', 1)
    .button(13, 'Ink Sac', ["", `§7Buy Price:§6 ${prices.buy.inkSac}`, `§7Sell Price:§6 ${prices.sell.inkSac}`], 'minecraft:ink_sac', 1)
    .button(14, 'Cherry Sapling', ["", `§7Buy Price:§6 ${prices.buy.cherrySapling}`, `§7Sell Price:§6 ${prices.sell.cherrySapling}`], 'minecraft:cherry_sapling', 1)
    .button(15, 'Cherry Log', ["", `§7Buy Price:§6 ${prices.buy.cherryLog}`, `§7Sell Price:§6 ${prices.sell.cherryLog}`], 'minecraft:cherry_log', 1)
    .button(16, 'Prismarine Shard', ["", `§7Buy Price:§6 ${prices.buy.prismarineShard}`, `§7Sell Price:§6 ${prices.sell.prismarineShard}`], 'minecraft:prismarine_shard', 1)

    .button(19, 'Blubber', ["", `§7Buy Price:§6 ${prices.buy.blubber}`, `§7Sell Price:§6 ${prices.sell.blubber}`], 'minecraft:slime_ball', 1)


    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: {
                return buyPreviewMenu(player, prices.buy.rawCod, prices.sell.rawCod, items.rawCod)
            }
            case 11: {
                return buyPreviewMenu(player, prices.buy.rawSalmon, prices.sell.rawSalmon, items.rawSalmon)
            }
            case 12: {
                return buyPreviewMenu(player, prices.buy.tropicalFish, prices.sell.tropicalFish, items.tropicalFish)
            }
            case 13: {
                return buyPreviewMenu(player, prices.buy.inkSac, prices.sell.inkSac, items.inkSac)
            }
            case 14: {
                return buyUnavailablePreviewMenu(player, prices.sell.cherrySapling, items.cherrySapling)
            }
            case 15: {
                return buyUnavailablePreviewMenu(player, prices.sell.cherryLog, items.cherryLog)
            }
            case 16: {
                return buyUnavailablePreviewMenu(player, prices.sell.prismarineShard, items.prismarineShard)
            }
            case 19: {
                return buyPreviewMenu(player, prices.buy.blubber, prices.sell.blubber, items.blubber)
            }
        }
    })
}

export function buildingShopMenu(player) {
    new ChestFormData("54")
    .title('Building Shop Menu')
    
    .button(10, "Bricks", ["", `§7Buy Price:§6 ${prices.buy.bricks}`, `§7Sell Price:§6 ${prices.sell.bricks}`], 'minecraft:brick_block', 1)
    .button(11, "Gravel", ["", `§7Buy Price:§6 ${prices.buy.gravel}`, `§7Sell Price:§6 ${prices.sell.gravel}`], 'minecraft:gravel', 1)
    .button(12, "Scaffolding", ["", `§7Buy Price:§6 ${prices.buy.scaffolding}`, `§7Sell Price:§6 ${prices.sell.scaffolding}`], 'minecraft:scaffolding', 1)
    .button(13, "Moss Block", ["", `§7Buy Price:§6 ${prices.buy.moss}`, `§7Sell Price:§6 ${prices.sell.moss}`], 'minecraft:moss_block', 1)
    .button(14, "Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:white_concrete_powder', 1)
    .button(15, "Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:white_wool', 1)
    .button(16, "Coral", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:tube_coral_block', 1)

    .button(19, "Glass", ["", `§7Buy Price:§6 ${prices.buy.glass}`, `§7Sell Price:§6 ${prices.sell.glass}`], 'minecraft:glass', 1)
    .button(20, "Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:white_stained_glass', 1)

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: {
                return buySellUnavailablePreviewMenu(player, prices.buy.bricks, items.bricks)
            }
            case 11: {
                return buySellUnavailablePreviewMenu(player, prices.buy.gravel, items.gravel)
            }
            case 12: {
                return buySellUnavailablePreviewMenu(player, prices.buy.scaffolding, items.scaffolding)
            }
            case 13: {
                return buySellUnavailablePreviewMenu(player, prices.buy.moss, items.moss)
            }
            case 14: {
                return buyConcretePowderMenu(player)
            }
            case 15: {
                return buyWoolMenu(player)
            }
            case 16: {
                return buyCoralMenu(player)
            }
            case 19: {
                return buySellUnavailablePreviewMenu(player, prices.buy.glass, items.glass)
            }
            case 20: {
                return buyStainedGlassMenu(player)
            }
        }
    })  

}

function buyConcretePowderMenu(player) { // horbbile programming practices
    new ChestFormData("45")
    .title('Concrete Powder Colors')

    .button(10, "White Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:white_concrete_powder', 1)
    .button(11, "Light Gray Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:light_gray_concrete_powder', 1)
    .button(12, "Gray Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:gray_concrete_powder', 1)
    .button(13, "Black Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:black_concrete_powder', 1)
    .button(14, "Brown Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:brown_concrete_powder', 1)
    .button(15, "Red Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:red_concrete_powder', 1)
    .button(16, "Orange Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:orange_concrete_powder', 1)

    .button(19, "Yellow Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:yellow_concrete_powder', 1)
    .button(20, "Lime Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:lime_concrete_powder', 1)
    .button(21, "Green Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:green_concrete_powder', 1)
    .button(22, "Cyan Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:cyan_concrete_powder', 1)
    .button(23, "Light Blue Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:light_blue_concrete_powder', 1)
    .button(24, "Blue Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:blue_concrete_powder', 1)
    .button(25, "Purple Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:purple_concrete_powder', 1)

    .button(28, "Magenta Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:magenta_concrete_powder', 1)
    .button(29, "Pink Concrete Powder", ["", `§7Buy Price:§6 ${prices.buy.concretePowder}`, `§7Sell Price:§6 ${prices.sell.concretePowder}`], 'minecraft:pink_concrete_powder', 1)

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) { // oh my goodness
            case 10: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.whiteConcretePowder) }
            case 11: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.lightGrayConcretePowder) }
            case 12: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.grayConcretePowder) }
            case 13: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.blackConcretePowder) }
            case 14: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.brownConcretePowder) }
            case 15: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.redConcretePowder) }
            case 16: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.orangeConcretePowder) }
            case 19: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.yellowConcretePowder) }
            case 20: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.limeConcretePowder) }
            case 21: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.greenConcretePowder) }
            case 22: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.cyanConcretePowder) }
            case 23: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.lightBlueConcretePowder) }
            case 24: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.blueConcretePowder) }
            case 25: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.purpleConcretePowder) }
            case 28: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.magentaConcretePowder) }
            case 29: { return buySellUnavailablePreviewMenu(player, prices.buy.concretePowder, items.pinkConcretePowder) }
        }
    })
}

function buyWoolMenu(player) {
    new ChestFormData("45")
    .title('Wool Colors')

    .button(10, "White Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:white_wool', 1)
    .button(11, "Light Gray Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:light_gray_wool', 1)
    .button(12, "Gray Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:gray_wool', 1)
    .button(13, "Black Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:black_wool', 1)
    .button(14, "Brown Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:brown_wool', 1)
    .button(15, "Red Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:red_wool', 1)
    .button(16, "Orange Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:orange_wool', 1)

    .button(19, "Yellow Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:yellow_wool', 1)
    .button(20, "Lime Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:lime_wool', 1)
    .button(21, "Green Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:green_wool', 1)
    .button(22, "Cyan Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:cyan_wool', 1)
    .button(23, "Light Blue Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:light_blue_wool', 1)
    .button(24, "Blue Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:blue_wool', 1)
    .button(25, "Purple Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:purple_wool', 1)

    .button(28, "Magenta Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:magenta_wool', 1)
    .button(29, "Pink Wool", ["", `§7Buy Price:§6 ${prices.buy.wool}`, `§7Sell Price:§6 ${prices.sell.wool}`], 'minecraft:pink_wool', 1)

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.whiteWool) }
            case 11: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.lightGrayWool) }
            case 12: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.grayWool) }
            case 13: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.blackWool) }
            case 14: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.brownWool) }
            case 15: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.redWool) }
            case 16: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.orangeWool) }
            case 19: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.yellowWool) }
            case 20: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.limeWool) }
            case 21: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.greenWool) }
            case 22: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.cyanWool) }
            case 23: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.lightBlueWool) }
            case 24: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.blueWool) }
            case 25: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.purpleWool) }
            case 28: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.magentaWool) }
            case 29: { return buySellUnavailablePreviewMenu(player, prices.buy.wool, items.pinkWool) }
        }
    })
}

function buyStainedGlassMenu(player) {
    new ChestFormData("45")
    .title('Stained Glass Colors')

    .button(10, "White Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:white_stained_glass', 1)
    .button(11, "Light Gray Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:light_gray_stained_glass', 1)
    .button(12, "Gray Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:gray_stained_glass', 1)
    .button(13, "Black Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:black_stained_glass', 1)
    .button(14, "Brown Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:brown_stained_glass', 1)
    .button(15, "Red Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:red_stained_glass', 1)
    .button(16, "Orange Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:orange_stained_glass', 1)

    .button(19, "Yellow Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:yellow_stained_glass', 1)
    .button(20, "Lime Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:lime_stained_glass', 1)
    .button(21, "Green Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:green_stained_glass', 1)
    .button(22, "Cyan Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:cyan_stained_glass', 1)
    .button(23, "Light Blue Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:light_blue_stained_glass', 1)
    .button(24, "Blue Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:blue_stained_glass', 1)
    .button(25, "Purple Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:purple_stained_glass', 1)

    .button(28, "Magenta Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:magenta_stained_glass', 1)
    .button(29, "Pink Stained Glass", ["", `§7Buy Price:§6 ${prices.buy.stainedGlass}`, `§7Sell Price:§6 ${prices.sell.stainedGlass}`], 'minecraft:pink_stained_glass', 1)

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 10: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.whiteStainedGlass) }
            case 11: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.lightGrayStainedGlass) }
            case 12: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.grayStainedGlass) }
            case 13: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.blackStainedGlass) }
            case 14: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.brownStainedGlass) }
            case 15: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.redStainedGlass) }
            case 16: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.orangeStainedGlass) }
            case 19: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.yellowStainedGlass) }
            case 20: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.limeStainedGlass) }
            case 21: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.greenStainedGlass) }
            case 22: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.cyanStainedGlass) }
            case 23: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.lightBlueStainedGlass) }
            case 24: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.blueStainedGlass) }
            case 25: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.purpleStainedGlass) }
            case 28: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.magentaStainedGlass) }
            case 29: { return buySellUnavailablePreviewMenu(player, prices.buy.stainedGlass, items.pinkStainedGlass) }
        }
    })
}

function buyCoralMenu(player) {
    new ChestFormData("45")
    .title('Coral Colors')

    // Tube Coral
    .button(11, "Tube Coral Block", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:tube_coral_block', 1)
    .button(20, "Tube Coral", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:tube_coral', 1)
    .button(29, "Tube Coral Fan", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:tube_coral_fan', 1)

    // Brain Coral
    .button(12, "Brain Coral Block", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:brain_coral_block', 1)
    .button(21, "Brain Coral", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:brain_coral', 1)
    .button(30, "Brain Coral Fan", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:brain_coral_fan', 1)

    // Bubble Coral
    .button(13, "Bubble Coral Block", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:bubble_coral_block', 1)
    .button(22, "Bubble Coral", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:bubble_coral', 1)
    .button(31, "Bubble Coral Fan", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:bubble_coral_fan', 1)

    // Fire Coral
    .button(14, "Fire Coral Block", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:fire_coral_block', 1)
    .button(23, "Fire Coral", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:fire_coral', 1)
    .button(32, "Fire Coral Fan", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:fire_coral_fan', 1)

    // Horn Coral
    .button(15, "Horn Coral Block", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:horn_coral_block', 1)
    .button(24, "Horn Coral", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:horn_coral', 1)
    .button(33, "Horn Coral Fan", ["", `§7Buy Price:§6 ${prices.buy.coral}`, `§7Sell Price:§6 ${prices.sell.coral}`], 'minecraft:horn_coral_fan', 1)

    .show(player).then(a => {
        if (a.canceled) return;
        switch (a.selection) {
            case 11: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.tubeCoralBlock) }
            case 20: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.tubeCoral) }
            case 29: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.tubeCoralFan) }

            case 12: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.brainCoralBlock) }
            case 21: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.brainCoral) }
            case 30: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.brainCoralFan) }

            case 13: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.bubbleCoralBlock) }
            case 22: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.bubbleCoral) }
            case 31: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.bubbleCoralFan) }

            case 14: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.fireCoralBlock) }
            case 23: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.fireCoral) }
            case 32: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.fireCoralFan) }

            case 15: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.hornCoralBlock) }
            case 24: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.hornCoral) }
            case 33: { return buySellUnavailablePreviewMenu(player, prices.buy.coral, items.hornCoralFan) }
        }
    })
}

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
export function buyPreviewMenu(player, buyPrice, sellPrice, itemOrFactory) {
    const freeSlots = getFreeSlots(player)
    if (freeSlots == 0) return player.sendMessage("§cYou need free inventory space for this!")

    const itemFactory = typeof itemOrFactory === "function" ? itemOrFactory : () => itemOrFactory.clone()
    const item = itemFactory()

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, 'Buy Custom', [`§8${cleanName}`, "", `§7Per item price: §6${buyPrice}`], "minecraft:red_dye", 1)

    .button(13, `§r§f${item.nameTag ? item.nameTag : cleanName}`, lore, item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice) return cantBuyOneMenu(player)
                
                setPlayerDynamicProperty(player, "coins", -buyPrice, true)
                item.amount = 1
                player.getComponent("inventory").container.addItem(itemOrFactory instanceof Function ? itemOrFactory() : itemOrFactory)
                player.playSound("random.orb")
                player.sendMessage(`§aYou purchased §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${buyPrice} coins`)
                return buyPreviewMenu(player, buyPrice, sellPrice, item)

            } case 11: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice*2) return cantBuyMultipleMenu(player)
                return buyCustomMenu(player, buyPrice, item)
            } case 15: {
                
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)

            } case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

export function buyUnavailablePreviewMenu(player, sellPrice, itemOrFactory) {

    const itemFactory = typeof itemOrFactory === "function" ? itemOrFactory : () => itemOrFactory.clone()
    const item = itemFactory()

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)
    .button(11, '§dYou can\'t buy this item!', [`§8${cleanName}`, "", `§7This item is too rare to buy!`], "minecraft:barrier", 1)

    .button(13, `§r§f${item.nameTag ? item.nameTag : cleanName}`, lore, item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                return buyUnavailablePreviewMenu(player, sellPrice, itemOrFactory)
            } 
            case 11: {
                return buyUnavailablePreviewMenu(player, sellPrice, itemOrFactory)
            }
            case 15: {
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)
            } 
            case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

export function buyNamedUnavailablePreviewMenu(player, sellPrice, itemOrFactory) {

    const itemFactory = typeof itemOrFactory === "function" ? itemOrFactory : () => itemOrFactory.clone()
    const item = itemFactory()

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

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
                return buyNamedUnavailablePreviewMenu(player, sellPrice, itemOrFactory)
            } 
            case 11: {
                return buyNamedUnavailablePreviewMenu(player, sellPrice, itemOrFactory)
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


export function buyUnstackablePreviewMenu(player, buyPrice, sellPrice, itemOrFactory) {

    const freeSlots = getFreeSlots(player)
    if (freeSlots == 0) return player.sendMessage("§cYou need free inventory space for this!")

    const itemFactory = typeof itemOrFactory === "function" ? itemOrFactory : () => itemOrFactory.clone()
    const item = itemFactory()

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, '§dThis item is unstackable!', [`§8${cleanName}`, "", "§7You cannot buy multiple", "§7of this item!"], "minecraft:barrier", 1)

    .button(13, `§r§f${item.nameTag ? item.nameTag : cleanName}`, lore, item.typeId, 1)

    .button(15, 'Sell 1', [`§8${cleanName}`, "", `§7Sell 1 for: §6${sellPrice}`], "minecraft:lime_dye", 1)
    .button(16, 'Sell Custom', [`§8${cleanName}`, "", `§7Per item price: §6${sellPrice}`], "minecraft:green_dye", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice) return cantBuyOneMenu(player)

                setPlayerDynamicProperty(player, "coins", -buyPrice, true)
                item.amount = 1
                player.getComponent("inventory").container.addItem(itemOrFactory instanceof Function ? itemOrFactory() : itemOrFactory)
                player.playSound("random.orb")
                player.sendMessage(`§aYou purchased §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${buyPrice} coins`)
                return buyUnstackablePreviewMenu(player, buyPrice, sellPrice, itemOrFactory)

            } case 11: {
                return buyUnstackablePreviewMenu(player, buyPrice, sellPrice, itemOrFactory)
            }
            case 15: {
                if (checkItemAmount(player, item.typeId) >= 1) {
                    clearItem(player, item.typeId, 1)
                    setPlayerDynamicProperty(player, "coins", (sellPrice), true)

                    player.playSound("random.orb")
                    return player.sendMessage(`§aYou sold §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${sellPrice} coins`)
                } else return cantSellMenu(player)
            }
            case 16: {
                if (checkItemAmount(player, item.typeId) < 1) return cantSellMenu(player)
                return sellCustomMenu(player, sellPrice, item)
            }
        }
    })
}

export function buySellUnavailablePreviewMenu(player, buyPrice, itemOrFactory) {

    const freeSlots = getFreeSlots(player)
    if (freeSlots == 0) return player.sendMessage("§cYou need free inventory space for this!")

    const itemFactory = typeof itemOrFactory === "function" ? itemOrFactory : () => itemOrFactory.clone()
    const item = itemFactory()

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }

    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, 'Buy Custom', [`§8${cleanName}`, "", `§7Per item price: §6${buyPrice}`], "minecraft:red_dye", 1)

    .button(13, `§r§f${item.nameTag ? item.nameTag : cleanName}`, lore, item.typeId, 1)

    .button(15, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)
    .button(16, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice) return cantBuyOneMenu(player)
                
                setPlayerDynamicProperty(player, "coins", -buyPrice, true)
                item.amount = 1
                player.getComponent("inventory").container.addItem(itemOrFactory instanceof Function ? itemOrFactory() : itemOrFactory)
                player.playSound("random.orb")
                player.sendMessage(`§aYou purchased §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${buyPrice} coins`)
                return buySellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)

            } 
            case 11: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice*2) return cantBuyMultipleMenu(player)
                return buyCustomMenu(player, buyPrice, item)
            }
            case 15: {
                return buySellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)
            }
            case 16: {
                return buySellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)
            }
        }
    })
}     

export function buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, itemOrFactory) { // copy this item factory thing to the rest of the shop functions to fix the most evil bug in history

    const freeSlots = getFreeSlots(player)
    if (freeSlots == 0) return player.sendMessage("§cYou need free inventory space for this!")

    const itemFactory = typeof itemOrFactory === "function" ? itemOrFactory : () => itemOrFactory.clone()
    const item = itemFactory()

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let lore = item.getLore()
    if (lore.length !== 0 && lore[lore.length-1].includes("*")) {
        lore.push(...["","§r§8Star count is randomized", "§r§8upon purchase!","§r§8Stars may affect stats!"])
    }


    new ChestFormData("27")
    .title(`Buy §8${cleanName}`)
    .button(10, 'Buy 1', [`§8${cleanName}`, "", `§7Buy 1 for: §6${buyPrice}`], "minecraft:yellow_dye", 1)
    .button(11, '§dThis item is unstackable!', [`§8${cleanName}`, "", "§7You cannot buy multiple", "§7of this item!"], "minecraft:barrier", 1)
    
    .button(13, `§r§f${item.nameTag ? item.nameTag : cleanName}`, lore, item.typeId, 1)

    .button(15, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)
    .button(16, '§dYou can\'t sell this item!', [`§8${cleanName}`, "", `§7This item can't be sold!`], "minecraft:barrier", 1)

    .show(player).then(a => {
        if (a.canceled) return
        switch (a.selection) {
            case 10: {
                if (getPlayerDynamicProperty(player, "coins") < buyPrice) return cantBuyOneMenu(player)
                
                setPlayerDynamicProperty(player, "coins", -buyPrice, true)
                item.amount = 1

                
                player.getComponent("inventory").container.addItem(itemOrFactory instanceof Function ? itemOrFactory() : itemOrFactory)
                player.playSound("random.orb")
                player.sendMessage(`§aYou purchased §ex1 §f${item.nameTag ? item.nameTag : cleanName}§a for §6${buyPrice} coins`)
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)

            } 
            case 11: {
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)
            }
            case 15: {
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)
            }
            case 16: {
                return buyUnstackableSellUnavailablePreviewMenu(player, buyPrice, itemOrFactory)
            }
        }
    })
}   

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
export function buyCustomMenu(player, buyPrice, item) {

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let maxBuyable = Math.floor(getPlayerDynamicProperty(player, "coins")/buyPrice)
    if (maxBuyable > 2304) maxBuyable = 2304
    const freeSlots = getFreeSlots(player)
    let index = 0

    const form = new ModalFormData()
    .title(`§8${cleanName}`)
    if (maxBuyable > freeSlots*64)  {
        maxBuyable = freeSlots*64
        form.label("\n§cYour maximum purchasable is limited by your inventory space!\n\nFree up inventory slots to buy more items!") 
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
        return player.sendMessage(`§aYou purchased §ex${a.formValues[index]} §f${item.nameTag ? item.nameTag : cleanName}§a for §6${buyPrice*a.formValues[index]} coins`)
    })
}

/** 
 * @param {Player} player
 * @param {ItemStack} item
 */
export function sellCustomMenu(player, sellPrice, item) {

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

    let maxSellable = checkItemAmount(player, item.typeId)

    const form = new ModalFormData()
    .title(`§8${cleanName}`)
    .slider("Amount to sell", 1, maxSellable, {defaultValue: 1, valueStep: 1})

    .show(player).then(a => {
        if (a.canceled) return;

        clearItem(player, item.typeId, a.formValues[0])
        setPlayerDynamicProperty(player, "coins", (sellPrice*a.formValues[0]), true)

        player.playSound("random.orb")
        return player.sendMessage(`§aYou sold §ex${a.formValues[0]} §f${item.nameTag ? item.nameTag : cleanName}§a for §6${sellPrice*a.formValues[0]} coins`)
    })
}

export function sellNamedCustomMenu(player, sellPrice, item) {

    let cleanName 
    if (item.nameTag) { 
        cleanName = item.nameTag.replace(/§./g, "")
    } else {
        cleanName = item.typeId.substring(10).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        
    }

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