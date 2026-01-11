import { items } from './items.js'

// Fishing loot tables

export const basicRodLootTable = [
    { item: () => items.rawCod, weight: 50 },
    { item: () => items.rawSalmon, weight: 30 },
    { item: () => items.tropicalFish, weight: 15 },
    { item: () => items.cherryLog, weight: 9 },
    { item: () => items.inkSac, weight: 5 },
    { item: () => items.copperIngot, weight: 1 },
    { item: () => items.prismarineShard, weight: 0.2 },
]

export const inkRodLootTable = [
    { item: () => items.inkSac, weight: 95 },
    { item: () => items.coal, weight: 5 },
    { item: () => items.prismarineShard, weight: 0.3 },
]

export const whaleRodLootTable = [
    { item: () => {const item = items.rawCod.clone(); item.amount = 3; return item}, weight: 40 },
    { item: () => {const item = items.rawSalmon.clone(); item.amount = 2; return item}, weight: 35 },
    { item: () => items.inkSac, weight: 20 },
    { item: () => items.blubber, weight: 20 },
]


// Pickaxe loot tables

export const defaultPickaxeLootTable = [
    { item: () => "minecraft:air", weight: 93 },
    { item: () => "minecraft:coal_ore", weight: 7 },
    { item: () => "minecraft:iron_ore", weight: 0.1 },
]

export const coalPickaxeLootTable = [
    { item: () => "minecraft:air", weight: 85 },
    { item: () => "minecraft:coal_ore", weight: 10 },
    { item: () => "minecraft:iron_ore", weight: 0.15 },
]
