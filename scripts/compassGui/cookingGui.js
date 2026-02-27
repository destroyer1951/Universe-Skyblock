import { world, system, ItemStack, Player } from '@minecraft/server'
import { ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from '../extensions/forms.js';

import { items, makeItem, rollStars } from '../items.js'
import { prices } from '../prices.js'
import { getPlayerDynamicProperty, setPlayerDynamicProperty, getGlobalDynamicProperty, setGlobalDynamicProperty, getScore, setScore, setStat } from '../stats.js'
import { checkItemAmount, checkInvEmpty, clearItem, getFreeSlots, rollWeightedItem, xpRequirements, achieve } from '../index.js'