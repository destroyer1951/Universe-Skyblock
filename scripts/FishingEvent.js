import { world, system, EntityComponentTypes, EquipmentSlot } from '@minecraft/server';

export const FishingResult = Object.freeze({
    None: 'none',
    Missed: 'missed',
    Success: 'success',
    AttachedToEntity: 'attachedToEntity'
});

class FishingEventInstance {
    #hook; #hookLocation; #isInWater = false;
    #hookTime; #removedTime;
    #source; #beforeItemStack;
    #spawnedItems = []; #attachedToEntity = null;
    #fishingResult = FishingResult.None;
    #run; #initialized;
    constructor(hook) {
        this.#hook = hook; this.#hookTime = Date.now();
        system.runTimeout(() => { if (!this.#hook || !this.#source) this.#cleanup(); }, 5);
    }
    get hook() { return this.#hook; }
    setSource(player) {
        if (this.#source || Date.now() - this.#hookTime > 5) return;
        this.#source = player; this.#beforeItemStack = this.#source.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand); 
        this.#startLoop();
    }
    setAttachedEntity(entity) { this.#attachedToEntity = entity; }
    manageLoot(entity) {
        if (!this.#hook.isValid && Date.now() - this.#removedTime <= 5
        && Math.abs(entity.location.x - this.#hookLocation.x) <= 2.5 && Math.abs(entity.location.z - this.#hookLocation.z) <= 2.5
        ) this.#spawnedItems.push(entity.getComponent('minecraft:item')?.itemStack);
    }
    #startLoop() {
        if (!this.#initialized) {
            this.#initialized = true;
            if (FishingEvent['playerStartFishing'].subscribers.size) {
                FishingEventManager.triggerEvent({
                    player: this.#source,
                    itemStack: this.#beforeItemStack,
                    fishingHook: this.#hook
                }, 'playerStartFishing');
            }
            if (!FishingEvent['playerReleaseFishing'].subscribers.size) this.#cleanup();
        }
        this.#run = system.runInterval(async () => {
            if (this.#hook?.isValid) {
                if (!this.#isInWater) this.#isInWater = this.#hook.isInWater;
                this.#hookLocation = this.#hook.location; return;
            }
            this.#removedTime = Date.now();
            await system.waitTicks(1);
            this.#fishingResult = this.#attachedToEntity ? FishingResult.AttachedToEntity
            : this.#spawnedItems.length ? FishingResult.Success
            : this.#isInWater ? FishingResult.Missed
            : FishingResult.None;
            FishingEventManager.triggerEvent({
                player: this.#source,
                beforeItemStack: this.#beforeItemStack,
                attachedToEntity: this.#attachedToEntity,
                fishingInfo: {
                    result: this.#fishingResult,
                    fishedItems: this.#spawnedItems,
                    location: this.#hookLocation,
                    duration: Math.floor((Date.now() - this.#hookTime)/50)
                }
            }, 'playerReleaseFishing'); this.#cleanup();
        });
    }
    #cleanup() { if (this.#run) { system.clearRun(this.#run); } FishingEventManager.removeInstance(this); }
}

class FishingEventManager {
    static _activeInstances = new Set();
    static _entitySpawnCallback = ({ entity }) => {
        if (!entity?.isValid) return;
        if (entity.typeId === 'minecraft:fishing_hook') FishingEventManager._activeInstances.add(new FishingEventInstance(entity));
        else if (entity.hasComponent(EntityComponentTypes.Item)) FishingEventManager._activeInstances.forEach(inst => inst.manageLoot(entity));
    }
    static _itemUseCallback = ({ source, itemStack }) => {
        if (source?.isValid && itemStack.typeId === 'minecraft:fishing_rod') { for (const inst of FishingEventManager._activeInstances) inst.setSource(source); }
    }
    static _projectileHitEntityCallback = (data) => {
        const { entity } = data.getEntityHit();
        if (!data.projectile.isValid || !entity.isValid) return;
        for (const inst of FishingEventManager._activeInstances) if (inst.hook?.id === data.projectile?.id) inst.setAttachedEntity(entity);
    }
    static triggerEvent(data, eventName) { FishingEvent[eventName].subscribers.forEach(cb => cb(data)); }
    static removeInstance(instance) { FishingEventManager._activeInstances.delete(instance); }
    static _updateSubscriptions(eventName) {
        if (!FishingEvent[eventName].subscribers.size && !FishingEventManager._activeInstances.size) {
            world.afterEvents.entitySpawn.unsubscribe(FishingEventManager._entitySpawnCallback);
            world.afterEvents.itemUse.unsubscribe(FishingEventManager._itemUseCallback);
            if (eventName !== 'playerStartFishing') world.afterEvents.projectileHitEntity.unsubscribe(FishingEventManager._projectileHitEntityCallback);
        } else {
            world.afterEvents.entitySpawn.subscribe(FishingEventManager._entitySpawnCallback);
            world.afterEvents.itemUse.subscribe(FishingEventManager._itemUseCallback);
            if (eventName !== 'playerStartFishing') world.afterEvents.projectileHitEntity.subscribe(FishingEventManager._projectileHitEntityCallback);
        }
    }
}

class FishingEvents {
    #createEvent(eventName) {
        return {
            subscribers: new Set(),
            subscribe: cb => {
                this[eventName].subscribers.add(cb);
                FishingEventManager._updateSubscriptions(eventName); return cb;
            },
            unsubscribe: cb => {
                this[eventName].subscribers.delete(cb);
                FishingEventManager._updateSubscriptions(eventName);
            }
        }
    }
    playerStartFishing = this.#createEvent('playerStartFishing');
    playerReleaseFishing = this.#createEvent('playerReleaseFishing');
}

export const FishingEvent = new FishingEvents();