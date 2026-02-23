import { world, system, ItemStack } from '@minecraft/server'

export const prices = {buy: {}, sell: {}}

// General Shop Items

prices.buy.lavaBucket = 1000
prices.sell.lavaBucket = 100

prices.buy.ice = 200
prices.sell.ice = 10

prices.buy.grassBlock = 1250
prices.sell.grassBlock = 10

prices.buy.dirt = 1000
prices.sell.dirt = 50

prices.buy.cobblestone = 8
prices.sell.cobblestone = 1

prices.buy.sand = 600
prices.sell.sand = 10

prices.buy.boneMeal = 100
prices.sell.boneMeal = 10

prices.buy.charcoal = 100
prices.sell.charcoal = 20

prices.buy.oakSapling = 1000
prices.sell.oakSapling = 8

prices.buy.oakLog = 200
prices.sell.oakLog = 15

prices.buy.darkOakSapling = 2500
prices.sell.darkOakSapling = 5

prices.buy.darkOakLog = 200
prices.sell.darkOakLog = 12

prices.buy.birchSapling = 1750
prices.sell.birchSapling = 10

prices.buy.birchLog = 200
prices.sell.birchLog = 15

prices.buy.coal = 100
prices.sell.coal = 15

prices.buy.copperIngot = 2000
prices.sell.copperIngot = 30

prices.buy.ironIngot = 4000
prices.sell.ironIngot = 70

prices.buy.goldIngot = 15000
prices.sell.goldIngot = 100

prices.buy.diamond = "§cN/A"
prices.sell.diamond = 250

prices.buy.quartzCrystal = "§cN/A"
prices.sell.quartzCrystal = 1

prices.buy.padparadscha = "§cN/A"
prices.sell.padparadscha = 1

// Farm shop items

prices.buy.wheat = 250
prices.sell.wheat = 5

prices.buy.wheatSeeds = 500
prices.sell.wheatSeeds = 20

prices.buy.potato = 1000
prices.sell.potato = 20

prices.buy.sugarCane = 5000
prices.sell.sugarCane = 30

// Fishing shop items

prices.buy.basicRod = 250
prices.sell.basicRod = "§cN/A"

prices.buy.rawCod = 50
prices.sell.rawCod = 10

prices.buy.rawSalmon = 50
prices.sell.rawSalmon = 12

prices.buy.tropicalFish = 100
prices.sell.tropicalFish = 20

prices.buy.inkSac = 250
prices.sell.inkSac = 12

prices.buy.cherrySapling = "§cN/A"
prices.sell.cherrySapling = 10

prices.buy.cherryLog = "§cN/A"
prices.sell.cherryLog = 12

prices.buy.prismarineShard = "§cN/A"
prices.sell.prismarineShard = 1750

prices.buy.blubber = 500
prices.sell.blubber = 40 // some kind of item like "reinforced blubber" thats a slimeblock made of this stuff and used for future crafting recipes like armor or diving armor idk

// Building shop items

prices.buy.bricks = 100
prices.sell.bricks = "§cN/A"

prices.buy.gravel = 1000
prices.sell.gravel = "§cN/A"

prices.buy.scaffolding = 250
prices.sell.scaffolding = "§cN/A"

prices.buy.moss = 800
prices.sell.moss = "§cN/A"

prices.buy.glass = 100
prices.sell.glass = "§cN/A"

prices.buy.concretePowder = 100
prices.sell.concretePowder = "§cN/A"

prices.buy.wool = 100
prices.sell.wool = "§cN/A"

prices.buy.stainedGlass = 100
prices.sell.stainedGlass = "§cN/A"

prices.buy.coral = 500
prices.sell.coral = "§cN/A"