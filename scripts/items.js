import { world, system, ItemStack } from '@minecraft/server'

export function makeItem(typeId, configure) { // i wrote this code and i dont even understand it anymore am i the best developer of all time
  const item = new ItemStack(typeId)
  configure(item)
  return item
}

export function rollStars(maxStars=5) {
    let stars = 1
    let starString = "§l"

    for (let i = 2; i <= maxStars; i++) {
        if (Math.random() < 1 / i) {
            stars++
        } else {
            break
        }
  }

    for (let i = stars; i > 0; i--) {
        starString += "* "
    }

    return starString.trim()
}

export const items = {}
system.run(() => {
    // General shop items
    items.lavaBucket = makeItem("minecraft:lava_bucket", item => {
        //item.nameTag = "§r§fLava Bucket"
    })
    items.ice = makeItem("minecraft:ice", item => {
        //item.nameTag = "§r§fIce"
    })
    items.oakLog = makeItem("minecraft:oak_log", item => {
        //item.nameTag = "§r§fOak Log"
    })
    items.grassBlock = makeItem("minecraft:grass_block", item => {
        //item.nameTag = "§r§fGrass Block"
    })
    items.dirt = makeItem("minecraft:dirt", item => {
        //item.nameTag = "§r§fDirt"
    })
    items.cobblestone = makeItem("minecraft:cobblestone", item => {
        //item.nameTag = "§r§fCobblestone"
    })
    items.sand = makeItem("minecraft:sand", item => {
        //item.nameTag = "§r§fSand"
    })
    items.boneMeal = makeItem("minecraft:bone_meal", item => {
        //item.nameTag = "§r§fBone Meal"
    })
    items.charcoal = makeItem("minecraft:charcoal", item => {
        //item.nameTag = "§r§fCharcoal"
    })
    items.oakSapling = makeItem("minecraft:oak_sapling", item => {
        //item.nameTag = "§r§fOak Sapling"
    })
    items.darkOakSapling = makeItem("minecraft:dark_oak_sapling", item => {
        //item.nameTag = "§r§fDark Oak Sapling"
    })
    items.darkOakLog = makeItem("minecraft:dark_oak_log", item => {
        //item.nameTag = "§r§fDark Oak Log"
    })
    items.birchSapling = makeItem("minecraft:birch_sapling", item => {
        //item.nameTag = "§r§fBirch Sapling"
    })
    items.birchLog = makeItem("minecraft:birch_log", item => {
        //item.nameTag = "§r§fBirch Log"
    })
    items.coal = makeItem("minecraft:coal", item => {
        //item.nameTag = "§r§fCoal"
    })
    items.copperIngot = makeItem("minecraft:copper_ingot", item => {
        //item.nameTag = "§r§fCopper Ingot"
    })
    items.ironIngot = makeItem("minecraft:iron_ingot", item => {
        //item.nameTag = "§r§fIron Ingot"
    })
    items.goldIngot = makeItem("minecraft:gold_ingot", item => {
        //item.nameTag = "§r§fGold Ingot"
    })
    items.diamond = makeItem("minecraft:diamond", item => {
        item.nameTag = "§r§fDiamond"
    })
    items.quartzCrystal = makeItem("minecraft:quartz", item => {
        item.nameTag = "§r§fQuartz Crystal"
        item.setLore(["", "§r§8Both exceptionally shiny", "§r§8and exceptionally sharp", "", `§r§e${rollStars()}`])
    })

    Object.defineProperty(items, "padparadscha", {
        get() {
            return makeItem("minecraft:resin_brick", item => {
                item.nameTag = "§r§fPadparadscha"
                item.setLore(["", "§r§8A powerful gemstone,", "§r§8in difficulty and durability", "", `§r§e${rollStars()}`])
            })
        }
    })

    // Farm shop items

    items.wheat = makeItem("minecraft:wheat", item => {
        //item.nameTag = "§r§fWheat"
    })
    items.wheatSeeds = makeItem("minecraft:wheat_seeds", item => {
        //item.nameTag = "§r§fWheat Seeds"
    })
    items.potato = makeItem("minecraft:potato", item => {
        //item.nameTag = "§r§fPotato"
    })
    items.sugarCane = makeItem("minecraft:sugar_cane", item => {
        //item.nameTag = "§r§fSugar Cane"
    })

    // Fishing shop items

    Object.defineProperty(items, "basicRod", {
        get() {
            return makeItem("minecraft:fishing_rod", item => {
                const stars = rollStars()
                const starCount = (stars.match(/\*/g) || []).length
                item.nameTag = "§r§fBasic Fishing Rod"
                item.setLore(["", `§r§7Luck: §a${(starCount*0.2).toFixed(1)}`, "", "§r§8It's not much but", "§r§8it gets the job done", '', `§r§e${stars}`])
            })
        }
    })

    items.rawCod = makeItem("minecraft:cod", item => {
        //item.nameTag = "§r§fRaw Cod"
    })
    items.rawSalmon = makeItem("minecraft:salmon", item => {
        //item.nameTag = "§r§fRaw Salmon"
    })
    items.tropicalFish = makeItem("minecraft:tropical_fish", item => {
        //item.nameTag = "§r§fTropical Fish"
    })
    items.inkSac = makeItem("minecraft:ink_sac", item => {
        //item.nameTag = "§r§fInk Sac"
    })
    items.cherrySapling = makeItem("minecraft:cherry_sapling", item => {
        //item.nameTag = "§r§fCherry Sapling"
    })
    items.cherryLog = makeItem("minecraft:cherry_log", item => {
        //item.nameTag = "§r§fCherry Log"
    })

    Object.defineProperty(items, "prismarineShard", {
        get() {
            return makeItem("minecraft:prismarine_shard", item => {
                item.nameTag = "§r§fPrismarine Shard"
                item.setLore([`§r§e${rollStars()}`])
            })
        }
    })


// Custom Crafting items

Object.defineProperty(items, "inkRod", {
        get() {
            return makeItem("minecraft:fishing_rod", item => {
                const stars = rollStars()
                const starCount = (stars.match(/\*/g) || []).length
                item.nameTag = "§r§fInk Rod"
                item.setLore(["", `§r§7Luck: §a${(starCount*0.4).toFixed(1)}`, '', `§r§e${stars}`])
            })
        }
    })
})

Object.defineProperty(items, "coalPickaxe", {
    get() {
        return makeItem("minecraft:stone_pickaxe", item => {
            const stars = rollStars()
            const starCount = (stars.match(/\*/g) || []).length
            item.nameTag = "§r§fCoal Pickaxe"
            item.setLore(["", `§r§7Luck: §a${(starCount*0.2).toFixed(1)}`, '', `§r§e${stars}`])
        })
    }
})

Object.defineProperty(items, "whaleRod", {
    get() {
        return makeItem("minecraft:fishing_rod", item => {
            const stars = rollStars()
            const starCount = (stars.match(/\*/g) || []).length
            item.nameTag = "§r§fWhale Rod"
            item.setLore(["", `§r§7Luck: §a${(starCount*0.5).toFixed(1)}`, '', `§r§e${stars}`])
        })
    }
})