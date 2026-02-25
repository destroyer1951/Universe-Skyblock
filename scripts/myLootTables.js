import { items } from './items.js'

// Fishing loot tables

export const basicRodLootTable = [
    { item: () => items.rawCod, weight: 40 },
    { item: () => items.rawSalmon, weight: 25 },
    { item: () => items.tropicalFish, weight: 12 },
    { item: () => items.cherryLog, weight: 9 },
    { item: () => items.inkSac, weight: 8 },
    { item: () => items.copperIngot, weight: 2 },
    { item: () => items.prismarineShard, weight: .8 },
]

export const inkRodLootTable = [
    { item: () => items.inkSac, weight: 85 },
    { item: () => items.coal, weight: 5 },
    { item: () => items.prismarineShard, weight: 1 },
]

export const whaleRodLootTable = [
    { item: () => items.rawCod, weight: 17 },
    { item: () => {const item = items.rawCod.clone(); item.amount = 2; return item}, weight: 15 },
    { item: () => {const item = items.rawCod.clone(); item.amount = 3; return item}, weight: 8 },
    { item: () => items.rawSalmon, weight: 20 },
    { item: () => {const item = items.rawSalmon.clone(); item.amount = 2; return item}, weight: 15 },
    { item: () => items.inkSac, weight: 12 },
    { item: () => items.blubber, weight: 25 },
    { item: () => items.prismarineShard, weight: 2 },
] // remember to add cherry saplings into the next fishing rod loot table brotha


// Pickaxe loot tables

export const defaultPickaxeLootTable = [
    { item: () => "minecraft:air", weight: 93 },
    { item: () => "minecraft:coal_ore", weight: 7 },
    { item: () => "minecraft:iron_ore", weight: 0.18 },
]

export const coalPickaxeLootTable = [
    { item: () => "minecraft:air", weight: 85 },
    { item: () => "minecraft:coal_ore", weight: 10 },
    { item: () => "minecraft:iron_ore", weight: 0.23 },
]

export const densePickaxeLootTable = [
    { item: () => "minecraft:air", weight: 40 },
    { item: () => "minecraft:granite", weight: 10 },
    { item: () => "minecraft:andesite", weight: 10 },
    { item: () => "minecraft:diorite", weight: 10 },
]

export const hybridPickaxeLootTable = [
    { item: () => "minecraft:air", weight: 35 },
    { item: () => "minecraft:coal_ore", weight: 5 },
    { item: () => "minecraft:iron_ore", weight: 0.27 },
    { item: () => "minecraft:granite", weight: 10 },
    { item: () => "minecraft:andesite", weight: 10 },
    { item: () => "minecraft:diorite", weight: 10 },
]

export const ironPickaxeLootTable = [
    { item: () => "minecraft:air", weight: 50 },
    { item: () => "minecraft:coal_ore", weight: 15 },
    { item: () => "minecraft:copper_ore", weight: 3 },
    { item: () => "minecraft:iron_ore", weight: 1 },
    { item: () => "minecraft:gold_ore", weight: 0.1 },
]

export const unstablePickaxeLootTable = [
    { item: () => "minecraft:air", weight: 99 },
    { item: () => "minecraft:coal_ore", weight: 0.06 },
    { item: () => "minecraft:copper_ore", weight: 0.06 },
    { item: () => "minecraft:iron_ore", weight: 0.06 },
    { item: () => "minecraft:gold_ore", weight: 0.06 },
    { item: () => "minecraft:diamond_ore", weight: 0.06 },
]
