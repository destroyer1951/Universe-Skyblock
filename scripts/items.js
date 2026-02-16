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

export function itemFactory() {

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
        //item.nameTag = "§r§fDiamond"
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
    items.blubber = makeItem("minecraft:slime_ball", item => {
        item.nameTag = "§r§fBlubber"
    })

    Object.defineProperty(items, "prismarineShard", {
        get() {
            return makeItem("minecraft:prismarine_shard", item => {
                item.nameTag = "§r§fPrismarine Shard"
                item.setLore([`§r§e${rollStars()}`])
            })
        }
    })

    // Building shop items

    items.bricks = makeItem("minecraft:brick_block", item => {})
    items.gravel = makeItem("minecraft:gravel", item => {})
    items.scaffolding = makeItem("minecraft:scaffolding", item => {})
    items.moss = makeItem("minecraft:moss_block", item => {})
    items.glass = makeItem("minecraft:glass", item => {})


    items.whiteConcretePowder = makeItem("minecraft:white_concrete_powder", item => {})
    items.orangeConcretePowder = makeItem("minecraft:orange_concrete_powder", item => {})
    items.magentaConcretePowder = makeItem("minecraft:magenta_concrete_powder", item => {})
    items.lightBlueConcretePowder = makeItem("minecraft:light_blue_concrete_powder", item => {})
    items.yellowConcretePowder = makeItem("minecraft:yellow_concrete_powder", item => {})
    items.limeConcretePowder = makeItem("minecraft:lime_concrete_powder", item => {})
    items.pinkConcretePowder = makeItem("minecraft:pink_concrete_powder", item => {})
    items.grayConcretePowder = makeItem("minecraft:gray_concrete_powder", item => {})
    items.lightGrayConcretePowder = makeItem("minecraft:light_gray_concrete_powder", item => {})
    items.cyanConcretePowder = makeItem("minecraft:cyan_concrete_powder", item => {})
    items.purpleConcretePowder = makeItem("minecraft:purple_concrete_powder", item => {})
    items.blueConcretePowder = makeItem("minecraft:blue_concrete_powder", item => {})
    items.brownConcretePowder = makeItem("minecraft:brown_concrete_powder", item => {})
    items.greenConcretePowder = makeItem("minecraft:green_concrete_powder", item => {})
    items.redConcretePowder = makeItem("minecraft:red_concrete_powder", item => {})
    items.blackConcretePowder = makeItem("minecraft:black_concrete_powder", item => {})


    items.whiteWool = makeItem("minecraft:white_wool", item => {})
    items.orangeWool = makeItem("minecraft:orange_wool", item => {})
    items.magentaWool = makeItem("minecraft:magenta_wool", item => {})
    items.lightBlueWool = makeItem("minecraft:light_blue_wool", item => {})
    items.yellowWool = makeItem("minecraft:yellow_wool", item => {})
    items.limeWool = makeItem("minecraft:lime_wool", item => {})
    items.pinkWool = makeItem("minecraft:pink_wool", item => {})
    items.grayWool = makeItem("minecraft:gray_wool", item => {})
    items.lightGrayWool = makeItem("minecraft:light_gray_wool", item => {})
    items.cyanWool = makeItem("minecraft:cyan_wool", item => {})
    items.purpleWool = makeItem("minecraft:purple_wool", item => {})
    items.blueWool = makeItem("minecraft:blue_wool", item => {})
    items.brownWool = makeItem("minecraft:brown_wool", item => {})
    items.greenWool = makeItem("minecraft:green_wool", item => {})
    items.redWool = makeItem("minecraft:red_wool", item => {})
    items.blackWool = makeItem("minecraft:black_wool", item => {})


    items.whiteStainedGlass = makeItem("minecraft:white_stained_glass", item => {});
    items.orangeStainedGlass = makeItem("minecraft:orange_stained_glass", item => {});
    items.magentaStainedGlass = makeItem("minecraft:magenta_stained_glass", item => {});
    items.lightBlueStainedGlass = makeItem("minecraft:light_blue_stained_glass", item => {});
    items.yellowStainedGlass = makeItem("minecraft:yellow_stained_glass", item => {});
    items.limeStainedGlass = makeItem("minecraft:lime_stained_glass", item => {});
    items.pinkStainedGlass = makeItem("minecraft:pink_stained_glass", item => {});
    items.grayStainedGlass = makeItem("minecraft:gray_stained_glass", item => {});
    items.lightGrayStainedGlass = makeItem("minecraft:light_gray_stained_glass", item => {});
    items.cyanStainedGlass = makeItem("minecraft:cyan_stained_glass", item => {});
    items.purpleStainedGlass = makeItem("minecraft:purple_stained_glass", item => {});
    items.blueStainedGlass = makeItem("minecraft:blue_stained_glass", item => {});
    items.brownStainedGlass = makeItem("minecraft:brown_stained_glass", item => {});
    items.greenStainedGlass = makeItem("minecraft:green_stained_glass", item => {});
    items.redStainedGlass = makeItem("minecraft:red_stained_glass", item => {});
    items.blackStainedGlass = makeItem("minecraft:black_stained_glass", item => {});


    items.tubeCoralBlock = makeItem("minecraft:tube_coral_block", item => {});
    items.tubeCoral = makeItem("minecraft:tube_coral", item => {});
    items.tubeCoralFan = makeItem("minecraft:tube_coral_fan", item => {});

    items.brainCoralBlock = makeItem("minecraft:brain_coral_block", item => {});
    items.brainCoral = makeItem("minecraft:brain_coral", item => {});
    items.brainCoralFan = makeItem("minecraft:brain_coral_fan", item => {});

    items.bubbleCoralBlock = makeItem("minecraft:bubble_coral_block", item => {});
    items.bubbleCoral = makeItem("minecraft:bubble_coral", item => {});
    items.bubbleCoralFan = makeItem("minecraft:bubble_coral_fan", item => {});

    items.fireCoralBlock = makeItem("minecraft:fire_coral_block", item => {});
    items.fireCoral = makeItem("minecraft:fire_coral", item => {});
    items.fireCoralFan = makeItem("minecraft:fire_coral_fan", item => {});

    items.hornCoralBlock = makeItem("minecraft:horn_coral_block", item => {});
    items.hornCoral = makeItem("minecraft:horn_coral", item => {});
    items.hornCoralFan = makeItem("minecraft:horn_coral_fan", item => {});





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

    Object.defineProperty(items, "whaleRod", { // credit to my goat Enzo for this item and recipe
        get() {
            return makeItem("minecraft:fishing_rod", item => {
                const stars = rollStars()
                const starCount = (stars.match(/\*/g) || []).length
                item.nameTag = "§r§fWhale Rod"
                item.setLore(["", `§r§7Luck: §a${(starCount*0.5).toFixed(1)}`, '', `§r§e${stars}`])
            })
        }
    })

    items.denseStone = makeItem("minecraft:stone_bricks", item => {
        item.nameTag = "§r§fDense Stone"
    })

    Object.defineProperty(items, "densePickaxe", {
        get() {
            return makeItem("minecraft:stone_pickaxe", item => {
                const stars = rollStars()
                const starCount = (stars.match(/\*/g) || []).length
                item.nameTag = "§r§fDense Pickaxe"
                item.setLore(["", `§r§7Luck: §a${(starCount*0.01).toFixed(2)}`, '', `§r§e${stars}`])
            })
        }
    })

    Object.defineProperty(items, "hybridPickaxe", {
        get() {
            return makeItem("minecraft:stone_pickaxe", item => {
                const stars = rollStars()
                const starCount = (stars.match(/\*/g) || []).length
                item.nameTag = "§r§fHybrid Pickaxe"
                item.setLore(["", `§r§7Luck: §a${(starCount*0.15).toFixed(2)}`, '', `§r§e${stars}`])
            })
        }
    })

    Object.defineProperty(items, "ironPickaxe", {
        get() {
            return makeItem("minecraft:iron_pickaxe", item => {
                const stars = rollStars()
                const starCount = (stars.match(/\*/g) || []).length
                item.nameTag = "§r§7Iron Pickaxe"
                item.setLore(["", `§r§7Luck: §a${(starCount*0.3).toFixed(1)}`, '', `§r§e${stars}`])
            })
        }
    })

})
