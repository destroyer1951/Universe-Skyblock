import { world, system, ItemStack, Player, GameMode } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'

import { shopMainMenu } from './shopGui.js';
import { craftingMenu } from './craftingGui.js';
import { itemDirectyoryMenu } from './infoGui.js'


/** @param {Player} player  */
export function mainMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    new ChestFormData("27")
        .title('Skyblock Menu')
        .button(4, 'Levels', ['', '§7Check your Skill Levels!'], 'minecraft:turtle_scute', 1)
        .button(12, 'Codes', ['', '§7Redeem Codes for Rewards!'], 'minecraft:name_tag', 1)
        .button(13, 'Warps', ['', '§7Warp to other locations!'], 'minecraft:compass', 1)
        .button(14, 'Shop', ['', '§7Buy and Sell some Items!'], 'minecraft:gold_ingot', 1)
        .button(22, 'Crafting', ['', '§7Craft custom items!'], 'minecraft:crafting_table', 1)
        .button(23, "Item Directory", ["", "§7View info on items!"], 'minecraft:book', 1)

        .show(player).then(a => {
            if (a.canceled) return;
            switch (a.selection) {
                case 4: {
                    return levelsMenu(player)
                }
                case 12: {
                    return codesMenu(player)
                }
                case 13: {
                    if (!player.getSpawnPoint()) return player.sendMessage("§cYou need to finish the tutorial first!")
                    return warpsMenu(player)
                }
                case 14: {
                    return shopMainMenu(player)
                }
                case 22: {
                    if (getFreeSlots(player) == 0) return player.sendMessage("§cYou need free inventory space for this!")
                    return craftingMenu(player)
                }
                case 23: {
                    return itemDirectyoryMenu(player)
                }
            }
        })
};

/** @param {Player} player  */
export function warpsMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    new ChestFormData("27")
        .title('Warps Menu')
        .button(13, 'Your Island', ['', '§7Warp to your Island!'], 'minecraft:grass_block', 1)
        .button(14, 'Lobby', ['', '§7Warp to the Lobby!'], 'minecraft:nether_star', 1)
        .show(player).then(a => {
            if (a.canceled) return;

            switch (a.selection) {
                case 13: {
                    if (player.getGameMode() === GameMode.Adventure) player.setGameMode(GameMode.Survival)
                    player.teleport(player.getSpawnPoint())
                    return player.sendMessage("§eWarped to your Island")
                }
                case 14: {
                    if (player.getGameMode() === GameMode.Survival) player.setGameMode(GameMode.Adventure)
                    player.teleport({x: -999.5, y: 100.50, z: -999.5})
                    player.sendMessage("§eWarped to the Lobby")
                    return player.sendMessage("§o§7Wow its empty here...")
                }
            }
        })
}

/** @param {Player} player  */
export function levelsMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    const miningLevel = getPlayerDynamicProperty(player, "miningLevel")
    //const farmingLevel = getPlayerDynamicProperty(player, "farmingLevel")
    const fishingLevel = getPlayerDynamicProperty(player, "fishingLevel")
    //const cookingLevel = getPlayerDynamicProperty(player, "cookingLevel")
    const skyblockLevel = getPlayerDynamicProperty(player, "skyblockLevel")

    const miningXP = getPlayerDynamicProperty(player, "miningXP")
    const fishingXP = getPlayerDynamicProperty(player, "fishingXP")
    //const skyblockXP = getPlayerDynamicProperty(player, "skyblockXP")
    //const farmingXP = getPlayerDynamicProperty(player, "farmingXP")
    //const cookingXP = getPlayerDynamicProperty(player, "cookingXP")

    const miningLevelProgress = xpRequirements[miningLevel + 1] ? xpRequirements[miningLevel] : "MAX"
    const fishingLevelProgress = xpRequirements[fishingLevel + 1] ? xpRequirements[fishingLevel] : "MAX"
    const skyblockLevelProgress = xpRequirements[skyblockLevel + 1] ? xpRequirements[skyblockLevel] : "MAX"
        //const farmingLevelProgress = xpRequirements[farmingLevel + 1] ? xpRequirements[farmingLevel] : "MAX"
        //const cookingLevelProgress = xpRequirements[cookingLevel + 1] ? xpRequirements[cookingLevel] : "MAX"



    new ChestFormData("27")
        .title('Skill Levels')
        .button(11, `§4Cooking Level`, ['', '§l§5COMING SOON'], 'minecraft:campfire', 1)
        .button(12, `§bMining Level: ${miningLevel}`, ['', `Progress: ${miningXP}/${miningLevelProgress} XP`, '', '§7Mining XP is earned through', 'breaking cobblestone and', 'related ores'], 'minecraft:iron_pickaxe', 1)
        .button(13, `§aSkyblock Level: ${skyblockLevel}`, ['', '§7Your Skyblock Level is an', 'average of the 4 other', 'skill levels!'], 'minecraft:turtle_scute', 1)
        .button(14, `§9Fishing Level: ${fishingLevel}`, ['', `Progress: ${fishingXP}/${fishingLevelProgress} XP`, '', '§7Fishing XP is earned through', 'fishing and catching rare items'], 'minecraft:fishing_rod', 1)
        .button(15, `§eFarming Level`, ['', '§l§5COMING SOON'], 'minecraft:wheat', 1)
        .show(player).then(a => {
            if (a.canceled) return;
            switch (a.selection) {

            }
        })
}

/** @param {Player} player  */
export function codesMenu(player) {
    player["afkTimer"] = Date.now() + 350000
    new ModalFormData()
    .title('Codes')
    .label("Join §9discord.gg/HRGNN3pzQN§r to redeem the discord kit, as well as information on the latest codes and updates!!\n\n")
    .textField('Enter Code Here', 'Code')
    .show(player).then(a => {
        if (a.canceled) return;
        const code = a.formValues[1]

        switch (code) {
            case 'UNIVERSESKYBLOCK2026': {
                if (getPlayerDynamicProperty(player, 'UNIVERSESKYBLOCK2026')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, "coins", 7500, true)
                player.getComponent("inventory").container.addItem(new ItemStack("minecraft:iron_ingot", 3))

                setPlayerDynamicProperty(player, 'UNIVERSESKYBLOCK2026', 1)
                player.sendMessage("§aSuccessfully redeemed code §eUNIVERSESKYBLOCK2026§a!\n§r§a+§67500 coins\n§r§a+§f3 Iron Ingots")
                return player.playSound("random.levelup")
            }
            case 'NAISHO': { // you can only get this code from looking at this code file hahahahahaha open source
                if (getPlayerDynamicProperty(player, 'NAISHO')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, "coins", 15000, true)
                achieve(player, "That's a secret!")

                setPlayerDynamicProperty(player, 'NAISHO', 1)
                player.sendMessage("§aSuccessfully redeemed code §eNAISHO§a!\n§r§a+§615000 coins")
                return player.playSound("random.levelup")
            }
            case 'RELEASE': { // remember to remove this after like 2 weeks or something
                if (getPlayerDynamicProperty(player, 'RELEASE')) return player.sendMessage('§cYou already redeemed this code!')
                setPlayerDynamicProperty(player, "coins", 7500, true)

                setPlayerDynamicProperty(player, 'RELEASE', 1)
                player.sendMessage("§aSuccessfully redeemed code §eRELEASE§a!\n§r§a+§67500 coins")
                return player.playSound("random.levelup")
            }
            default: {
                return player.sendMessage('§cInvalid Code!')
            }
            
        }

    })
}
