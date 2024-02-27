const _i = Citizen.pointerValueInt();
const _f = Citizen.pointerValueFloat();
const _v = Citizen.pointerValueVector();
const _r = Citizen.returnResultAnyway();
const _ri = Citizen.resultAsInteger();
const _rf = Citizen.resultAsFloat();
const _rl = Citizen.resultAsLong();
const _s = Citizen.resultAsString();
const _rv = Citizen.resultAsVector();
const _ro = Citizen.resultAsObject2();
const _in = Citizen.invokeNativeByHash;
const _ii = Citizen.pointerValueIntInitialized;
const _fi = Citizen.pointerValueFloatInitialized;
function _ch(hash) {
	if (typeof hash === 'string') {
		return global.GetHashKey(hash);
	}

	return hash;
}

function _obj(obj) {
	const s = msgpack_pack(obj);
	return [s, s.length];
}

function _ts(num) {
	if (num === 0 || num === null || num === undefined || num === false) { // workaround for users calling string parameters with '0', also nil being translated
		return null;
	}
	if (ArrayBuffer.isView(num) || num instanceof ArrayBuffer) { // these are handled as strings internally
		return num;
	}
	return num.toString();
}
function _fv(flt) {
	return (flt === 0.0) ? flt : (flt + 0.0000001);
}

function _mfr(fn) {
	return Citizen.makeRefFunction(fn);
}

const _ENV = null;

/**
 * Adds a rectangular blip for the specified coordinates/area.
 * It is recommended to use [SET_BLIP_ROTATION](#\_0xF87683CDF73C3F6E) and [SET_BLIP_COLOUR](#\_0x03D7FB09E75D6B7E) to make the blip not rotate along with the camera.
 * By default, the blip will show as a *regular* blip with the specified color/sprite if it is outside of the minimap view.
 * Example image:
 * ![minimap](https://i.imgur.com/qLbXWcQ.png)
 * ![big map](https://i.imgur.com/0j7O7Rh.png)
 * (Native name is *likely* to actually be ADD_BLIP_FOR_AREA, but due to the usual reasons this can't be confirmed)
 * @param x The X coordinate of the center of the blip.
 * @param y The Y coordinate of the center of the blip.
 * @param z The Z coordinate of the center of the blip.
 * @param width The width of the blip.
 * @param height The height of the blip.
 * @return A handle to the blip.
 */
global.AddBlipForArea = function (x, y, z, width, height) {
	return _in(0x00000000, 0x6228f159, _fv(x), _fv(y), _fv(z), _fv(width), _fv(height), _r, _ri);
};

/**
 * Creates a blip for the specified coordinates. You can use `SET_BLIP_` natives to change the blip.
 * @param x The X coordinate to create the blip on.
 * @param y The Y coordinate.
 * @param z The Z coordinate.
 * @return A blip handle.
 */
global.AddBlipForCoord = function (x, y, z) {
	return _in(0x00000000, 0xc6f43d0e, _fv(x), _fv(y), _fv(z), _r, _ri);
};

/**
 * Create a blip that by default is red (enemy), you can use [SET_BLIP_AS_FRIENDLY](#\_0xC6F43D0E) to make it blue (friend).\
 * Can be used for objects, vehicles and peds.
 * Example of enemy:
 * ![enemy](https://i.imgur.com/fl78svv.png)
 * Example of friend:
 * ![friend](https://i.imgur.com/Q16ho5d.png)
 * @param entity The entity handle to create the blip.
 * @return A blip handle.
 */
global.AddBlipForEntity = function (entity) {
	return _in(0x00000000, 0x30822554, entity, _r, _ri);
};

/**
 * Create a blip with a radius for the specified coordinates (it doesnt create the blip sprite, so you need to use [AddBlipCoords](#\_0xC6F43D0E))
 * Example image:
 * ![example](https://i.imgur.com/9hQl3DB.png)
 * @param posX The x position of the blip (you can also send a vector3 instead of the bulk coordinates)
 * @param posY The y position of the blip (you can also send a vector3 instead of the bulk coordinates)
 * @param posZ The z position of the blip (you can also send a vector3 instead of the bulk coordinates)
 * @param radius The number that defines the radius of the blip circle
 * @return The blip handle that can be manipulated with every `SetBlip` natives
 */
global.AddBlipForRadius = function (posX, posY, posZ, radius) {
	return _in(0x00000000, 0x4626756c, _fv(posX), _fv(posY), _fv(posZ), _fv(radius), _r, _ri);
};

/**
 * Applies an Item from a PedDecorationCollection to a ped. These include tattoos and shirt decals.
 * collection - PedDecorationCollection filename hash
 * overlay - Item name hash
 * Example:
 * Entry inside "mpbeach_overlays.xml" -
 * <Item>
 * <uvPos x="0.500000" y="0.500000" />
 * <scale x="0.600000" y="0.500000" />
 * <rotation value="0.000000" />
 * <nameHash>FM_Hair_Fuzz</nameHash>
 * <txdHash>mp_hair_fuzz</txdHash>
 * <txtHash>mp_hair_fuzz</txtHash>
 * <zone>ZONE_HEAD</zone>
 * <type>TYPE_TATTOO</type>
 * <faction>FM</faction>
 * <garment>All</garment>
 * <gender>GENDER_DONTCARE</gender>
 * <award />
 * <awardLevel />
 * </Item>
 * Code:
 * PED::_0x5F5D1665E352A839(PLAYER::PLAYER_PED_ID(), MISC::GET_HASH_KEY("mpbeach_overlays"), MISC::GET_HASH_KEY("fm_hair_fuzz"))
 */
global.AddPedDecorationFromHashes = function (ped, collection, overlay) {
	return _in(0x00000000, 0x70559ac7, ped, _ch(collection), _ch(overlay));
};

/**
 * Adds a handler for changes to a state bag.
 * The function called expects to match the following signature:
 * ```ts
 * function StateBagChangeHandler(bagName: string, key: string, value: any, reserved: number, replicated: boolean);
 * ```
 * *   **bagName**: The internal bag ID for the state bag which changed. This is usually `player:Source`, `entity:NetID`
 * or `localEntity:Handle`.
 * *   **key**: The changed key.
 * *   **value**: The new value stored at key. The old value is still stored in the state bag at the time this callback executes.
 * *   **reserved**: Currently unused.
 * *   **replicated**: Whether the set is meant to be replicated.
 * At this time, the change handler can't opt to reject changes.
 * If bagName refers to an entity, use [GET_ENTITY_FROM_STATE_BAG_NAME](?\_0x4BDF1868) to get the entity handle
 * If bagName refers to a player, use [GET_PLAYER_FROM_STATE_BAG_NAME](?\_0xA56135E0) to get the player handle
 * @param keyFilter The key to check for, or null for no filter.
 * @param bagFilter The bag ID to check for such as `entity:65535`, or null for no filter.
 * @param handler The handler function.
 * @return A cookie to remove the change handler.
 */
global.AddStateBagChangeHandler = function (keyFilter, bagFilter, handler) {
	return _in(0x00000000, 0x5ba35aaf, _ts(keyFilter), _ts(bagFilter), _mfr(handler), _r, _ri);
};

/**
 * Applies a force to the specified entity.
 * **List of force types (p1)**:
 * ```
 * public enum ForceType
 * {
 * MinForce = 0,
 * MaxForceRot = 1,
 * MinForce2 = 2,
 * MaxForceRot2 = 3,
 * ForceNoRot = 4,
 * ForceRotPlusForce = 5
 * }
 * ```
 * Research/documentation on the gtaforums can be found [here](https://gtaforums.com/topic/885669-precisely-define-object-physics/) and [here](https://gtaforums.com/topic/887362-apply-forces-and-momentums-to-entityobject/).
 * @param entity The entity you want to apply a force on
 * @param forceType See native description above for a list of commonly used values
 * @param x Force amount (X)
 * @param y Force amount (Y)
 * @param z Force amount (Z)
 * @param offX Rotation/offset force (X)
 * @param offY Rotation/offset force (Y)
 * @param offZ Rotation/offset force (Z)
 * @param boneIndex (Often 0) Entity bone index
 * @param isDirectionRel (Usually false) Vector defined in local (body-fixed) coordinate frame
 * @param ignoreUpVec (Usually true)
 * @param isForceRel (Usually true) When true, force gets multiplied with the objects mass and different objects will have the same acceleration
 * @param p12 (Usually false)
 * @param p13 (Usually true)
 */
global.ApplyForceToEntity = function (entity, forceType, x, y, z, offX, offY, offZ, boneIndex, isDirectionRel, ignoreUpVec, isForceRel, p12, p13) {
	return _in(0x00000000, 0xc1c0855a, entity, forceType, _fv(x), _fv(y), _fv(z), _fv(offX), _fv(offY), _fv(offZ), boneIndex, isDirectionRel, ignoreUpVec, isForceRel, p12, p13);
};

/**
 * Returns whether or not the specified player has enough information to start a commerce session for.
 * @param playerSrc The player handle
 * @return True or false.
 */
global.CanPlayerStartCommerceSession = function (playerSrc) {
	return _in(0x00000000, 0x429461c3, _ts(playerSrc), _r);
};

/**
 * Cancels the currently executing event.
 */
global.CancelEvent = function () {
	return _in(0x00000000, 0xfa29d35d);
};

/**
 * CLEAR_PED_PROP
 * @param ped The ped handle.
 * @param propId The prop id you want to clear from the ped. Refer to [SET_PED_PROP_INDEX](#\_0x93376B65A266EB5F).
 */
global.ClearPedProp = function (ped, propId) {
	return _in(0x00000000, 0x2d23d743, ped, propId);
};

/**
 * CLEAR_PED_SECONDARY_TASK
 */
global.ClearPedSecondaryTask = function (ped) {
	return _in(0x00000000, 0xa635f451, ped);
};

/**
 * Clear a ped's tasks. Stop animations and other tasks created by scripts.
 * @param ped Ped id. Use PlayerPedId() for your own character.
 */
global.ClearPedTasks = function (ped) {
	return _in(0x00000000, 0xde3316ab, ped);
};

/**
 * Immediately stops the pedestrian from whatever it's doing. The difference between this and [CLEAR_PED_TASKS](#\_0xE1EF3C1216AFF2CD) is that this one teleports the ped but does not change the position of the ped.
 * @param ped Ped id.
 */
global.ClearPedTasksImmediately = function (ped) {
	return _in(0x00000000, 0xbc045625, ped);
};

/**
 * This executes at the same as speed as PLAYER::SET_PLAYER_WANTED_LEVEL(player, 0, false);
 * PLAYER::GET_PLAYER_WANTED_LEVEL(player); executes in less than half the time. Which means that it's worth first checking if the wanted level needs to be cleared before clearing. However, this is mostly about good code practice and can important in other situations. The difference in time in this example is negligible.
 */
global.ClearPlayerWantedLevel = function (player) {
	return _in(0x00000000, 0x54ea5bcc, _ts(player));
};

/**
 * Creates an object (prop) with the specified model at the specified position, offset on the Z axis by the radius of the object's model.
 * This object will initially be owned by the creating script as a mission entity, and the model should be loaded already (e.g. using REQUEST_MODEL).
 * @param modelHash The model to spawn.
 * @param x Spawn coordinate X component.
 * @param y Spawn coordinate Y component.
 * @param z Spawn coordinate Z component, 'ground level'.
 * @param isNetwork Whether to create a network object for the object. If false, the object exists only locally.
 * @param netMissionEntity Whether to register the object as pinned to the script host in the R\* network model.
 * @param doorFlag False to create a door archetype (archetype flag bit 26 set) as a door. Required to be set to true to create door models in network mode.
 * @return A script handle (fwScriptGuid index) for the object, or `0` if the object failed to be created.
 */
global.CreateObject = function (modelHash, x, y, z, isNetwork, netMissionEntity, doorFlag) {
	return _in(0x00000000, 0x2f7aa05c, _ch(modelHash), _fv(x), _fv(y), _fv(z), isNetwork, netMissionEntity, doorFlag, _r, _ri);
};

/**
 * Creates an object (prop) with the specified model centered at the specified position.
 * This object will initially be owned by the creating script as a mission entity, and the model should be loaded already (e.g. using REQUEST_MODEL).
 * @param modelHash The model to spawn.
 * @param x Spawn coordinate X component.
 * @param y Spawn coordinate Y component.
 * @param z Spawn coordinate Z component.
 * @param isNetwork Whether to create a network object for the object. If false, the object exists only locally.
 * @param netMissionEntity Whether to register the object as pinned to the script host in the R\* network model.
 * @param doorFlag False to create a door archetype (archetype flag bit 26 set) as a door. Required to be set to true to create door models in network mode.
 * @return A script handle (fwScriptGuid index) for the object, or `0` if the object failed to be created.
 */
global.CreateObjectNoOffset = function (modelHash, x, y, z, isNetwork, netMissionEntity, doorFlag) {
	return _in(0x00000000, 0x58040420, _ch(modelHash), _fv(x), _fv(y), _fv(z), isNetwork, netMissionEntity, doorFlag, _r, _ri);
};

/**
 * Creates a ped (biped character, pedestrian, actor) with the specified model at the specified position and heading.
 * This ped will initially be owned by the creating script as a mission entity, and the model should be loaded already
 * (e.g. using REQUEST_MODEL).
 * @param pedType Unused. Peds get set to CIVMALE/CIVFEMALE/etc. no matter the value specified.
 * @param modelHash The model of ped to spawn.
 * @param x Spawn coordinate X component.
 * @param y Spawn coordinate Y component.
 * @param z Spawn coordinate Z component.
 * @param heading Heading to face towards, in degrees.
 * @param isNetwork Whether to create a network object for the ped. If false, the ped exists only locally.
 * @param bScriptHostPed Whether to register the ped as pinned to the script host in the R\* network model.
 * @return A script handle (fwScriptGuid index) for the ped, or `0` if the ped failed to be created.
 */
global.CreatePed = function (pedType, modelHash, x, y, z, heading, isNetwork, bScriptHostPed) {
	return _in(0x00000000, 0x0389ef71, pedType, _ch(modelHash), _fv(x), _fv(y), _fv(z), _fv(heading), isNetwork, bScriptHostPed, _r, _ri);
};

/**
 * CREATE_PED_INSIDE_VEHICLE
 * @param pedType See [`CREATE_PED`](#\_0xD49F9B0955C367DE)
 */
global.CreatePedInsideVehicle = function (vehicle, pedType, modelHash, seat, isNetwork, bScriptHostPed) {
	return _in(0x00000000, 0x3000f092, vehicle, pedType, _ch(modelHash), seat, isNetwork, bScriptHostPed, _r, _ri);
};

/**
 * Creates a vehicle with the specified model at the specified position. This vehicle will initially be owned by the creating
 * script as a mission entity, and the model should be loaded already (e.g. using REQUEST_MODEL).
 * ```
 * NativeDB Added Parameter 8: BOOL p7
 * ```
 * @param modelHash The model of vehicle to spawn.
 * @param x Spawn coordinate X component.
 * @param y Spawn coordinate Y component.
 * @param z Spawn coordinate Z component.
 * @param heading Heading to face towards, in degrees.
 * @param isNetwork Whether to create a network object for the vehicle. If false, the vehicle exists only locally.
 * @param netMissionEntity Whether to register the vehicle as pinned to the script host in the R\* network model.
 * @return A script handle (fwScriptGuid index) for the vehicle, or `0` if the vehicle failed to be created.
 */
global.CreateVehicle = function (modelHash, x, y, z, heading, isNetwork, netMissionEntity) {
	return _in(0x00000000, 0xdd75460a, _ch(modelHash), _fv(x), _fv(y), _fv(z), _fv(heading), isNetwork, netMissionEntity, _r, _ri);
};

/**
 * Equivalent to CREATE_VEHICLE, but it uses 'server setter' logic (like the former CREATE_AUTOMOBILE) as a workaround for
 * reliability concerns regarding entity creation RPC.
 * Unlike CREATE_AUTOMOBILE, this supports other vehicle types as well.
 * @param modelHash The model of vehicle to spawn.
 * @param type The appropriate vehicle type for the model info. Can be one of `automobile`, `bike`, `boat`, `heli`, `plane`, `submarine`, `trailer`, and (potentially), `train`. This should be the same type as the `type` field in `vehicles.meta`.
 * @param x Spawn coordinate X component.
 * @param y Spawn coordinate Y component.
 * @param z Spawn coordinate Z component.
 * @param heading Heading to face towards, in degrees.
 * @return A script handle for the vehicle.
 */
global.CreateVehicleServerSetter = function (modelHash, type, x, y, z, heading) {
	return _in(0x00000000, 0x6ae51d4b, _ch(modelHash), _ts(type), _fv(x), _fv(y), _fv(z), _fv(heading), _r, _ri);
};

/**
 * Deletes the specified entity.
 * @param entity The entity to delete.
 */
global.DeleteEntity = function (entity) {
	return _in(0x00000000, 0xfaa3d236, entity);
};

/**
 * DELETE_FUNCTION_REFERENCE
 */
global.DeleteFunctionReference = function (referenceIdentity) {
	return _in(0x00000000, 0x1e86f206, _ts(referenceIdentity));
};

/**
 * DELETE_RESOURCE_KVP
 * @param key The key to delete
 */
global.DeleteResourceKvp = function (key) {
	return _in(0x00000000, 0x7389b5df, _ts(key));
};

/**
 * Nonsynchronous [DELETE_RESOURCE_KVP](#\_0x7389B5DF) operation; see [FLUSH_RESOURCE_KVP](#\_0x5240DA5A).
 * @param key The key to delete
 */
global.DeleteResourceKvpNoSync = function (key) {
	return _in(0x00000000, 0x04152c90, _ts(key));
};

/**
 * DOES_BOAT_SINK_WHEN_WRECKED
 * @param vehicle The target vehicle.
 * @return Returns whether or not the boat sinks when wrecked.
 */
global.DoesBoatSinkWhenWrecked = function (vehicle) {
	return _in(0x00000000, 0x43f15989, vehicle, _r);
};

/**
 * DOES_ENTITY_EXIST
 */
global.DoesEntityExist = function (entity) {
	return _in(0x00000000, 0x3ac90869, entity, _r);
};

/**
 * Returns whether or not the player exists
 * @return True if the player exists, false otherwise
 */
global.DoesPlayerExist = function (playerSrc) {
	return _in(0x00000000, 0x12038599, _ts(playerSrc), _r);
};

/**
 * Requests whether or not the player owns the specified SKU.
 * @param playerSrc The player handle
 * @param skuId The ID of the SKU.
 * @return A boolean.
 */
global.DoesPlayerOwnSku = function (playerSrc, skuId) {
	return _in(0x00000000, 0x167aba27, _ts(playerSrc), skuId, _r);
};

/**
 * Requests whether or not the player owns the specified package.
 * @param playerSrc The player handle
 * @param skuId The package ID on Tebex.
 * @return A boolean.
 */
global.DoesPlayerOwnSkuExt = function (playerSrc, skuId) {
	return _in(0x00000000, 0xdef0480b, _ts(playerSrc), skuId, _r);
};

/**
 * DROP_PLAYER
 */
global.DropPlayer = function (playerSrc, reason) {
	return _in(0x00000000, 0xba0613e1, _ts(playerSrc), _ts(reason));
};

/**
 * DUPLICATE_FUNCTION_REFERENCE
 */
global.DuplicateFunctionReference = function (referenceIdentity) {
	return _in(0x00000000, 0xf4e2079d, _ts(referenceIdentity), _r, _s);
};

/**
 * ENABLE_ENHANCED_HOST_SUPPORT
 */
global.EnableEnhancedHostSupport = function (enabled) {
	return _in(0x00000000, 0xf97b1c93, enabled);
};

/**
 * END_FIND_KVP
 * @param handle The KVP find handle returned from [START_FIND_KVP](#\_0xDD379006)
 * @return None.
 */
global.EndFindKvp = function (handle) {
	return _in(0x00000000, 0xb3210203, handle);
};

/**
 * Internal function for ensuring an entity has a state bag.
 */
global.EnsureEntityStateBag = function (entity) {
	return _in(0x00000000, 0x3bb78f05, entity);
};

/**
 * EXECUTE_COMMAND
 */
global.ExecuteCommand = function (commandString) {
	return _in(0x00000000, 0x561c060b, _ts(commandString));
};

/**
 * FIND_KVP
 * @param handle The KVP find handle returned from [START_FIND_KVP](#\_0xDD379006)
 * @return None.
 */
global.FindKvp = function (handle) {
	return _in(0x00000000, 0xbd7bebc5, handle, _r, _s);
};

/**
 * FLAG_SERVER_AS_PRIVATE
 */
global.FlagServerAsPrivate = function (private_) {
	return _in(0x00000000, 0x13b6855d, private_);
};

/**
 * Nonsynchronous operations will not wait for a disk/filesystem flush before returning from a write or delete call. They will be much faster than their synchronous counterparts (e.g., bulk operations), however, a system crash may lose the data to some recent operations.
 * This native ensures all `_NO_SYNC` operations are synchronized with the disk/filesystem.
 */
global.FlushResourceKvp = function () {
	return _in(0x00000000, 0xe27c97a0);
};

/**
 * Freezes or unfreezes an entity preventing its coordinates to change by the player if set to `true`. You can still change the entity position using SET_ENTITY_COORDS.
 * @param entity The entity to freeze/unfreeze.
 * @param toggle Freeze or unfreeze entity.
 */
global.FreezeEntityPosition = function (entity, toggle) {
	return _in(0x00000000, 0x65c16d57, entity, toggle);
};

/**
 * GET_AIR_DRAG_MULTIPLIER_FOR_PLAYERS_VEHICLE
 * @param playerSrc The player handle
 */
global.GetAirDragMultiplierForPlayersVehicle = function (playerSrc) {
	return _in(0x00000000, 0x62fc38d0, _ts(playerSrc), _r, _rf);
};

/**
 * Returns all object handles known to the server.
 * The data returned adheres to the following layout:
 * ```
 * [127, 42, 13, 37]
 * ```
 * @return An object containing a list of object handles.
 */
global.GetAllObjects = function () {
	return _in(0x00000000, 0x6886c3fe, _r, _ro);
};

/**
 * Returns all peds handles known to the server.
 * The data returned adheres to the following layout:
 * ```
 * [127, 42, 13, 37]
 * ```
 * @return An object containing a list of peds handles.
 */
global.GetAllPeds = function () {
	return _in(0x00000000, 0xb8584fef, _r, _ro);
};

/**
 * Returns all vehicle handles known to the server.
 * The data returned adheres to the following layout:
 * ```
 * [127, 42, 13, 37]
 * ```
 * @return An object containing a list of vehicle handles.
 */
global.GetAllVehicles = function () {
	return _in(0x00000000, 0x332169f5, _r, _ro);
};

global.GetBlipSprite = function (self) {
	return _in(0x00000000, 0x72ff2e73, self, _r, _ri);
};

/**
 * Returns the current console output buffer.
 * @return The most recent game console output, as a string.
 */
global.GetConsoleBuffer = function () {
	return _in(0x00000000, 0xe57429fa, _r, _s);
};

/**
 * Can be used to get a console variable of type `char*`, for example a string.
 * @param varName The console variable to look up.
 * @param default_ The default value to set if none is found.
 * @return Returns the convar value if it can be found, otherwise it returns the assigned `default`.
 */
global.GetConvar = function (varName, default_) {
	return _in(0x00000000, 0x6ccd2564, _ts(varName), _ts(default_), _r, _s);
};

/**
 * Can be used to get a console variable casted back to `int` (an integer value).
 * @param varName The console variable to look up.
 * @param default_ The default value to set if none is found (variable not set using [SET_CONVAR](#\_0x341B16D2), or not accessible).
 * @return Returns the convar value if it can be found, otherwise it returns the assigned `default`.
 */
global.GetConvarInt = function (varName, default_) {
	return _in(0x00000000, 0x935c0ab2, _ts(varName), default_, _r, _ri);
};

/**
 * Returns the name of the currently executing resource.
 * @return The name of the resource.
 */
global.GetCurrentResourceName = function () {
	return _in(0x00000000, 0xe5e9ebbb, _r, _s);
};

/**
 * Gets the entity that this entity is attached to.
 * @param entity The entity to check.
 * @return The attached entity handle. 0 returned if the entity is not attached.
 */
global.GetEntityAttachedTo = function (entity) {
	return _in(0x00000000, 0xfe1589f9, entity, _r, _ri);
};

/**
 * GET_ENTITY_COLLISION_DISABLED
 * @param entity The target entity.
 * @return Returns whether or not entity collisions are disabled.
 */
global.GetEntityCollisionDisabled = function (entity) {
	return _in(0x00000000, 0xe8c0c629, entity, _r);
};

/**
 * Gets the current coordinates for a specified entity. This native is used server side when using OneSync.
 * See [GET_ENTITY_COORDS](#\_0x3FEF770D40960D5A) for client side.
 * @param entity The entity to get the coordinates from.
 * @return The current entity coordinates.
 */
global.GetEntityCoords = function (entity) {
	return _in(0x00000000, 0x1647f1cb, entity, _r, _rv);
};

/**
 * Returns the entity handle for the specified state bag name. For use with [ADD_STATE_BAG_CHANGE_HANDLER](?\_0x5BA35AAF).
 * @param bagName An internal state bag ID from the argument to a state bag change handler.
 * @return The entity handle or 0 if the state bag name did not refer to an entity, or the entity does not exist.
 */
global.GetEntityFromStateBagName = function (bagName) {
	return _in(0x00000000, 0x4bdf1867, _ts(bagName), _r, _ri);
};

/**
 * GET_ENTITY_HEADING
 */
global.GetEntityHeading = function (entity) {
	return _in(0x00000000, 0x972cc383, entity, _r, _rf);
};

/**
 * Only works for vehicle and peds
 * @param entity The entity to check the health of
 * @return If the entity is a vehicle it will return 0-1000
 * 		If the entity is a ped it will return 0-200
 * 		If the entity is an object it will return 0
 */
global.GetEntityHealth = function (entity) {
	return _in(0x00000000, 0x8e3222b7, entity, _r, _ri);
};

/**
 * Currently it only works with peds.
 */
global.GetEntityMaxHealth = function (entity) {
	return _in(0x00000000, 0xc7ae6aa1, entity, _r, _ri);
};

/**
 * GET_ENTITY_MODEL
 */
global.GetEntityModel = function (entity) {
	return _in(0x00000000, 0xdafcb3ec, entity, _r, _ri);
};

/**
 * This native gets an entity's population type.
 * @param entity the entity to obtain the population type from
 * @return Returns the population type ID, defined by the below enumeration:```cpp
 * 		enum ePopulationType
 * 		{
 * 			POPTYPE_UNKNOWN = 0,
 * 			POPTYPE_RANDOM_PERMANENT,
 * 			POPTYPE_RANDOM_PARKED,
 * 			POPTYPE_RANDOM_PATROL,
 * 			POPTYPE_RANDOM_SCENARIO,
 * 			POPTYPE_RANDOM_AMBIENT,
 * 			POPTYPE_PERMANENT,
 * 			POPTYPE_MISSION,
 * 			POPTYPE_REPLAY,
 * 			POPTYPE_CACHE,
 * 			POPTYPE_TOOL
 * 		};
 * 		```
 */
global.GetEntityPopulationType = function (entity) {
	return _in(0x00000000, 0xfc30ddff, entity, _r, _ri);
};

/**
 * GET_ENTITY_ROTATION
 */
global.GetEntityRotation = function (entity) {
	return _in(0x00000000, 0x8ff45b04, entity, _r, _rv);
};

/**
 * GET_ENTITY_ROTATION_VELOCITY
 */
global.GetEntityRotationVelocity = function (entity) {
	return _in(0x00000000, 0x9bf8a73f, entity, _r, _rv);
};

/**
 * Gets the routing bucket for the specified entity.
 * Routing buckets are also known as 'dimensions' or 'virtual worlds' in past echoes, however they are population-aware.
 * @param entity The entity to get the routing bucket for.
 * @return The routing bucket ID.
 */
global.GetEntityRoutingBucket = function (entity) {
	return _in(0x00000000, 0xed4b0486, entity, _r, _ri);
};

/**
 * GET_ENTITY_SCRIPT
 */
global.GetEntityScript = function (entity) {
	return _in(0x00000000, 0xb7f70784, entity, _r, _s);
};

/**
 * Gets the current speed of the entity in meters per second.
 * ```
 * To convert to MPH: speed * 2.236936
 * To convert to KPH: speed * 3.6
 * ```
 * @param entity The entity to get the speed of
 * @return The speed of the entity in meters per second
 */
global.GetEntitySpeed = function (entity) {
	return _in(0x00000000, 0x9e1e4798, entity, _r, _rf);
};

/**
 * Gets the entity type (as an integer), which can be one of the following defined down below:
 * **The following entities will return type `1`:**
 * *   Ped
 * *   Player
 * *   Animal (Red Dead Redemption 2)
 * *   Horse (Red Dead Redemption 2)
 * **The following entities will return type `2`:**
 * *   Automobile
 * *   Bike
 * *   Boat
 * *   Heli
 * *   Plane
 * *   Submarine
 * *   Trailer
 * *   Train
 * *   DraftVeh (Red Dead Redemption 2)
 * **The following entities will return type `3`:**
 * *   Object
 * *   Door
 * *   Pickup
 * Otherwise, a value of `0` will be returned.
 * @param entity The entity to get the type of.
 * @return The entity type returned as an integer value.
 */
global.GetEntityType = function (entity) {
	return _in(0x00000000, 0x0b1bd08d, entity, _r, _ri);
};

/**
 * GET_ENTITY_VELOCITY
 */
global.GetEntityVelocity = function (entity) {
	return _in(0x00000000, 0xc14c9b6b, entity, _r, _rv);
};

/**
 * Returns the internal build number of the current game being executed.
 * Possible values:
 * *   FiveM
 * *   1604
 * *   2060
 * *   2189
 * *   2372
 * *   2545
 * *   2612
 * *   2699
 * *   2802
 * *   2944
 * *   3095
 * *   RedM
 * *   1311
 * *   1355
 * *   1436
 * *   1491
 * *   LibertyM
 * *   43
 * *   FXServer
 * *   0
 * @return The build number, or **0** if no build number is known.
 */
global.GetGameBuildNumber = function () {
	return _in(0x00000000, 0x804b9f7b, _r, _ri);
};

/**
 * Returns the current game being executed.
 * Possible values:
 * | Return value | Meaning                        |
 * | ------------ | ------------------------------ |
 * | `fxserver`   | Server-side code ('Duplicity') |
 * | `fivem`      | FiveM for GTA V                |
 * | `libertym`   | LibertyM for GTA IV            |
 * | `redm`       | RedM for Red Dead Redemption 2 |
 * @return The game the script environment is running in.
 */
global.GetGameName = function () {
	return _in(0x00000000, 0xe8eaa18b, _r, _s);
};

/**
 * Gets the current game timer in milliseconds.
 * @return The game time.
 */
global.GetGameTimer = function () {
	return _in(0x00000000, 0xa4ea0691, _r, _rl);
};

/**
 * This native converts the passed string to a hash.
 */
global.GetHashKey = function (model) {
	return _in(0x00000000, 0x98eff6f1, _ts(model), _r, _ri);
};

/**
 * GET_HELI_MAIN_ROTOR_HEALTH
 * @param vehicle The target vehicle.
 * @return See the client-side [GET_HELI_MAIN_ROTOR_HEALTH](https://docs.fivem.net/natives/?\_0xE4CB7541F413D2C5) for the return value.
 */
global.GetHeliMainRotorHealth = function (vehicle) {
	return _in(0x00000000, 0xf01e2aab, vehicle, _r, _rf);
};

/**
 * GET_HELI_TAIL_ROTOR_HEALTH
 * @param vehicle The target vehicle.
 * @return See the client-side [GET_HELI_TAIL_ROTOR_HEALTH](https://docs.fivem.net/natives/?\_0xAE8CE82A4219AC8C) for the return value.
 */
global.GetHeliTailRotorHealth = function (vehicle) {
	return _in(0x00000000, 0xa41bc13d, vehicle, _r, _rf);
};

/**
 * GET_HOST_ID
 */
global.GetHostId = function () {
	return _in(0x00000000, 0x5f70f5a3, _r, _s);
};

/**
 * GET_INSTANCE_ID
 */
global.GetInstanceId = function () {
	return _in(0x00000000, 0x9f1c4383, _r, _ri);
};

/**
 * GET_INVOKING_RESOURCE
 */
global.GetInvokingResource = function () {
	return _in(0x00000000, 0x4d52fe5b, _r, _s);
};

/**
 * GET_IS_VEHICLE_ENGINE_RUNNING
 */
global.GetIsVehicleEngineRunning = function (vehicle) {
	return _in(0x00000000, 0x7dc6d022, vehicle, _r);
};

/**
 * GET_IS_VEHICLE_PRIMARY_COLOUR_CUSTOM
 */
global.GetIsVehiclePrimaryColourCustom = function (vehicle) {
	return _in(0x00000000, 0xd7ec8760, vehicle, _r);
};

/**
 * GET_IS_VEHICLE_SECONDARY_COLOUR_CUSTOM
 */
global.GetIsVehicleSecondaryColourCustom = function (vehicle) {
	return _in(0x00000000, 0x288ad228, vehicle, _r);
};

/**
 * See the client-side [GET_LANDING_GEAR_STATE](#\_0x9B0F3DCA3DB0F4CD) native for a description of landing gear states.
 * @param vehicle The vehicle to check.
 * @return The current state of the vehicles landing gear.
 */
global.GetLandingGearState = function (vehicle) {
	return _in(0x00000000, 0xa6f02670, vehicle, _r, _ri);
};

/**
 * GET_LAST_PED_IN_VEHICLE_SEAT
 * @param vehicle The target vehicle.
 * @param seatIndex See eSeatPosition declared in [`IS_VEHICLE_SEAT_FREE`](#\_0x22AC59A870E6A669).
 * @return The last ped in the specified seat of the passed vehicle. Returns 0 if the specified seat was never occupied or the last ped does not exist anymore.
 */
global.GetLastPedInVehicleSeat = function (vehicle, seatIndex) {
	return _in(0x00000000, 0xf7c6792d, vehicle, seatIndex, _r, _ri);
};

/**
 * GET_NUM_PLAYER_IDENTIFIERS
 */
global.GetNumPlayerIdentifiers = function (playerSrc) {
	return _in(0x00000000, 0xff7f66ab, _ts(playerSrc), _r, _ri);
};

/**
 * GET_NUM_PLAYER_INDICES
 */
global.GetNumPlayerIndices = function () {
	return _in(0x00000000, 0x63d13184, _r, _ri);
};

/**
 * GET_NUM_PLAYER_TOKENS
 */
global.GetNumPlayerTokens = function (playerSrc) {
	return _in(0x00000000, 0x619e4a3d, _ts(playerSrc), _r, _ri);
};

/**
 * Gets the amount of metadata values with the specified key existing in the specified resource's manifest.
 * See also: [Resource manifest](https://docs.fivem.net/resources/manifest/)
 * @param resourceName The resource name.
 * @param metadataKey The key to look up in the resource manifest.
 */
global.GetNumResourceMetadata = function (resourceName, metadataKey) {
	return _in(0x00000000, 0x0776e864, _ts(resourceName), _ts(metadataKey), _r, _ri);
};

/**
 * GET_NUM_RESOURCES
 */
global.GetNumResources = function () {
	return _in(0x00000000, 0x0863f27b, _r, _ri);
};

/**
 * GET_PASSWORD_HASH
 */
global.GetPasswordHash = function (password) {
	return _in(0x00000000, 0x23473ea4, _ts(password), _r, _s);
};

/**
 * GET_PED_ARMOUR
 */
global.GetPedArmour = function (ped) {
	return _in(0x00000000, 0x2ce311a7, ped, _r, _ri);
};

/**
 * GET_PED_CAUSE_OF_DEATH
 */
global.GetPedCauseOfDeath = function (ped) {
	return _in(0x00000000, 0x63458c27, ped, _r, _ri);
};

/**
 * GET_PED_DESIRED_HEADING
 * @param ped The target ped
 * @return Returns ped's desired heading.
 */
global.GetPedDesiredHeading = function (ped) {
	return _in(0x00000000, 0xc182f76e, ped, _r, _rf);
};

/**
 * GET_PED_IN_VEHICLE_SEAT
 * @param vehicle The target vehicle.
 * @param seatIndex See eSeatPosition declared in [`IS_VEHICLE_SEAT_FREE`](#\_0x22AC59A870E6A669).
 * @return The ped in the specified seat of the passed vehicle. Returns 0 if the specified seat is not occupied.
 */
global.GetPedInVehicleSeat = function (vehicle, seatIndex) {
	return _in(0x00000000, 0x388fde9a, vehicle, seatIndex, _r, _ri);
};

/**
 * GET_PED_MAX_HEALTH
 */
global.GetPedMaxHealth = function (ped) {
	return _in(0x00000000, 0xa45b6c8d, ped, _r, _ri);
};

/**
 * Gets the script task command currently assigned to the ped.
 * @param ped The target ped.
 * @return The script task command currently assigned to the ped. A value of 0x811E343C denotes no script task is assigned.
 */
global.GetPedScriptTaskCommand = function (ped) {
	return _in(0x00000000, 0x084fe084, ped, _r, _ri);
};

/**
 * Gets the stage of the peds scripted task.
 * @param ped The target ped.
 * @return The stage of the ped's scripted task. A value of 3 denotes no script task is assigned.
 */
global.GetPedScriptTaskStage = function (ped) {
	return _in(0x00000000, 0x44b0e5e2, ped, _r, _ri);
};

/**
 * Get the last entity that damaged the ped. This native is used server side when using OneSync.
 * @param ped The target ped
 * @return The entity id. Returns 0 if the ped has not been damaged recently.
 */
global.GetPedSourceOfDamage = function (ped) {
	return _in(0x00000000, 0x535db43f, ped, _r, _ri);
};

/**
 * Get the entity that killed the ped. This native is used server side when using OneSync.
 * @param ped The target ped
 * @return The entity id. Returns 0 if the ped has no killer.
 */
global.GetPedSourceOfDeath = function (ped) {
	return _in(0x00000000, 0x84adf9eb, ped, _r, _ri);
};

/**
 * Gets the type of a ped's specific task given an index of the CPedTaskSpecificDataNode nodes.
 * A ped will typically have a task at index 0, if a ped has multiple tasks at once they will be in the order 0, 1, 2, etc.
 * @param ped The target ped.
 * @param index A zero-based index with a maximum value of 7.
 * @return The type of the specific task.
 * 		1604: A value of 530 denotes no script task is assigned or an invalid input was given.
 * 		2060+: A value of 531 denotes no script task is assigned or an invalid input was given.
 */
global.GetPedSpecificTaskType = function (ped, index) {
	return _in(0x00000000, 0x7f4563d3, ped, index, _r, _ri);
};

/**
 * GET_PED_STEALTH_MOVEMENT
 * @param ped The target ped.
 * @return Whether or not the ped is stealthy.
 */
global.GetPedStealthMovement = function (ped) {
	return _in(0x00000000, 0x40321b83, ped, _r);
};

/**
 * Gets the current camera rotation for a specified player. This native is used server side when using OneSync.
 * @param playerSrc The player handle.
 * @return The player's camera rotation. Values are in radians.
 */
global.GetPlayerCameraRotation = function (playerSrc) {
	return _in(0x00000000, 0x433c765d, _ts(playerSrc), _r, _rv);
};

/**
 * GET_PLAYER_ENDPOINT
 */
global.GetPlayerEndpoint = function (playerSrc) {
	return _in(0x00000000, 0xfee404f9, _ts(playerSrc), _r, _s);
};

/**
 * Gets the current fake wanted level for a specified player. This native is used server side when using OneSync.
 * @param playerSrc The target player
 * @return The fake wanted level
 */
global.GetPlayerFakeWantedLevel = function (playerSrc) {
	return _in(0x00000000, 0x0098d244, _ts(playerSrc), _r, _ri);
};

/**
 * GET_PLAYER_FROM_INDEX
 */
global.GetPlayerFromIndex = function (index) {
	return _in(0x00000000, 0xc8a9ce08, index, _r, _s);
};

/**
 * On the server this will return the players source, on the client it will return the player handle.
 * @param bagName An internal state bag ID from the argument to a state bag change handler.
 * @return The player handle or 0 if the state bag name did not refer to a player, or the player does not exist.
 */
global.GetPlayerFromStateBagName = function (bagName) {
	return _in(0x00000000, 0xa56135e0, _ts(bagName), _r, _ri);
};

/**
 * GET_PLAYER_GUID
 */
global.GetPlayerGuid = function (playerSrc) {
	return _in(0x00000000, 0xe52d9680, _ts(playerSrc), _r, _s);
};

/**
 * GET_PLAYER_IDENTIFIER
 */
global.GetPlayerIdentifier = function (playerSrc, identifier) {
	return _in(0x00000000, 0x7302dbcf, _ts(playerSrc), identifier, _r, _s);
};

/**
 * Get an identifier from a player by the type of the identifier.
 * @param playerSrc The player to get the identifier for
 * @param identifierType The string to match in an identifier, this can be `"license"` for example.
 * @return The identifier that matches the string provided
 */
global.GetPlayerIdentifierByType = function (playerSrc, identifierType) {
	return _in(0x00000000, 0xa61c8fc6, _ts(playerSrc), _ts(identifierType), _r, _s);
};

/**
 * GET_PLAYER_INVINCIBLE
 * @param playerSrc The player handle
 * @return A boolean to tell if the player is invincible.
 */
global.GetPlayerInvincible = function (playerSrc) {
	return _in(0x00000000, 0x680c90ee, _ts(playerSrc), _r);
};

/**
 * GET_PLAYER_LAST_MSG
 */
global.GetPlayerLastMsg = function (playerSrc) {
	return _in(0x00000000, 0x427e8e6a, _ts(playerSrc), _r, _ri);
};

/**
 * GET_PLAYER_MAX_ARMOUR
 * @param playerSrc The player handle
 */
global.GetPlayerMaxArmour = function (playerSrc) {
	return _in(0x00000000, 0x02a50657, _ts(playerSrc), _r, _ri);
};

/**
 * GET_PLAYER_MAX_HEALTH
 * @param playerSrc The player handle
 */
global.GetPlayerMaxHealth = function (playerSrc) {
	return _in(0x00000000, 0x8154e470, _ts(playerSrc), _r, _ri);
};

/**
 * A getter for [SET_PLAYER_MELEE_WEAPON_DAMAGE_MODIFIER](#\_0x4A3DC7ECCC321032).
 * @param playerId The player index.
 * @return Returns player melee weapon damage modifier value.
 */
global.GetPlayerMeleeWeaponDamageModifier = function (playerId) {
	return _in(0x00000000, 0x8689a825, _ts(playerId), _r, _rf);
};

/**
 * GET_PLAYER_NAME
 */
global.GetPlayerName = function (playerSrc) {
	return _in(0x00000000, 0x406b4b20, _ts(playerSrc), _r, _s);
};

/**
 * Used to get the player's Ped Entity ID when a valid `playerSrc` is passed.
 * @param playerSrc The player source, passed as a string.
 * @return Returns a valid Ped Entity ID if the passed `playerSrc` is valid, `0` if not.
 */
global.GetPlayerPed = function (playerSrc) {
	return _in(0x00000000, 0x6e31e993, _ts(playerSrc), _r, _ri);
};

/**
 * GET_PLAYER_PING
 */
global.GetPlayerPing = function (playerSrc) {
	return _in(0x00000000, 0xff1290d4, _ts(playerSrc), _r, _ri);
};

/**
 * Gets the routing bucket for the specified player.
 * Routing buckets are also known as 'dimensions' or 'virtual worlds' in past echoes, however they are population-aware.
 * @param playerSrc The player to get the routing bucket for.
 * @return The routing bucket ID.
 */
global.GetPlayerRoutingBucket = function (playerSrc) {
	return _in(0x00000000, 0x52441c34, _ts(playerSrc), _r, _ri);
};

/**
 * GET_PLAYER_TEAM
 * @param playerSrc The player handle
 */
global.GetPlayerTeam = function (playerSrc) {
	return _in(0x00000000, 0x9873e404, _ts(playerSrc), _r, _ri);
};

/**
 * Gets the amount of time player has spent evading the cops.
 * Counter starts and increments only when cops are chasing the player.
 * If the player is evading, the timer will pause.
 * @param playerSrc The target player
 * @param lastPursuit False = CurrentPursuit, True = LastPursuit
 * @return Returns -1, if the player is not wanted or wasn't in pursuit before, depending on the lastPursuit parameter
 * 		Returns 0, if lastPursuit == False and the player has a wanted level, but the pursuit has not started yet
 * 		Otherwise, will return the milliseconds of the pursuit.
 */
global.GetPlayerTimeInPursuit = function (playerSrc, lastPursuit) {
	return _in(0x00000000, 0x7ade63e1, _ts(playerSrc), lastPursuit, _r, _ri);
};

/**
 * Gets a player's token. Tokens can be used to enhance banning logic, however are specific to a server.
 * @param playerSrc A player.
 * @param index Index between 0 and GET_NUM_PLAYER_TOKENS.
 * @return A token value.
 */
global.GetPlayerToken = function (playerSrc, index) {
	return _in(0x00000000, 0x54c06897, _ts(playerSrc), index, _r, _s);
};

/**
 * Gets the current known coordinates for the specified player from cops perspective. This native is used server side when using OneSync.
 * @param playerSrc The target player
 * @return The player's position known by police. Vector zero if the player has no wanted level.
 */
global.GetPlayerWantedCentrePosition = function (playerSrc) {
	return _in(0x00000000, 0x821f2d2c, _ts(playerSrc), _r, _rv);
};

/**
 * Returns given players wanted level server-side.
 * @param playerSrc The target player
 * @return The wanted level
 */
global.GetPlayerWantedLevel = function (playerSrc) {
	return _in(0x00000000, 0xbdcdd163, _ts(playerSrc), _r, _ri);
};

/**
 * A getter for [SET_PLAYER_WEAPON_DAMAGE_MODIFIER](#\_0xCE07B9F7817AADA3).
 * @param playerId The player index.
 * @return The value of player weapon damage modifier.
 */
global.GetPlayerWeaponDamageModifier = function (playerId) {
	return _in(0x00000000, 0x2a3d7cda, _ts(playerId), _r, _rf);
};

/**
 * A getter for [SET_PLAYER_WEAPON_DEFENSE_MODIFIER](#\_0x2D83BC011CA14A3C).
 * @param playerId The player index.
 * @return The value of player weapon defense modifier.
 */
global.GetPlayerWeaponDefenseModifier = function (playerId) {
	return _in(0x00000000, 0xf1543251, _ts(playerId), _r, _rf);
};

/**
 * A getter for [\_SET_PLAYER_WEAPON_DEFENSE_MODIFIER\_2](#\_0xBCFDE9EDE4CF27DC).
 * @param playerId The player index.
 * @return The value of player weapon defense modifier 2.
 */
global.GetPlayerWeaponDefenseModifier_2 = function (playerId) {
	return _in(0x00000000, 0x986b65ff, _ts(playerId), _r, _rf);
};

/**
 * Returns all commands that are registered in the command system.
 * The data returned adheres to the following layout:
 * ```
 * [
 * {
 * "name": "cmdlist"
 * },
 * {
 * "name": "command1"
 * }
 * ]
 * ```
 * @return An object containing registered commands.
 */
global.GetRegisteredCommands = function () {
	return _in(0x00000000, 0xd4bef069, _r, _ro);
};

/**
 * GET_RESOURCE_BY_FIND_INDEX
 * @param findIndex The index of the resource (starting at 0)
 * @return The resource name as a `string`
 */
global.GetResourceByFindIndex = function (findIndex) {
	return _in(0x00000000, 0x387246b7, findIndex, _r, _s);
};

/**
 * A getter for [SET_RESOURCE_KVP_FLOAT](#\_0x9ADD2938).
 * @param key The key to fetch
 * @return The floating-point value stored under the specified key, or 0.0 if not found.
 */
global.GetResourceKvpFloat = function (key) {
	return _in(0x00000000, 0x35bdceea, _ts(key), _r, _rf);
};

/**
 * A getter for [SET_RESOURCE_KVP_INT](#\_0x6A2B1E8).
 * @param key The key to fetch
 * @return The integer value stored under the specified key, or 0 if not found.
 */
global.GetResourceKvpInt = function (key) {
	return _in(0x00000000, 0x557b586a, _ts(key), _r, _ri);
};

/**
 * A getter for [SET_RESOURCE_KVP](#\_0x21C7A35B).
 * @param key The key to fetch
 * @return The string value stored under the specified key, or nil/null if not found.
 */
global.GetResourceKvpString = function (key) {
	return _in(0x00000000, 0x5240da5a, _ts(key), _r, _s);
};

/**
 * Gets the metadata value at a specified key/index from a resource's manifest.
 * See also: [Resource manifest](https://docs.fivem.net/resources/manifest/)
 * @param resourceName The resource name.
 * @param metadataKey The key in the resource manifest.
 * @param index The value index, in a range from \[0..GET_NUM_RESOURCE_METDATA-1].
 */
global.GetResourceMetadata = function (resourceName, metadataKey, index) {
	return _in(0x00000000, 0x964bab1d, _ts(resourceName), _ts(metadataKey), index, _r, _s);
};

/**
 * Returns the physical on-disk path of the specified resource.
 * @param resourceName The name of the resource.
 * @return The resource directory name, possibly without trailing slash.
 */
global.GetResourcePath = function (resourceName) {
	return _in(0x00000000, 0x61dcf017, _ts(resourceName), _r, _s);
};

/**
 * Returns the current state of the specified resource.
 * @param resourceName The name of the resource.
 * @return The resource state. One of `"missing", "started", "starting", "stopped", "stopping", "uninitialized" or "unknown"`.
 */
global.GetResourceState = function (resourceName) {
	return _in(0x00000000, 0x4039b485, _ts(resourceName), _r, _s);
};

/**
 * Returns a hash of selected ped weapon.
 * @param ped The target ped.
 * @return The weapon hash.
 */
global.GetSelectedPedWeapon = function (ped) {
	return _in(0x00000000, 0xd240123e, ped, _r, _ri);
};

/**
 * Returns the value of a state bag key.
 * @return Value.
 */
global.GetStateBagValue = function (bagName, key) {
	return _in(0x00000000, 0x637f4c75, _ts(bagName), _ts(key), _r, _ro);
};

/**
 * GET_TRAIN_CARRIAGE_ENGINE
 * @param train The entity handle.
 * @return The train engine carriage.
 */
global.GetTrainCarriageEngine = function (train) {
	return _in(0x00000000, 0x095070fa, train, _r, _ri);
};

/**
 * GET_TRAIN_CARRIAGE_INDEX
 * @param train The entity handle.
 * @return The carriage index. -1 returned if invalid result.
 */
global.GetTrainCarriageIndex = function (train) {
	return _in(0x00000000, 0x4b8285cf, train, _r, _ri);
};

/**
 * GET_VEHICLE_BODY_HEALTH
 */
global.GetVehicleBodyHealth = function (vehicle) {
	return _in(0x00000000, 0x2b2fcc28, vehicle, _r, _rf);
};

/**
 * GET_VEHICLE_COLOURS
 */
global.GetVehicleColours = function (vehicle) {
	return _in(0x00000000, 0x40d82d88, vehicle, _i, _i);
};

/**
 * GET_VEHICLE_CUSTOM_PRIMARY_COLOUR
 */
global.GetVehicleCustomPrimaryColour = function (vehicle) {
	return _in(0x00000000, 0x1c2b9fef, vehicle, _i, _i, _i);
};

/**
 * GET_VEHICLE_CUSTOM_SECONDARY_COLOUR
 */
global.GetVehicleCustomSecondaryColour = function (vehicle) {
	return _in(0x00000000, 0x3ff247a2, vehicle, _i, _i, _i);
};

/**
 * GET_VEHICLE_DASHBOARD_COLOUR
 */
global.GetVehicleDashboardColour = function (vehicle, color) {
	return _in(0x00000000, 0xa0dbd08d, vehicle, _ii(color) /* may be optional */);
};

/**
 * GET_VEHICLE_DIRT_LEVEL
 */
global.GetVehicleDirtLevel = function (vehicle) {
	return _in(0x00000000, 0xfd15c065, vehicle, _r, _rf);
};

/**
 * ```lua
 * enum_VehicleLockStatus = {
 * None = 0,
 * Locked = 2,
 * LockedForPlayer = 3,
 * StickPlayerInside = 4, -- Doesn't allow players to exit the vehicle with the exit vehicle key.
 * CanBeBrokenInto = 7, -- Can be broken into the car. If the glass is broken, the value will be set to 1
 * CanBeBrokenIntoPersist = 8, -- Can be broken into persist
 * CannotBeTriedToEnter = 10, -- Cannot be tried to enter (Nothing happens when you press the vehicle enter key).
 * }
 * ```
 * It should be [noted](https://forum.cfx.re/t/4863241) that while the [client-side command](#\_0x25BC98A59C2EA962) and its
 * setter distinguish between states 0 (unset) and 1 (unlocked), the game will synchronize both as state 0, so the server-side
 * command will return only '0' if unlocked.
 * @param vehicle A vehicle handle.
 * @return The door lock status for the specified vehicle.
 */
global.GetVehicleDoorLockStatus = function (vehicle) {
	return _in(0x00000000, 0x0d72cef2, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_DOOR_STATUS
 * @return A number from 0 to 7.
 */
global.GetVehicleDoorStatus = function (vehicle) {
	return _in(0x00000000, 0x6e35c49c, vehicle, _r, _ri);
};

/**
 * Currently it only works when set to "all players".
 */
global.GetVehicleDoorsLockedForPlayer = function (vehicle) {
	return _in(0x00000000, 0x1dc50247, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_ENGINE_HEALTH
 */
global.GetVehicleEngineHealth = function (vehicle) {
	return _in(0x00000000, 0x8880038a, vehicle, _r, _rf);
};

/**
 * GET_VEHICLE_EXTRA_COLOURS
 */
global.GetVehicleExtraColours = function (vehicle) {
	return _in(0x00000000, 0x80e4659b, vehicle, _i, _i);
};

/**
 * Gets the flight nozzel position for the specified vehicle. See the client-side [\_GET_VEHICLE_FLIGHT_NOZZLE_POSITION](#\_0xDA62027C8BDB326E) native for usage examples.
 * @param vehicle The vehicle to check.
 * @return The flight nozzel position between 0.0 (flying normally) and 1.0 (VTOL mode)
 */
global.GetVehicleFlightNozzlePosition = function (vehicle) {
	return _in(0x00000000, 0xad40ad55, vehicle, _r, _rf);
};

/**
 * GET_VEHICLE_HANDBRAKE
 */
global.GetVehicleHandbrake = function (vehicle) {
	return _in(0x00000000, 0x483b013c, vehicle, _r);
};

/**
 * GET_VEHICLE_HEADLIGHTS_COLOUR
 */
global.GetVehicleHeadlightsColour = function (vehicle) {
	return _in(0x00000000, 0xd7147656, vehicle, _r, _ri);
};

/**
 * Gets the lock on state for the specified vehicle. See the client-side [GET_VEHICLE_HOMING_LOCKON_STATE](#\_0xE6B0E8CFC3633BF0) native for a description of lock on states.
 * @param vehicle The vehicle to check.
 * @return The lock on state.
 */
global.GetVehicleHomingLockonState = function (vehicle) {
	return _in(0x00000000, 0xfbde9fd8, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_INTERIOR_COLOUR
 */
global.GetVehicleInteriorColour = function (vehicle, color) {
	return _in(0x00000000, 0xccff3b6e, vehicle, _ii(color) /* may be optional */);
};

/**
 * GET_VEHICLE_LIGHTS_STATE
 */
global.GetVehicleLightsState = function (vehicle) {
	return _in(0x00000000, 0x7c278621, vehicle, _i /* actually bool */, _i /* actually bool */, _r);
};

/**
 * GET_VEHICLE_LIVERY
 */
global.GetVehicleLivery = function (vehicle) {
	return _in(0x00000000, 0xec82a51d, vehicle, _r, _ri);
};

/**
 * Gets the vehicle that is locked on to for the specified vehicle.
 * @param vehicle The vehicle to check.
 * @return The vehicle that is locked on. 0 returned if no vehicle is locked on.
 */
global.GetVehicleLockOnTarget = function (vehicle) {
	return _in(0x00000000, 0x4a557117, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_NUMBER_PLATE_TEXT
 */
global.GetVehicleNumberPlateText = function (vehicle) {
	return _in(0x00000000, 0xe8522d58, vehicle, _r, _s);
};

/**
 * GET_VEHICLE_NUMBER_PLATE_TEXT_INDEX
 */
global.GetVehicleNumberPlateTextIndex = function (vehicle) {
	return _in(0x00000000, 0x499747b6, vehicle, _r, _ri);
};

/**
 * Gets the vehicle the specified Ped is/was in depending on bool value. This native is used server side when using OneSync.
 * @param ped The target ped
 * @param lastVehicle False = CurrentVehicle, True = LastVehicle
 * @return The vehicle id. Returns 0 if the ped is/was not in a vehicle.
 */
global.GetVehiclePedIsIn = function (ped, lastVehicle) {
	return _in(0x00000000, 0xafe92319, ped, lastVehicle, _r, _ri);
};

/**
 * GET_VEHICLE_PETROL_TANK_HEALTH
 */
global.GetVehiclePetrolTankHealth = function (vehicle) {
	return _in(0x00000000, 0xe41595ce, vehicle, _r, _rf);
};

/**
 * GET_VEHICLE_RADIO_STATION_INDEX
 */
global.GetVehicleRadioStationIndex = function (vehicle) {
	return _in(0x00000000, 0x57037960, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_ROOF_LIVERY
 */
global.GetVehicleRoofLivery = function (vehicle) {
	return _in(0x00000000, 0x0872cf42, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_STEERING_ANGLE
 */
global.GetVehicleSteeringAngle = function (vehicle) {
	return _in(0x00000000, 0x1382fcea, vehicle, _r, _rf);
};

/**
 * Returns the type of the passed vehicle.
 * ### Vehicle types
 * *   automobile
 * *   bike
 * *   boat
 * *   heli
 * *   plane
 * *   submarine
 * *   trailer
 * *   train
 * @param vehicle The vehicle's entity handle.
 * @return If the entity is a vehicle, the vehicle type. If it is not a vehicle, the return value will be null.
 */
global.GetVehicleType = function (vehicle) {
	return _in(0x00000000, 0xa273060e, vehicle, _r, _s);
};

/**
 * GET_VEHICLE_TYRE_SMOKE_COLOR
 */
global.GetVehicleTyreSmokeColor = function (vehicle) {
	return _in(0x00000000, 0x75280015, vehicle, _i, _i, _i);
};

/**
 * GET_VEHICLE_WHEEL_TYPE
 */
global.GetVehicleWheelType = function (vehicle) {
	return _in(0x00000000, 0xda58d7ae, vehicle, _r, _ri);
};

/**
 * GET_VEHICLE_WINDOW_TINT
 */
global.GetVehicleWindowTint = function (vehicle) {
	return _in(0x00000000, 0x13d53892, vehicle, _r, _ri);
};

/**
 * GIVE_WEAPON_COMPONENT_TO_PED
 */
global.GiveWeaponComponentToPed = function (ped, weaponHash, componentHash) {
	return _in(0x00000000, 0x3e1e286d, ped, _ch(weaponHash), _ch(componentHash));
};

/**
 * GIVE_WEAPON_TO_PED
 */
global.GiveWeaponToPed = function (ped, weaponHash, ammoCount, isHidden, bForceInHand) {
	return _in(0x00000000, 0xc4d88a85, ped, _ch(weaponHash), ammoCount, isHidden, bForceInHand);
};

/**
 * HAS_ENTITY_BEEN_MARKED_AS_NO_LONGER_NEEDED
 */
global.HasEntityBeenMarkedAsNoLongerNeeded = function (vehicle) {
	return _in(0x00000000, 0x9c9a3be0, vehicle, _r);
};

/**
 * HAS_VEHICLE_BEEN_DAMAGED_BY_BULLETS
 * @param vehicle The target vehicle.
 * @return Returns whether or not the target vehicle has been damaged by bullets.
 */
global.HasVehicleBeenDamagedByBullets = function (vehicle) {
	return _in(0x00000000, 0xb8af3137, vehicle, _r);
};

/**
 * HAS_VEHICLE_BEEN_OWNED_BY_PLAYER
 */
global.HasVehicleBeenOwnedByPlayer = function (vehicle) {
	return _in(0x00000000, 0xe4e83a5b, vehicle, _r);
};

/**
 * INVOKE_FUNCTION_REFERENCE
 */
global.InvokeFunctionReference = function (referenceIdentity, argsSerialized, argsLength, retvalLength) {
	return _in(0x00000000, 0xe3551879, _ts(referenceIdentity), _ts(argsSerialized), argsLength, _ii(retvalLength) /* may be optional */, _r, _s);
};

/**
 * IS_ACE_ALLOWED
 */
global.IsAceAllowed = function (object) {
	return _in(0x00000000, 0x7ebb9929, _ts(object), _r);
};

/**
 * IS_BOAT_ANCHORED_AND_FROZEN
 * @param vehicle The target vehicle.
 * @return Returns whether or not the boat is anchored and frozen.
 */
global.IsBoatAnchoredAndFrozen = function (vehicle) {
	return _in(0x00000000, 0xd5c39ee6, vehicle, _r);
};

/**
 * IS_BOAT_WRECKED
 * @param vehicle The target vehicle.
 * @return Returns whether or not the boat is wrecked.
 */
global.IsBoatWrecked = function (vehicle) {
	return _in(0x00000000, 0x9049db44, vehicle, _r);
};

/**
 * Gets whether or not this is the CitizenFX server.
 * @return A boolean value.
 */
global.IsDuplicityVersion = function () {
	return _in(0x00000000, 0xcf24c52e, _r);
};

/**
 * A getter for [FREEZE_ENTITY_POSITION](#\_0x428CA6DBD1094446).
 * @param entity The entity to check for
 * @return Boolean stating if it is frozen or not.
 */
global.IsEntityPositionFrozen = function (entity) {
	return _in(0x00000000, 0xedbe6add, entity, _r);
};

/**
 * This native checks if the given entity is visible.
 * @return Returns `true` if the entity is visible, `false` otherwise.
 */
global.IsEntityVisible = function (entity) {
	return _in(0x00000000, 0x120b4ed5, entity, _r);
};

/**
 * IS_FLASH_LIGHT_ON
 * @param ped The target ped.
 * @return Whether or not the ped's flash light is on.
 */
global.IsFlashLightOn = function (ped) {
	return _in(0x00000000, 0x76876154, ped, _r);
};

/**
 * This native checks if the given ped is a player.
 * @return Returns `true` if the ped is a player, `false` otherwise.
 */
global.IsPedAPlayer = function (ped) {
	return _in(0x00000000, 0x404794ca, ped, _r);
};

/**
 * IS_PED_HANDCUFFED
 * @param ped The target ped.
 * @return Whether or not the ped is handcuffed.
 */
global.IsPedHandcuffed = function (ped) {
	return _in(0x00000000, 0x25865633, ped, _r);
};

/**
 * IS_PED_RAGDOLL
 * @param ped The target ped.
 * @return Whether or not the ped is ragdolling.
 */
global.IsPedRagdoll = function (ped) {
	return _in(0x00000000, 0xc833bbe1, ped, _r);
};

/**
 * IS_PED_STRAFING
 * @param ped The target ped.
 * @return Whether or not the ped is strafing.
 */
global.IsPedStrafing = function (ped) {
	return _in(0x00000000, 0xefeed13c, ped, _r);
};

/**
 * IS_PED_USING_ACTION_MODE
 * @param ped The target ped.
 * @return Whether or not the ped is using action mode.
 */
global.IsPedUsingActionMode = function (ped) {
	return _in(0x00000000, 0x5ae7eda2, ped, _r);
};

/**
 * IS_PLAYER_ACE_ALLOWED
 */
global.IsPlayerAceAllowed = function (playerSrc, object) {
	return _in(0x00000000, 0xdedae23d, _ts(playerSrc), _ts(object), _r);
};

/**
 * Requests whether or not the commerce data for the specified player has loaded.
 * @param playerSrc The player handle
 * @return A boolean.
 */
global.IsPlayerCommerceInfoLoaded = function (playerSrc) {
	return _in(0x00000000, 0xbefe93f4, _ts(playerSrc), _r);
};

/**
 * Requests whether or not the commerce data for the specified player has loaded from Tebex.
 * @param playerSrc The player handle
 * @return A boolean.
 */
global.IsPlayerCommerceInfoLoadedExt = function (playerSrc) {
	return _in(0x00000000, 0x1d14f4fe, _ts(playerSrc), _r);
};

/**
 * This will return true if the player is evading wanted level, meaning that the wanted level stars are blink.
 * Otherwise will return false.
 * If the player is not wanted, it simply returns false.
 * @param playerSrc The target player
 * @return boolean value, depending if the player is evading his wanted level or not.
 */
global.IsPlayerEvadingWantedLevel = function (playerSrc) {
	return _in(0x00000000, 0x89a3881a, _ts(playerSrc), _r);
};

/**
 * IS_PLAYER_USING_SUPER_JUMP
 * @param playerSrc The player handle
 * @return A boolean.
 */
global.IsPlayerUsingSuperJump = function (playerSrc) {
	return _in(0x00000000, 0xc7d2c20c, _ts(playerSrc), _r);
};

/**
 * IS_PRINCIPAL_ACE_ALLOWED
 */
global.IsPrincipalAceAllowed = function (principal, object) {
	return _in(0x00000000, 0x37cf52ce, _ts(principal), _ts(object), _r);
};

/**
 * IS_VEHICLE_ENGINE_STARTING
 */
global.IsVehicleEngineStarting = function (vehicle) {
	return _in(0x00000000, 0xbb340d04, vehicle, _r);
};

/**
 * IS_VEHICLE_EXTRA_TURNED_ON
 */
global.IsVehicleExtraTurnedOn = function (vehicle, extraId) {
	return _in(0x00000000, 0x042098b5, vehicle, extraId, _r);
};

/**
 * IS_VEHICLE_SIREN_ON
 */
global.IsVehicleSirenOn = function (vehicle) {
	return _in(0x00000000, 0x25eb5873, vehicle, _r);
};

/**
 * IS_VEHICLE_TYRE_BURST
 */
global.IsVehicleTyreBurst = function (vehicle, wheelID, completely) {
	return _in(0x00000000, 0x48c80210, vehicle, wheelID, completely, _r);
};

/**
 * See the client-side [IS_VEHICLE_WINDOW_INTACT](https://docs.fivem.net/natives/?\_0x46E571A0E20D01F1) for a window indexes list.
 * @param vehicle The target vehicle.
 * @param windowIndex The window index.
 */
global.IsVehicleWindowIntact = function (vehicle, windowIndex) {
	return _in(0x00000000, 0xac4ef23d, vehicle, windowIndex, _r);
};

/**
 * Requests the commerce data for the specified player, including the owned SKUs. Use `IS_PLAYER_COMMERCE_INFO_LOADED` to check if it has loaded.
 * @param playerSrc The player handle
 */
global.LoadPlayerCommerceData = function (playerSrc) {
	return _in(0x00000000, 0xa8f63eab, _ts(playerSrc));
};

/**
 * Requests the commerce data from Tebex for the specified player, including the owned SKUs. Use `IS_PLAYER_COMMERCE_INFO_LOADED` to check if it has loaded.
 * @param playerSrc The player handle
 */
global.LoadPlayerCommerceDataExt = function (playerSrc) {
	return _in(0x00000000, 0x7995539e, _ts(playerSrc));
};

/**
 * Reads the contents of a text file in a specified resource.
 * If executed on the client, this file has to be included in `files` in the resource manifest.
 * Example: `local data = LoadResourceFile("devtools", "data.json")`
 * @param resourceName The resource name.
 * @param fileName The file in the resource.
 * @return The file contents
 */
global.LoadResourceFile = function (resourceName, fileName) {
	return _in(0x00000000, 0x76a9ee1f, _ts(resourceName), _ts(fileName), _r, _s);
};

/**
 * Create a permanent voice channel.
 * @param id ID of the channel.
 */
global.MumbleCreateChannel = function (id) {
	return _in(0x00000000, 0x262663c5, id);
};

/**
 * Checks if the player is currently muted
 * @param playerSrc The player to get the mute state for
 * @return Whether or not the player is muted
 */
global.MumbleIsPlayerMuted = function (playerSrc) {
	return _in(0x00000000, 0x1d5d50c2, playerSrc, _r);
};

/**
 * Mutes or unmutes the specified player
 * @param playerSrc The player to set the mute state of
 * @param toggle Whether to mute or unmute the player
 */
global.MumbleSetPlayerMuted = function (playerSrc, toggle) {
	return _in(0x00000000, 0xcc6c2eb1, playerSrc, toggle);
};

/**
 * NETWORK_GET_ENTITY_FROM_NETWORK_ID
 */
global.NetworkGetEntityFromNetworkId = function (netId) {
	return _in(0x00000000, 0x5b912c3f, netId, _r, _ri);
};

/**
 * Returns the owner ID of the specified entity.
 * @param entity The entity to get the owner for.
 * @return On the server, the server ID of the entity owner. On the client, returns the player/slot ID of the entity owner.
 */
global.NetworkGetEntityOwner = function (entity) {
	return _in(0x00000000, 0x526fee31, entity, _r, _ri);
};

/**
 * Returns the first owner ID of the specified entity.
 * @param entity The entity to get the first owner for.
 * @return The server ID of the first entity owner.
 */
global.NetworkGetFirstEntityOwner = function (entity) {
	return _in(0x00000000, 0x1e546224, entity, _r, _ri);
};

/**
 * NETWORK_GET_NETWORK_ID_FROM_ENTITY
 */
global.NetworkGetNetworkIdFromEntity = function (entity) {
	return _in(0x00000000, 0x9e35dab6, entity, _r, _ri);
};

/**
 * NETWORK_GET_VOICE_PROXIMITY_OVERRIDE_FOR_PLAYER
 * @param playerSrc The player handle
 */
global.NetworkGetVoiceProximityOverrideForPlayer = function (playerSrc) {
	return _in(0x00000000, 0xffeef513, _ts(playerSrc), _r, _rv);
};

/**
 * PERFORM_HTTP_REQUEST_INTERNAL
 */
global.PerformHttpRequestInternal = function (requestData, requestDataLength) {
	return _in(0x00000000, 0x8e8cc653, _ts(requestData), requestDataLength, _r, _ri);
};

/**
 * PERFORM_HTTP_REQUEST_INTERNAL_EX
 */
global.PerformHttpRequestInternalEx = function (requestData) {
	return _in(0x00000000, 0x6b171e87, ...(_obj(requestData)), _r, _ri);
};

/**
 * Prints 'structured trace' data to the server `file descriptor 3` channel. This is not generally useful outside of
 * server monitoring utilities.
 * @param jsonString JSON data to submit as `payload` in the `script_structured_trace` event.
 */
global.PrintStructuredTrace = function (jsonString) {
	return _in(0x00000000, 0x90892ded, _ts(jsonString));
};

/**
 * Scope entry for profiler.
 * @param scopeName Scope name.
 */
global.ProfilerEnterScope = function (scopeName) {
	return _in(0x00000000, 0xc795a4a9, _ts(scopeName));
};

/**
 * Scope exit for profiler.
 */
global.ProfilerExitScope = function () {
	return _in(0x00000000, 0xb39ca35c);
};

/**
 * Returns true if the profiler is active.
 * @return True or false.
 */
global.ProfilerIsRecording = function () {
	return _in(0x00000000, 0xf8b7d7bb, _r);
};

/**
 * Registered commands can be executed by entering them in the client console (this works for client side and server side registered commands). Or by entering them in the server console/through an RCON client (only works for server side registered commands). Or if you use a supported chat resource, like the default one provided in the cfx-server-data repository, then you can enter the command in chat by prefixing it with a `/`.
 * Commands registered using this function can also be executed by resources, using the [`ExecuteCommand` native](#\_0x561C060B).
 * The restricted bool is not used on the client side. Permissions can only be checked on the server side, so if you want to limit your command with an ace permission automatically, make it a server command (by registering it in a server script).
 * **Example result**:
 * ![](https://i.imgur.com/TaCnG09.png)
 * @param commandName The command you want to register.
 * @param handler A handler function that gets called whenever the command is executed.
 * @param restricted If this is a server command and you set this to true, then players will need the command.yourCommandName ace permission to execute this command.
 */
global.RegisterCommand = function (commandName, handler, restricted) {
	return _in(0x00000000, 0x5fa79b0f, _ts(commandName), _mfr(handler), restricted);
};

/**
 * Registers a listener for console output messages.
 * @param listener A function of `(channel: string, message: string) => void`. The message might contain `\n`.
 */
global.RegisterConsoleListener = function (listener) {
	return _in(0x00000000, 0x281b5448, _mfr(listener));
};

/**
 * An internal function which allows the current resource's HLL script runtimes to receive state for the specified event.
 * @param eventName An event name, or "\*" to disable HLL event filtering for this resource.
 */
global.RegisterResourceAsEventHandler = function (eventName) {
	return _in(0x00000000, 0xd233a168, _ts(eventName));
};

/**
 * **Experimental**: This native may be altered or removed in future versions of CitizenFX without warning.
 * Registers a cached resource asset with the resource system, similar to the automatic scanning of the `stream/` folder.
 * @param resourceName The resource to add the asset to.
 * @param fileName A file name in the resource.
 * @return A cache string to pass to `REGISTER_STREAMING_FILE_FROM_CACHE` on the client.
 */
global.RegisterResourceAsset = function (resourceName, fileName) {
	return _in(0x00000000, 0x9862b266, _ts(resourceName), _ts(fileName), _r, _s);
};

/**
 * Registers a build task factory for resources.
 * The function should return an object (msgpack map) with the following fields:
 * ```
 * {
 * // returns whether the specific resource should be built
 * shouldBuild = func(resourceName: string): bool,
 * // asynchronously start building the specific resource.
 * // call cb when completed
 * build = func(resourceName: string, cb: func(success: bool, status: string): void): void
 * }
 * ```
 * @param factoryId The identifier for the build task.
 * @param factoryFn The factory function.
 */
global.RegisterResourceBuildTaskFactory = function (factoryId, factoryFn) {
	return _in(0x00000000, 0x285b43ca, _ts(factoryId), _mfr(factoryFn));
};

/**
 * Parameter `p1` does not seem to be used or referenced in game binaries.\
 * **Note:** When called for networked entities, a `CRemoveAllWeaponsEvent` will be created per request.
 * @param ped The ped entity
 */
global.RemoveAllPedWeapons = function (ped, p1) {
	return _in(0x00000000, 0xa44ce817, ped, p1);
};

/**
 * Removes the blip from your map.
 * @param blip Blip handle to remove.
 */
global.RemoveBlip = function (blip) {
	return _in(0x00000000, 0xd8c3c1cd, _ii(blip) /* may be optional */);
};

/**
 * **Experimental**: This native may be altered or removed in future versions of CitizenFX without warning.
 * Removes a handler for changes to a state bag.
 * @param cookie The cookie.
 */
global.RemoveStateBagChangeHandler = function (cookie) {
	return _in(0x00000000, 0xd36be661, cookie);
};

/**
 * REMOVE_WEAPON_COMPONENT_FROM_PED
 */
global.RemoveWeaponComponentFromPed = function (ped, weaponHash, componentHash) {
	return _in(0x00000000, 0x412aa00d, ped, _ch(weaponHash), _ch(componentHash));
};

/**
 * This native removes a specified weapon from your selected ped.
 * Weapon Hashes: pastebin.com/0wwDZgkF
 * Example:
 * C#:
 * Function.Call(Hash.REMOVE_WEAPON_FROM_PED, Game.Player.Character, 0x99B507EA);
 * C++:
 * WEAPON::REMOVE_WEAPON_FROM_PED(PLAYER::PLAYER_PED_ID(), 0x99B507EA);
 * The code above removes the knife from the player.
 */
global.RemoveWeaponFromPed = function (ped, weaponHash) {
	return _in(0x00000000, 0x9c37f220, ped, _ch(weaponHash));
};

/**
 * Requests the specified player to buy the passed SKU. This'll pop up a prompt on the client, which upon acceptance
 * will open the browser prompting further purchase details.
 * @param playerSrc The player handle
 * @param skuId The ID of the SKU.
 */
global.RequestPlayerCommerceSession = function (playerSrc, skuId) {
	return _in(0x00000000, 0x96f93cce, _ts(playerSrc), skuId);
};

/**
 * Writes the specified data to a file in the specified resource.
 * Using a length of `-1` will automatically detect the length assuming the data is a C string.
 * @param resourceName The name of the resource.
 * @param fileName The name of the file.
 * @param data The data to write to the file.
 * @param dataLength The length of the written data.
 * @return A value indicating if the write succeeded.
 */
global.SaveResourceFile = function (resourceName, fileName, data, dataLength) {
	return _in(0x00000000, 0xa09e7e7b, _ts(resourceName), _ts(fileName), _ts(data), dataLength, _r);
};

/**
 * Scans the resources in the specified resource root. This function is only available in the 'monitor mode' process and is
 * not available for user resources.
 * @param rootPath The resource directory to scan.
 * @param callback A callback that will receive an object with results.
 */
global.ScanResourceRoot = function (rootPath, callback) {
	return _in(0x00000000, 0x636f097f, _ts(rootPath), _mfr(callback));
};

/**
 * Schedules the specified resource to run a tick as soon as possible, bypassing the server's fixed tick rate.
 * @param resourceName The resource to tick.
 */
global.ScheduleResourceTick = function (resourceName) {
	return _in(0x00000000, 0xb88a73ad, _ts(resourceName));
};

/**
 * Sets the displayed sprite for a specific blip.
 * There's a [list of sprites](https://docs.fivem.net/game-references/blips/) on the FiveM documentation site.
 * @param blip The blip to change.
 * @param spriteId The sprite ID to set.
 */
global.SetBlipSprite = function (blip, spriteId) {
	return _in(0x00000000, 0x8dbbb0b9, blip, spriteId);
};

/**
 * SET_CONVAR
 */
global.SetConvar = function (varName, value) {
	return _in(0x00000000, 0x341b16d2, _ts(varName), _ts(value));
};

/**
 * Used to replicate a server variable onto clients.
 * @param varName The console variable name.
 * @param value The value to set for the given console variable.
 */
global.SetConvarReplicated = function (varName, value) {
	return _in(0x00000000, 0xf292858c, _ts(varName), _ts(value));
};

/**
 * SET_CONVAR_SERVER_INFO
 */
global.SetConvarServerInfo = function (varName, value) {
	return _in(0x00000000, 0x9338d547, _ts(varName), _ts(value));
};

/**
 * SET_CURRENT_PED_WEAPON
 */
global.SetCurrentPedWeapon = function (ped, weaponHash, bForceInHand) {
	return _in(0x00000000, 0xb8278882, ped, _ch(weaponHash), bForceInHand);
};

/**
 * Sets the coordinates (world position) for a specified entity, offset by the radius of the entity on the Z axis.
 * @param entity The entity to change coordinates for.
 * @param xPos The X coordinate.
 * @param yPos The Y coordinate.
 * @param zPos The Z coordinate, ground level.
 * @param alive Unused by the game, potentially used by debug builds of GTA in order to assert whether or not an entity was alive.
 * @param deadFlag Whether to disable physics for dead peds, too, and not just living peds.
 * @param ragdollFlag A special flag used for ragdolling peds.
 * @param clearArea Whether to clear any entities in the target area.
 */
global.SetEntityCoords = function (entity, xPos, yPos, zPos, alive, deadFlag, ragdollFlag, clearArea) {
	return _in(0x00000000, 0xdf70b41b, entity, _fv(xPos), _fv(yPos), _fv(zPos), alive, deadFlag, ragdollFlag, clearArea);
};

/**
 * It overrides the default distance culling radius of an entity. Set to `0.0` to reset.
 * If you want to interact with an entity outside of your players' scopes set the radius to a huge number.
 * **WARNING**: Culling natives are deprecated and have known, [unfixable issues](https://forum.cfx.re/t/issue-with-culling-radius-and-server-side-entities/4900677/4)
 * @param entity The entity handle to override the distance culling radius.
 * @param radius The new distance culling radius.
 */
global.SetEntityDistanceCullingRadius = function (entity, radius) {
	return _in(0x00000000, 0xd3a183a3, entity, _fv(radius));
};

/**
 * Set the heading of an entity in degrees also known as "Yaw".
 * @param entity The entity to set the heading for.
 * @param heading The heading in degrees.
 */
global.SetEntityHeading = function (entity, heading) {
	return _in(0x00000000, 0xe0ff064d, entity, _fv(heading));
};

/**
 * It allows to flag an entity to ignore the request control filter policy.
 * @param entity The entity handle to ignore the request control filter.
 * @param ignore Define if the entity ignores the request control filter policy.
 */
global.SetEntityIgnoreRequestControlFilter = function (entity, ignore) {
	return _in(0x00000000, 0x9f7f8d36, entity, ignore);
};

/**
 * SET_ENTITY_ROTATION
 * @param rotationOrder The order yaw pitch roll are applied, see [`GET_ENTITY_ROTATION`](#\_0xAFBD61CC738D9EB9).
 */
global.SetEntityRotation = function (entity, pitch, roll, yaw, rotationOrder, p5) {
	return _in(0x00000000, 0x0a345efe, entity, _fv(pitch), _fv(roll), _fv(yaw), rotationOrder, p5);
};

/**
 * Sets the routing bucket for the specified entity.
 * Routing buckets are also known as 'dimensions' or 'virtual worlds' in past echoes, however they are population-aware.
 * @param entity The entity to set the routing bucket for.
 * @param bucket The bucket ID.
 */
global.SetEntityRoutingBucket = function (entity, bucket) {
	return _in(0x00000000, 0x635e5289, entity, bucket);
};

/**
 * Note that the third parameter(denoted as z) is "up and down" with positive numbers encouraging upwards movement.
 */
global.SetEntityVelocity = function (entity, x, y, z) {
	return _in(0x00000000, 0xff5a1988, entity, _fv(x), _fv(y), _fv(z));
};

/**
 * SET_GAME_TYPE
 */
global.SetGameType = function (gametypeName) {
	return _in(0x00000000, 0xf90b7469, _ts(gametypeName));
};

/**
 * Sets the handler for HTTP requests made to the executing resource.
 * Example request URL: `http://localhost:30120/http-test/ping` - this request will be sent to the `http-test` resource with the `/ping` path.
 * The handler function assumes the following signature:
 * ```ts
 * function HttpHandler(
 * request: {
 * address: string;
 * headers: Record<string, string>;
 * method: string;
 * path: string;
 * setDataHandler(handler: (data: string) => void): void;
 * setDataHandler(handler: (data: ArrayBuffer) => void, binary: 'binary'): void;
 * setCancelHandler(handler: () => void): void;
 * },
 * response: {
 * writeHead(code: number, headers?: Record<string, string | string[]>): void;
 * write(data: string): void;
 * send(data?: string): void;
 * }
 * ): void;
 * ```
 * *   **request**: The request object.
 * *   **address**: The IP address of the request sender.
 * *   **path**: The path to where the request was sent.
 * *   **headers**: The headers sent with the request.
 * *   **method**: The request method.
 * *   **setDataHandler**: Sets the handler for when a data body is passed with the request. Additionally you can pass the `'binary'` argument to receive a `BufferArray` in JavaScript or `System.Byte[]` in C# (has no effect in Lua).
 * *   **setCancelHandler**: Sets the handler for when the request is cancelled.
 * *   **response**: An object to control the response.
 * *   **writeHead**: Sets the status code & headers of the response. Can be only called once and won't work if called after running other response functions.
 * *   **write**: Writes to the response body without sending it. Can be called multiple times.
 * *   **send**: Writes to the response body and then sends it along with the status code & headers, finishing the request.
 * @param handler The handler function.
 */
global.SetHttpHandler = function (handler) {
	return _in(0x00000000, 0xf5c6330c, _mfr(handler));
};

/**
 * SET_MAP_NAME
 */
global.SetMapName = function (mapName) {
	return _in(0x00000000, 0xb7ba82dc, _ts(mapName));
};

/**
 * NativeDB Added Parameter 4: BOOL p3
 */
global.SetPedAmmo = function (ped, weaponHash, ammo) {
	return _in(0x00000000, 0xbf90df1a, ped, _ch(weaponHash), ammo);
};

/**
 * Sets the armor of the specified ped.
 * ped: The Ped to set the armor of.
 * amount: A value between 0 and 100 indicating the value to set the Ped's armor to.
 */
global.SetPedArmour = function (ped, amount) {
	return _in(0x00000000, 0x4e3a0cc4, ped, amount);
};

/**
 * SET_PED_CAN_RAGDOLL
 */
global.SetPedCanRagdoll = function (ped, toggle) {
	return _in(0x00000000, 0xcf1384c4, ped, toggle);
};

/**
 * This native is used to set component variation on a ped. Components, drawables and textures IDs are related to the ped model.
 * ### MP Freemode list of components
 * **0**: Face
 * **1**: Mask
 * **2**: Hair
 * **3**: Torso
 * **4**: Leg
 * **5**: Parachute / bag
 * **6**: Shoes
 * **7**: Accessory
 * **8**: Undershirt
 * **9**: Kevlar
 * **10**: Badge
 * **11**: Torso 2
 * List of Component IDs
 * ```cpp
 * // Components
 * enum ePedVarComp
 * {
 * PV_COMP_INVALID = 0xFFFFFFFF,
 * PV_COMP_HEAD = 0, // "HEAD"
 * PV_COMP_BERD = 1, // "BEARD"
 * PV_COMP_HAIR = 2, // "HAIR"
 * PV_COMP_UPPR = 3, // "UPPER"
 * PV_COMP_LOWR = 4, // "LOWER"
 * PV_COMP_HAND = 5, // "HAND"
 * PV_COMP_FEET = 6, // "FEET"
 * PV_COMP_TEEF = 7, // "TEETH"
 * PV_COMP_ACCS = 8, // "ACCESSORIES"
 * PV_COMP_TASK = 9, // "TASK"
 * PV_COMP_DECL = 10, // "DECL"
 * PV_COMP_JBIB = 11, // "JBIB"
 * PV_COMP_MAX = 12,
 * };
 * ```
 * @param ped The ped handle.
 * @param componentId The component that you want to set.
 * @param drawableId The drawable id that is going to be set. Refer to [GET_NUMBER_OF_PED_DRAWABLE_VARIATIONS](#\_0x27561561732A7842).
 * @param textureId The texture id of the drawable. Refer to [GET_NUMBER_OF_PED_TEXTURE_VARIATIONS](#\_0x8F7156A3142A6BAD).
 * @param paletteId 0 to 3.
 */
global.SetPedComponentVariation = function (ped, componentId, drawableId, textureId, paletteId) {
	return _in(0x00000000, 0xd4f7b05c, ped, componentId, drawableId, textureId, paletteId);
};

/**
 * cpp
 * // Potential names and hash collisions included as comments
 * enum ePedConfigFlags {
 * _0x67D1A445 = 0,
 * _0xC63DE95E = 1,
 * CPED_CONFIG_FLAG_NoCriticalHits = 2,
 * CPED_CONFIG_FLAG_DrownsInWater = 3,
 * CPED_CONFIG_FLAG_DisableReticuleFixedLockon = 4,
 * _0x37D196F4 = 5,
 * _0xE2462399 = 6,
 * CPED_CONFIG_FLAG_UpperBodyDamageAnimsOnly = 7,
 * _0xEDDEB838 = 8,
 * _0xB398B6FD = 9,
 * _0xF6664E68 = 10,
 * _0xA05E7CA3 = 11,
 * _0xCE394045 = 12,
 * CPED_CONFIG_FLAG_NeverLeavesGroup = 13,
 * _0xCD8D1411 = 14,
 * _0xB031F1A9 = 15,
 * _0xFE65BEE3 = 16,
 * CPED_CONFIG_FLAG_BlockNonTemporaryEvents = 17,
 * _0x380165BD = 18,
 * _0x07C045C7 = 19,
 * _0x583B5E2D = 20,
 * _0x475EDA58 = 21,
 * _0x8629D05B = 22,
 * _0x1522968B = 23,
 * CPED_CONFIG_FLAG_IgnoreSeenMelee = 24,
 * _0x4CC09C4B = 25,
 * _0x034F3053 = 26,
 * _0xD91BA7CC = 27,
 * _0x5C8DC66E = 28,
 * _0x8902EAA0 = 29,
 * _0x6580B9D2 = 30,
 * _0x0EF7A297 = 31,
 * _0x6BF86E5B = 32,
 * CPED_CONFIG_FLAG_DieWhenRagdoll = 33,
 * CPED_CONFIG_FLAG_HasHelmet = 34,
 * CPED_CONFIG_FLAG_UseHelmet = 35,
 * _0xEEB3D630 = 36,
 * _0xB130D17B = 37,
 * _0x5F071200 = 38,
 * CPED_CONFIG_FLAG_DisableEvasiveDives = 39,
 * _0xC287AAFF = 40,
 * _0x203328CC = 41,
 * CPED_CONFIG_FLAG_DontInfluenceWantedLevel = 42,
 * CPED_CONFIG_FLAG_DisablePlayerLockon = 43,
 * CPED_CONFIG_FLAG_DisableLockonToRandomPeds = 44,
 * _0xEC4A8ACF = 45,
 * _0xDB115BFA = 46,
 * CPED_CONFIG_FLAG_PedBeingDeleted = 47,
 * CPED_CONFIG_FLAG_BlockWeaponSwitching = 48,
 * _0xF8E99565 = 49,
 * _0xDD17FEE6 = 50,
 * _0x7ED9B2C9 = 51,
 * _0x655E8618 = 52,
 * _0x5A6C1F6E = 53,
 * _0xD749FC41 = 54,
 * _0x357F63F3 = 55,
 * _0xC5E60961 = 56,
 * _0x29275C3E = 57,
 * CPED_CONFIG_FLAG_IsFiring = 58,
 * CPED_CONFIG_FLAG_WasFiring = 59,
 * CPED_CONFIG_FLAG_IsStanding = 60,
 * CPED_CONFIG_FLAG_WasStanding = 61,
 * CPED_CONFIG_FLAG_InVehicle = 62,
 * CPED_CONFIG_FLAG_OnMount = 63,
 * CPED_CONFIG_FLAG_AttachedToVehicle = 64,
 * CPED_CONFIG_FLAG_IsSwimming = 65,
 * CPED_CONFIG_FLAG_WasSwimming = 66,
 * CPED_CONFIG_FLAG_IsSkiing = 67,
 * CPED_CONFIG_FLAG_IsSitting = 68,
 * CPED_CONFIG_FLAG_KilledByStealth = 69,
 * CPED_CONFIG_FLAG_KilledByTakedown = 70,
 * CPED_CONFIG_FLAG_Knockedout = 71,
 * _0x3E3C4560 = 72,
 * _0x2994C7B7 = 73,
 * _0x6D59D275 = 74,
 * CPED_CONFIG_FLAG_UsingCoverPoint = 75,
 * CPED_CONFIG_FLAG_IsInTheAir = 76,
 * _0x2D493FB7 = 77,
 * CPED_CONFIG_FLAG_IsAimingGun = 78,
 * _0x14D69875 = 79,
 * _0x40B05311 = 80,
 * _0x8B230BC5 = 81,
 * _0xC74E5842 = 82,
 * _0x9EA86147 = 83,
 * _0x674C746C = 84,
 * _0x3E56A8C2 = 85,
 * _0xC144A1EF = 86,
 * _0x0548512D = 87,
 * _0x31C93909 = 88,
 * _0xA0269315 = 89,
 * _0xD4D59D4D = 90,
 * _0x411D4420 = 91,
 * _0xDF4AEF0D = 92,
 * CPED_CONFIG_FLAG_ForcePedLoadCover = 93,
 * _0x300E4CD3 = 94,
 * _0xF1C5BF04 = 95,
 * _0x89C2EF13 = 96,
 * CPED_CONFIG_FLAG_VaultFromCover = 97,
 * _0x02A852C8 = 98,
 * _0x3D9407F1 = 99,
 * _0x319B4558 = 100,
 * CPED_CONFIG_FLAG_ForcedAim = 101,
 * _0xB942D71A = 102,
 * _0xD26C55A8 = 103,
 * _0xB89E703B = 104,
 * CPED_CONFIG_FLAG_ForceReload = 105,
 * _0xD9E73DA2 = 106,
 * _0xFF71DC2C = 107,
 * _0x1E27E8D8 = 108,
 * _0xF2C53966 = 109,
 * _0xC4DBE247 = 110,
 * _0x83C0A4BF = 111,
 * _0x0E0FAF8C = 112,
 * _0x26616660 = 113,
 * _0x43B80B79 = 114,
 * _0x0D2A9309 = 115,
 * _0x12C1C983 = 116,
 * CPED_CONFIG_FLAG_BumpedByPlayer = 117,
 * _0xE586D504 = 118,
 * _0x52374204 = 119,
 * CPED_CONFIG_FLAG_IsHandCuffed = 120,
 * CPED_CONFIG_FLAG_IsAnkleCuffed = 121,
 * CPED_CONFIG_FLAG_DisableMelee = 122,
 * _0xFE714397 = 123,
 * _0xB3E660BD = 124,
 * _0x5FED6BFD = 125,
 * _0xC9D6F66F = 126,
 * _0x519BC986 = 127,
 * CPED_CONFIG_FLAG_CanBeAgitated = 128,
 * _0x9A4B617C = 129, // CPED_CONFIG_FLAG_FaceDirInsult
 * _0xDAB70E9F = 130,
 * _0xE569438A = 131,
 * _0xBBC77D6D = 132,
 * _0xCB59EF0F = 133,
 * _0x8C5EA971 = 134,
 * CPED_CONFIG_FLAG_IsScuba = 135,
 * CPED_CONFIG_FLAG_WillArrestRatherThanJack = 136,
 * _0xDCE59B58 = 137,
 * CPED_CONFIG_FLAG_RidingTrain = 138,
 * CPED_CONFIG_FLAG_ArrestResult = 139,
 * CPED_CONFIG_FLAG_CanAttackFriendly = 140,
 * _0x98A4BE43 = 141,
 * _0x6901E731 = 142,
 * _0x9EC9BF6C = 143,
 * _0x42841A8F = 144,
 * CPED_CONFIG_FLAG_ShootingAnimFlag = 145,
 * CPED_CONFIG_FLAG_DisableLadderClimbing = 146,
 * CPED_CONFIG_FLAG_StairsDetected = 147,
 * CPED_CONFIG_FLAG_SlopeDetected = 148,
 * _0x1A15670B = 149,
 * _0x61786EE5 = 150,
 * _0xCB9186BD = 151,
 * _0xF0710152 = 152,
 * _0x43DFE310 = 153,
 * _0xC43C624E = 154,
 * CPED_CONFIG_FLAG_CanPerformArrest = 155,
 * CPED_CONFIG_FLAG_CanPerformUncuff = 156,
 * CPED_CONFIG_FLAG_CanBeArrested = 157,
 * _0xF7960FF5 = 158,
 * _0x59564113 = 159,
 * _0x0C6C3099 = 160,
 * _0x645F927A = 161,
 * _0xA86549B9 = 162,
 * _0x8AAF337A = 163,
 * _0x13BAA6E7 = 164,
 * _0x5FB9D1F5 = 165,
 * CPED_CONFIG_FLAG_IsInjured = 166,
 * _0x6398A20B = 167,
 * _0xD8072639 = 168,
 * _0xA05B1845 = 169,
 * _0x83F6D220 = 170,
 * _0xD8430331 = 171,
 * _0x4B547520 = 172,
 * _0xE66E1406 = 173,
 * _0x1C4BFE0C = 174,
 * _0x90008BFA = 175,
 * _0x07C7A910 = 176,
 * _0xF15F8191 = 177,
 * _0xCE4E8BE2 = 178,
 * _0x1D46E4F2 = 179,
 * CPED_CONFIG_FLAG_IsInCustody = 180,
 * _0xE4FD9B3A = 181,
 * _0x67AE0812 = 182,
 * CPED_CONFIG_FLAG_IsAgitated = 183,
 * CPED_CONFIG_FLAG_PreventAutoShuffleToDriversSeat = 184,
 * _0x7B2D325E = 185,
 * CPED_CONFIG_FLAG_EnableWeaponBlocking = 186,
 * CPED_CONFIG_FLAG_HasHurtStarted = 187,
 * CPED_CONFIG_FLAG_DisableHurt = 188,
 * CPED_CONFIG_FLAG_PlayerIsWeird = 189,
 * _0x32FC208B = 190,
 * _0x0C296E5A = 191,
 * _0xE63B73EC = 192,
 * _0x04E9CC80 = 193,
 * CPED_CONFIG_FLAG_UsingScenario = 194,
 * CPED_CONFIG_FLAG_VisibleOnScreen = 195,
 * _0xD88C58A1 = 196,
 * _0x5A3DCF43 = 197, // CPED_CONFIG_FLAG_AvoidUnderSide
 * _0xEA02B420 = 198,
 * _0x3F559CFF = 199,
 * _0x8C55D029 = 200,
 * _0x5E6466F6 = 201,
 * _0xEB5AD706 = 202,
 * _0x0EDDDDE7 = 203,
 * _0xA64F7B1D = 204,
 * _0x48532CBA = 205,
 * _0xAA25A9E7 = 206,
 * _0x415B26B9 = 207,
 * CPED_CONFIG_FLAG_DisableExplosionReactions = 208,
 * CPED_CONFIG_FLAG_DodgedPlayer = 209,
 * _0x67405504 = 210,
 * _0x75DDD68C = 211,
 * _0x2AD879B4 = 212,
 * _0x51486F91 = 213,
 * _0x32F79E21 = 214,
 * _0xBF099213 = 215,
 * _0x054AC8E2 = 216,
 * _0x14E495CC = 217,
 * _0x3C7DF9DF = 218,
 * _0x848FFEF2 = 219,
 * CPED_CONFIG_FLAG_DontEnterLeadersVehicle = 220,
 * _0x2618E1CF = 221,
 * _0x84F722FA = 222,
 * _0xD1B87B1F = 223,
 * _0x728AA918 = 224,
 * CPED_CONFIG_FLAG_DisablePotentialToBeWalkedIntoResponse = 225,
 * CPED_CONFIG_FLAG_DisablePedAvoidance = 226,
 * _0x59E91185 = 227,
 * _0x1EA7225F = 228,
 * CPED_CONFIG_FLAG_DisablePanicInVehicle = 229,
 * _0x6DCA7D88 = 230,
 * _0xFC3E572D = 231,
 * _0x08E9F9CF = 232,
 * _0x2D3BA52D = 233,
 * _0xFD2F53EA = 234,
 * _0x31A1B03B = 235,
 * CPED_CONFIG_FLAG_IsHoldingProp = 236,
 * _0x82ED0A66 = 237, // CPED_CONFIG_FLAG_BlocksPathingWhenDead
 * _0xCE57C9A3 = 238,
 * _0x26149198 = 239,
 * _0x1B33B598 = 240,
 * _0x719B6E87 = 241,
 * _0x13E8E8E8 = 242,
 * _0xF29739AE = 243,
 * _0xABEA8A74 = 244,
 * _0xB60EA2BA = 245,
 * _0x536B0950 = 246,
 * _0x0C754ACA = 247,
 * CPED_CONFIG_FLAG_DisableVehicleSeatRandomAnimations = 248,
 * _0x12659168 = 249,
 * _0x1BDF2F04 = 250,
 * _0x7728FAA3 = 251,
 * _0x6A807ED8 = 252,
 * CPED_CONFIG_FLAG_OnStairs = 253,
 * _0xE1A2F73F = 254,
 * _0x5B3697C8 = 255,
 * _0xF1EB20A9 = 256,
 * _0x8B7DF407 = 257,
 * _0x329DCF1A = 258,
 * _0x8D90DD1B = 259,
 * _0xB8A292B7 = 260,
 * _0x8374B087 = 261,
 * _0x2AF558F0 = 262,
 * _0x82251455 = 263,
 * _0x30CF498B = 264,
 * _0xE1CD50AF = 265,
 * _0x72E4AE48 = 266,
 * _0xC2657EA1 = 267,
 * _0x29FF6030 = 268,
 * _0x8248A5EC = 269,
 * CPED_CONFIG_FLAG_OnStairSlope = 270,
 * _0xA0897933 = 271,
 * CPED_CONFIG_FLAG_DontBlipCop = 272,
 * CPED_CONFIG_FLAG_ClimbedShiftedFence = 273,
 * _0xF7823618 = 274,
 * _0xDC305CCE = 275, // CPED_CONFIG_FLAG_KillWhenTrapped
 * CPED_CONFIG_FLAG_EdgeDetected = 276,
 * _0x92B67896 = 277,
 * _0xCAD677C9 = 278,
 * CPED_CONFIG_FLAG_AvoidTearGas = 279,
 * _0x5276AC7B = 280,
 * _0x1032692A = 281,
 * _0xDA23E7F1 = 282,
 * _0x9139724D = 283,
 * _0xA1457461 = 284,
 * _0x4186E095 = 285,
 * _0xAC68E2EB = 286,
 * CPED_CONFIG_FLAG_RagdollingOnBoat = 287,
 * CPED_CONFIG_FLAG_HasBrandishedWeapon = 288,
 * _0x1B9EE8A1 = 289,
 * _0xF3F5758C = 290,
 * _0x2A9307F1 = 291,
 * _0x7403D216 = 292,
 * _0xA06A3C6C = 293,
 * CPED_CONFIG_FLAG_DisableShockingEvents = 294,
 * _0xF8DA25A5 = 295,
 * _0x7EF55802 = 296,
 * _0xB31F1187 = 297,
 * _0x84315402 = 298,
 * _0x0FD69867 = 299,
 * _0xC7829B67 = 300,
 * CPED_CONFIG_FLAG_DisablePedConstraints = 301,
 * _0x6D23CF25 = 302,
 * _0x2ADA871B = 303,
 * _0x47BC8A58 = 304,
 * _0xEB692FA5 = 305,
 * _0x4A133C50 = 306,
 * _0xC58099C3 = 307,
 * _0xF3D76D41 = 308,
 * _0xB0EEE9F2 = 309,
 * CPED_CONFIG_FLAG_IsInCluster = 310,
 * _0x0FA153EF = 311,
 * _0xD73F5CD3 = 312,
 * _0xD4136C22 = 313,
 * _0xE404CA6B = 314,
 * _0xB9597446 = 315,
 * _0xD5C98277 = 316,
 * _0xD5060A9C = 317,
 * _0x3E5F1CBB = 318,
 * _0xD8BE1D54 = 319,
 * _0x0B1F191F = 320,
 * _0xC995167A = 321,
 * CPED_CONFIG_FLAG_HasHighHeels = 322,
 * _0x86B01E54 = 323,
 * _0x3A56FE15 = 324,
 * _0xC03B736C = 325, // CPED_CONFIG_FLAG_SpawnedAtScenario
 * _0xBBF47729 = 326,
 * _0x22B668A8 = 327,
 * _0x2624D4D4 = 328,
 * CPED_CONFIG_FLAG_DisableTalkTo = 329,
 * CPED_CONFIG_FLAG_DontBlip = 330,
 * CPED_CONFIG_FLAG_IsSwitchingWeapon = 331,
 * _0x630F55F3 = 332,
 * _0x150468FD = 333,
 * _0x914EBD6B = 334,
 * _0x79AF3B6D = 335,
 * _0x75C7A632 = 336,
 * _0x52D530E2 = 337,
 * _0xDB2A90E0 = 338,
 * _0x5922763D = 339,
 * _0x12ADB567 = 340,
 * _0x105C8518 = 341,
 * _0x106F703D = 342,
 * _0xED152C3E = 343,
 * _0xA0EFE6A8 = 344,
 * _0xBF348C82 = 345,
 * _0xCDDFE830 = 346,
 * _0x7B59BD9B = 347,
 * _0x0124C788 = 348,
 * CPED_CONFIG_FLAG_EquipJetpack = 349,
 * _0x08D361A5 = 350,
 * _0xE13D1F7C = 351,
 * _0x40E25FB9 = 352,
 * _0x930629D9 = 353,
 * _0xECCF0C7F = 354,
 * _0xB6E9613B = 355,
 * _0x490C0478 = 356,
 * _0xE8865BEA = 357,
 * _0xF3C34A29 = 358,
 * CPED_CONFIG_FLAG_IsDuckingInVehicle = 359,
 * _0xF660E115 = 360,
 * _0xAB0E6DED = 361,
 * CPED_CONFIG_FLAG_HasReserveParachute = 362,
 * CPED_CONFIG_FLAG_UseReserveParachute = 363,
 * _0x5C5D9CD3 = 364,
 * _0x8F7701F3 = 365,
 * _0xBC4436AD = 366,
 * _0xD7E07D37 = 367,
 * _0x03C4FD24 = 368,
 * _0x7675789A = 369,
 * _0xB7288A88 = 370,
 * _0xC06B6291 = 371,
 * _0x95A4A805 = 372,
 * _0xA8E9A042 = 373,
 * CPED_CONFIG_FLAG_NeverLeaveTrain = 374,
 * _0xBAC674B3 = 375,
 * _0x147F1FFB = 376,
 * _0x4376DD79 = 377,
 * _0xCD3DB518 = 378,
 * _0xFE4BA4B6 = 379,
 * _0x5DF03A55 = 380,
 * _0xBCD816CD = 381,
 * _0xCF02DD69 = 382,
 * _0xF73AFA2E = 383,
 * _0x80B9A9D0 = 384,
 * _0xF601F7EE = 385,
 * _0xA91350FC = 386,
 * _0x3AB23B96 = 387,
 * CPED_CONFIG_FLAG_IsClimbingLadder = 388,
 * CPED_CONFIG_FLAG_HasBareFeet = 389,
 * _0xB4B1CD4C = 390,
 * _0x5459AFB8 = 391,
 * _0x54F27667 = 392,
 * _0xC11D3E8F = 393,
 * _0x5419EB3E = 394,
 * _0x82D8DBB4 = 395,
 * _0x33B02D2F = 396,
 * _0xAE66176D = 397,
 * _0xA2692593 = 398,
 * _0x714C7E31 = 399,
 * _0xEC488AC7 = 400,
 * _0xAE398504 = 401,
 * _0xABC58D72 = 402,
 * _0x5E5B9591 = 403,
 * _0x6BA1091E = 404,
 * _0x77840177 = 405,
 * _0x1C7ACAC4 = 406,
 * _0x124420E9 = 407,
 * _0x75A65587 = 408,
 * _0xDFD2D55B = 409,
 * _0xBDD39919 = 410,
 * _0x43DEC267 = 411,
 * _0xE42B7797 = 412,
 * CPED_CONFIG_FLAG_IsHolsteringWeapon = 413,
 * _0x4F8149F5 = 414,
 * _0xDD9ECA7A = 415,
 * _0x9E7EF9D2 = 416,
 * _0x2C6ED942 = 417,
 * CPED_CONFIG_FLAG_IsSwitchingHelmetVisor = 418,
 * _0xA488727D = 419,
 * _0xCFF5F6DE = 420,
 * _0x6D614599 = 421,
 * CPED_CONFIG_FLAG_DisableVehicleCombat = 422,
 * _0xFE401D26 = 423,
 * CPED_CONFIG_FLAG_FallsLikeAircraft = 424,
 * _0x2B42AE82 = 425,
 * _0x7A95734F = 426,
 * _0xDF4D8617 = 427,
 * _0x578F1F14 = 428,
 * CPED_CONFIG_FLAG_DisableStartEngine = 429,
 * CPED_CONFIG_FLAG_IgnoreBeingOnFire = 430,
 * _0x153C9500 = 431,
 * _0xCB7A632E = 432,
 * _0xDE727981 = 433,
 * CPED_CONFIG_FLAG_DisableHomingMissileLockon = 434,
 * _0x12BBB935 = 435,
 * _0xAD0A1277 = 436,
 * _0xEA6AA46A = 437,
 * CPED_CONFIG_FLAG_DisableHelmetArmor = 438,
 * _0xCB7F3A1E = 439,
 * _0x50178878 = 440,
 * _0x051B4F0D = 441,
 * _0x2FC3DECC = 442,
 * _0xC0030B0B = 443,
 * _0xBBDAF1E9 = 444,
 * _0x944FE59C = 445,
 * _0x506FBA39 = 446,
 * _0xDD45FE84 = 447,
 * _0xE698AE75 = 448,
 * _0x199633F8 = 449,
 * CPED_CONFIG_FLAG_PedIsArresting = 450,
 * CPED_CONFIG_FLAG_IsDecoyPed = 451,
 * _0x3A251D83 = 452,
 * _0xA56F6986 = 453,
 * _0x1D19C622 = 454,
 * _0xB68D3EAB = 455,
 * CPED_CONFIG_FLAG_CanBeIncapacitated = 456,
 * _0x4BD5EBAD = 457,
 * }
 */
global.SetPedConfigFlag = function (ped, flagId, value) {
	return _in(0x00000000, 0x9cfbe10d, ped, flagId, value);
};

/**
 * Sets Ped Default Clothes
 */
global.SetPedDefaultComponentVariation = function (ped) {
	return _in(0x00000000, 0xc866a984, ped);
};

/**
 * Used for freemode (online) characters.
 * Indices:
 * 1.  black
 * 2.  very light blue/green
 * 3.  dark blue
 * 4.  brown
 * 5.  darker brown
 * 6.  light brown
 * 7.  blue
 * 8.  light blue
 * 9.  pink
 * 10. yellow
 * 11. purple
 * 12. black
 * 13. dark green
 * 14. light brown
 * 15. yellow/black pattern
 * 16. light colored spiral pattern
 * 17. shiny red
 * 18. shiny half blue/half red
 * 19. half black/half light blue
 * 20. white/red perimter
 * 21. green snake
 * 22. red snake
 * 23. dark blue snake
 * 24. dark yellow
 * 25. bright yellow
 * 26. all black
 * 27. red small pupil
 * 28. devil blue/black
 * 29. white small pupil
 * 30. glossed over
 */
global.SetPedEyeColor = function (ped, index) {
	return _in(0x00000000, 0xec09db1b, ped, index);
};

/**
 * Sets the various freemode face features, e.g. nose length, chin shape.
 * **Indexes (From 0 to 19):**
 * Parentheses indicate morph scale/direction as in (-1.0 to 1.0)
 * *   **0**: Nose Width (Thin/Wide)
 * *   **1**: Nose Peak (Up/Down)
 * *   **2**: Nose Length (Long/Short)
 * *   **3**: Nose Bone Curveness (Crooked/Curved)
 * *   **4**: Nose Tip (Up/Down)
 * *   **5**: Nose Bone Twist (Left/Right)
 * *   **6**: Eyebrow (Up/Down)
 * *   **7**: Eyebrow (In/Out)
 * *   **8**: Cheek Bones (Up/Down)
 * *   **9**: Cheek Sideways Bone Size (In/Out)
 * *   **10**: Cheek Bones Width (Puffed/Gaunt)
 * *   **11**: Eye Opening (Both) (Wide/Squinted)
 * *   **12**: Lip Thickness (Both) (Fat/Thin)
 * *   **13**: Jaw Bone Width (Narrow/Wide)
 * *   **14**: Jaw Bone Shape (Round/Square)
 * *   **15**: Chin Bone (Up/Down)
 * *   **16**: Chin Bone Length (In/Out or Backward/Forward)
 * *   **17**: Chin Bone Shape (Pointed/Square)
 * *   **18**: Chin Hole (Chin Bum)
 * *   **19**: Neck Thickness (Thin/Thick)
 * **Note:**
 * You may need to call [`SetPedHeadBlendData`](#\_0x9414E18B9434C2FE) prior to calling this native in order for it to work.
 * @param ped The ped entity
 * @param index An integer ranging from 0 to 19
 * @param scale A float ranging from -1.0 to 1.0
 */
global.SetPedFaceFeature = function (ped, index, scale) {
	return _in(0x00000000, 0x6c8d4458, ped, index, _fv(scale));
};

/**
 * Used for freemode (online) characters.
 */
global.SetPedHairColor = function (ped, colorID, highlightColorID) {
	return _in(0x00000000, 0xbb43f090, ped, colorID, highlightColorID);
};

/**
 * For more info please refer to [this](https://gtaforums.com/topic/858970-all-gtao-face-ids-pedset-ped-head-blend-data-explained) topic.
 * **Other information:**
 * IDs start at zero and go Male Non-DLC, Female Non-DLC, Male DLC, and Female DLC.</br>
 * This native function is often called prior to calling natives such as:
 * *   [`SetPedHairColor`](#\_0xBB43F090)
 * *   [`SetPedHeadOverlayColor`](#\_0x78935A27)
 * *   [`SetPedHeadOverlay`](#\_0xD28DBA90)
 * *   [`SetPedFaceFeature`](#\_0x6C8D4458)
 * @param ped The ped entity
 * @param shapeFirstID Controls the shape of the first ped's face
 * @param shapeSecondID Controls the shape of the second ped's face
 * @param shapeThirdID Controls the shape of the third ped's face
 * @param skinFirstID Controls the first id's skin tone
 * @param skinSecondID Controls the second id's skin tone
 * @param skinThirdID Controls the third id's skin tone
 * @param shapeMix 0.0 - 1.0 Of whose characteristics to take Mother -> Father (shapeFirstID and shapeSecondID)
 * @param skinMix 0.0 - 1.0 Of whose characteristics to take Mother -> Father (skinFirstID and skinSecondID)
 * @param thirdMix Overrides the others in favor of the third IDs.
 * @param isParent IsParent is set for "children" of the player character's grandparents during old-gen character creation. It has unknown effect otherwise.
 */
global.SetPedHeadBlendData = function (ped, shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix, isParent) {
	return _in(0x00000000, 0x60746b88, ped, shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, _fv(shapeMix), _fv(skinMix), _fv(thirdMix), isParent);
};

/**
 * ```
 * OverlayID ranges from 0 to 12, index from 0 to _GET_NUM_OVERLAY_VALUES(overlayID)-1, and opacity from 0.0 to 1.0.
 * overlayID       Part                  Index, to disable
 * 0               Blemishes             0 - 23, 255
 * 1               Facial Hair           0 - 28, 255
 * 2               Eyebrows              0 - 33, 255
 * 3               Ageing                0 - 14, 255
 * 4               Makeup                0 - 74, 255
 * 5               Blush                 0 - 6, 255
 * 6               Complexion            0 - 11, 255
 * 7               Sun Damage            0 - 10, 255
 * 8               Lipstick              0 - 9, 255
 * 9               Moles/Freckles        0 - 17, 255
 * 10              Chest Hair            0 - 16, 255
 * 11              Body Blemishes        0 - 11, 255
 * 12              Add Body Blemishes    0 - 1, 255
 * ```
 * **Note:**
 * You may need to call [`SetPedHeadBlendData`](#\_0x9414E18B9434C2FE) prior to calling this native in order for it to work.
 * @param ped The ped entity
 * @param overlayID The overlay id displayed up above.
 * @param index An integer representing the index (from 0 to `_GET_NUM_OVERLAY_VALUES(overlayID)-1`)
 * @param opacity A float ranging from 0.0 to 1.0
 */
global.SetPedHeadOverlay = function (ped, overlayID, index, opacity) {
	return _in(0x00000000, 0xd28dba90, ped, overlayID, index, _fv(opacity));
};

/**
 * ```
 * Used for freemode (online) characters.
 * Called after SET_PED_HEAD_OVERLAY().
 * ```
 * **Note:**
 * You may need to call [`SetPedHeadBlendData`](#\_0x9414E18B9434C2FE) prior to calling this native in order for it to work.
 * @param ped The ped entity
 * @param overlayID An integer representing the overlay id
 * @param colorType 1 for eyebrows, beards, and chest hair; 2 for blush and lipstick; and 0 otherwise, though not called in those cases.
 * @param colorID An integer representing the primary color id
 * @param secondColorID An integer representing the secondary color id
 */
global.SetPedHeadOverlayColor = function (ped, overlayID, colorType, colorID, secondColorID) {
	return _in(0x00000000, 0x78935a27, ped, overlayID, colorType, colorID, secondColorID);
};

/**
 * SET_PED_INTO_VEHICLE
 * @param seatIndex See eSeatPosition declared in [`IS_VEHICLE_SEAT_FREE`](#\_0x22AC59A870E6A669). -2 for the first available seat.
 */
global.SetPedIntoVehicle = function (ped, vehicle, seatIndex) {
	return _in(0x00000000, 0x07500c79, ped, vehicle, seatIndex);
};

/**
 * This native is used to set prop variation on a ped. Components, drawables and textures IDs are related to the ped model.
 * ### MP Freemode list of props
 * **0**: Hats
 * **1**: Glasses
 * **2**: Ears
 * **6**: Watches
 * **7**: Bracelets
 * List of Prop IDs
 * ```cpp
 * // Props
 * enum eAnchorPoints
 * {
 * ANCHOR_HEAD = 0, // "p_head"
 * ANCHOR_EYES = 1, // "p_eyes"
 * ANCHOR_EARS = 2, // "p_ears"
 * ANCHOR_MOUTH = 3, // "p_mouth"
 * ANCHOR_LEFT_HAND = 4, // "p_lhand"
 * ANCHOR_RIGHT_HAND = 5, // "p_rhand"
 * ANCHOR_LEFT_WRIST = 6, // "p_lwrist"
 * ANCHOR_RIGHT_WRIST = 7, // "p_rwrist"
 * ANCHOR_HIP = 8, // "p_lhip"
 * ANCHOR_LEFT_FOOT = 9, // "p_lfoot"
 * ANCHOR_RIGHT_FOOT = 10, // "p_rfoot"
 * ANCHOR_PH_L_HAND = 11, // "ph_lhand"
 * ANCHOR_PH_R_HAND = 12, // "ph_rhand"
 * NUM_ANCHORS = 13,
 * };
 * ```
 * @param ped The ped handle.
 * @param componentId The component that you want to set. Refer to [SET_PED_COMPONENT_VARIATION](#\_0x262B14F48D29DE80).
 * @param drawableId The drawable id that is going to be set. Refer to [GET_NUMBER_OF_PED_PROP_DRAWABLE_VARIATIONS](#\_0x5FAF9754E789FB47).
 * @param textureId The texture id of the drawable. Refer to [GET_NUMBER_OF_PED_PROP_TEXTURE_VARIATIONS](#\_0xA6E7F1CEB523E171).
 * @param attach Attached or not.
 */
global.SetPedPropIndex = function (ped, componentId, drawableId, textureId, attach) {
	return _in(0x00000000, 0x0829f2e2, ped, componentId, drawableId, textureId, attach);
};

/**
 * p1 is always 0 in R* scripts; and a quick disassembly seems to indicate that p1 is unused.
 */
global.SetPedRandomComponentVariation = function (ped, p1) {
	return _in(0x00000000, 0x4111ba46, ped, p1);
};

/**
 * SET_PED_RANDOM_PROPS
 * @param ped The ped handle.
 */
global.SetPedRandomProps = function (ped) {
	return _in(0x00000000, 0xe3318e0e, ped);
};

/**
 * PED::SET_PED_RESET_FLAG(PLAYER::PLAYER_PED_ID(), 240, 1);
 * Known values:
 */
global.SetPedResetFlag = function (ped, flagId, doReset) {
	return _in(0x00000000, 0xcff6ff66, ped, flagId, doReset);
};

/**
 * p4/p5: Unusued in TU27
 * ### Ragdoll Types
 * **0**: CTaskNMRelax
 * **1**: CTaskNMScriptControl: Hardcoded not to work in networked environments.
 * **Else**: CTaskNMBalance
 * @param time1 Time(ms) Ped is in ragdoll mode; only applies to ragdoll types 0 and not 1.
 */
global.SetPedToRagdoll = function (ped, time1, time2, ragdollType, p4, p5, p6) {
	return _in(0x00000000, 0x83cb5052, ped, time1, time2, ragdollType, p4, p5, p6);
};

/**
 * Return variable is never used in R*'s scripts.
 * Not sure what p2 does. It seems like it would be a time judging by it's usage in R*'s scripts, but didn't seem to affect anything in my testings.
 * x, y, and z are coordinates, most likely to where the ped will fall.
 * p7 is probably the force of the fall, but untested, so I left the variable name the same.
 * p8 to p13 are always 0f in R*'s scripts.
 * (Simplified) Example of the usage of the function from R*'s scripts:
 * ped::set_ped_to_ragdoll_with_fall(ped, 1500, 2000, 1, -entity::get_entity_forward_vector(ped), 1f, 0f, 0f, 0f, 0f, 0f, 0f);
 */
global.SetPedToRagdollWithFall = function (ped, time, p2, ragdollType, x, y, z, p7, p8, p9, p10, p11, p12, p13) {
	return _in(0x00000000, 0xfa12e286, ped, time, p2, ragdollType, _fv(x), _fv(y), _fv(z), _fv(p7), _fv(p8), _fv(p9), _fv(p10), _fv(p11), _fv(p12), _fv(p13));
};

/**
 * Flags:
 * SPC_AMBIENT_SCRIPT = (1 << 1),
 * SPC_CLEAR_TASKS = (1 << 2),
 * SPC_REMOVE_FIRES = (1 << 3),
 * SPC_REMOVE_EXPLOSIONS = (1 << 4),
 * SPC_REMOVE_PROJECTILES = (1 << 5),
 * SPC_DEACTIVATE_GADGETS = (1 << 6),
 * SPC_REENABLE_CONTROL_ON_DEATH = (1 << 7),
 * SPC_LEAVE_CAMERA_CONTROL_ON = (1 << 8),
 * SPC_ALLOW_PLAYER_DAMAGE = (1 << 9),
 * SPC_DONT_STOP_OTHER_CARS_AROUND_PLAYER = (1 << 10),
 * SPC_PREVENT_EVERYBODY_BACKOFF = (1 << 11),
 * SPC_ALLOW_PAD_SHAKE = (1 << 12)
 * See: https://alloc8or.re/gta5/doc/enums/eSetPlayerControlFlag.txt
 */
global.SetPlayerControl = function (player, bHasControl, flags) {
	return _in(0x00000000, 0xd17afcd8, _ts(player), bHasControl, flags);
};

/**
 * Sets the culling radius for the specified player.
 * Set to `0.0` to reset.
 * **WARNING**: Culling natives are deprecated and have known, [unfixable issues](https://forum.cfx.re/t/issue-with-culling-radius-and-server-side-entities/4900677/4)
 * @param playerSrc The player to set the culling radius for.
 * @param radius The radius.
 */
global.SetPlayerCullingRadius = function (playerSrc, radius) {
	return _in(0x00000000, 0x8a2fbad4, _ts(playerSrc), _fv(radius));
};

/**
 * Simply sets you as invincible (Health will not deplete).
 * Use 0x733A643B5B0C53C1 instead if you want Ragdoll enabled, which is equal to:
 * *(DWORD *)(playerPedAddress + 0x188) |= (1 << 9);
 */
global.SetPlayerInvincible = function (player, toggle) {
	return _in(0x00000000, 0xdfb9a2a2, _ts(player), toggle);
};

/**
 * Set the model for a specific Player. Note that this will destroy the current Ped for the Player and create a new one, any reference to the old ped will be invalid after calling this.
 * As per usual, make sure to request the model first and wait until it has loaded.
 * @param player The player to set the model for
 * @param model The model to use
 */
global.SetPlayerModel = function (player, model) {
	return _in(0x00000000, 0x774a4c54, _ts(player), _ch(model));
};

/**
 * Sets the routing bucket for the specified player.
 * Routing buckets are also known as 'dimensions' or 'virtual worlds' in past echoes, however they are population-aware.
 * @param playerSrc The player to set the routing bucket for.
 * @param bucket The bucket ID.
 */
global.SetPlayerRoutingBucket = function (playerSrc, bucket) {
	return _in(0x00000000, 0x6504eb38, _ts(playerSrc), bucket);
};

/**
 * SET_PLAYER_WANTED_LEVEL
 * @param player the target player
 * @param wantedLevel the wanted level 1-5
 * @param delayedResponse false = 0-10sec police spawn response time, true = 10-20sec police spawn response time
 */
global.SetPlayerWantedLevel = function (player, wantedLevel, delayedResponse) {
	return _in(0x00000000, 0xb7a0914b, _ts(player), wantedLevel, delayedResponse);
};

/**
 * A setter for [GET_RESOURCE_KVP_STRING](#\_0x5240DA5A).
 * @param key The key to set
 * @param value The value to write
 */
global.SetResourceKvp = function (key, value) {
	return _in(0x00000000, 0x21c7a35b, _ts(key), _ts(value));
};

/**
 * A setter for [GET_RESOURCE_KVP_FLOAT](#\_0x35BDCEEA).
 * @param key The key to set
 * @param value The value to write
 */
global.SetResourceKvpFloat = function (key, value) {
	return _in(0x00000000, 0x9add2938, _ts(key), _fv(value));
};

/**
 * Nonsynchronous [SET_RESOURCE_KVP_FLOAT](#\_0x9ADD2938) operation; see [FLUSH_RESOURCE_KVP](#\_0x5240DA5A).
 * @param key The key to set
 * @param value The value to write
 */
global.SetResourceKvpFloatNoSync = function (key, value) {
	return _in(0x00000000, 0x3517bfbe, _ts(key), _fv(value));
};

/**
 * A setter for [GET_RESOURCE_KVP_INT](#\_0x557B586A).
 * @param key The key to set
 * @param value The value to write
 */
global.SetResourceKvpInt = function (key, value) {
	return _in(0x00000000, 0x06a2b1e8, _ts(key), value);
};

/**
 * Nonsynchronous [SET_RESOURCE_KVP_INT](#\_0x6A2B1E8) operation; see [FLUSH_RESOURCE_KVP](#\_0x5240DA5A).
 * @param key The key to set
 * @param value The value to write
 */
global.SetResourceKvpIntNoSync = function (key, value) {
	return _in(0x00000000, 0x26aeb707, _ts(key), value);
};

/**
 * Nonsynchronous [SET_RESOURCE_KVP](#\_0x21C7A35B) operation; see [FLUSH_RESOURCE_KVP](#\_0x5240DA5A).
 * @param key The key to set
 * @param value The value to write
 */
global.SetResourceKvpNoSync = function (key, value) {
	return _in(0x00000000, 0x0cf9a2ff, _ts(key), _ts(value));
};

/**
 * Sets the entity lockdown mode for a specific routing bucket.
 * Lockdown modes are:
 * | Mode       | Meaning                                                    |
 * | ---------- | ---------------------------------------------------------- |
 * | `strict`   | No entities can be created by clients at all.              |
 * | `relaxed`  | Only script-owned entities created by clients are blocked. |
 * | `inactive` | Clients can create any entity they want.                   |
 * @param bucketId The routing bucket ID to adjust.
 * @param mode One of aforementioned modes.
 */
global.SetRoutingBucketEntityLockdownMode = function (bucketId, mode) {
	return _in(0x00000000, 0xa0f2201f, bucketId, _ts(mode));
};

/**
 * Sets whether or not the specified routing bucket has automatically-created population enabled.
 * @param bucketId The routing bucket ID to adjust.
 * @param mode `true` to enable population, `false` to disable population.
 */
global.SetRoutingBucketPopulationEnabled = function (bucketId, mode) {
	return _in(0x00000000, 0xce51ac2c, bucketId, mode);
};

/**
 * Internal function for setting a state bag value.
 */
global.SetStateBagValue = function (bagName, keyName, valueData, valueLength, replicated) {
	return _in(0x00000000, 0x8d50e33a, _ts(bagName), _ts(keyName), _ts(valueData), valueLength, replicated);
};

/**
 * SET_VEHICLE_ALARM
 */
global.SetVehicleAlarm = function (vehicle, state) {
	return _in(0x00000000, 0x24877d84, vehicle, state);
};

/**
 * p2 often set to 1000.0 in the decompiled scripts.
 */
global.SetVehicleBodyHealth = function (vehicle, value) {
	return _in(0x00000000, 0x920c2517, vehicle, _fv(value));
};

/**
 * Sets the selected vehicle's colors to their default value (specific variant specified using the colorCombination parameter).
 * Range of possible values for colorCombination is currently unknown, I couldn't find where these values are stored either (Disquse's guess was vehicles.meta but I haven't seen it in there.)
 * @param vehicle The vehicle to modify.
 * @param colorCombination One of the default color values of the vehicle.
 */
global.SetVehicleColourCombination = function (vehicle, colorCombination) {
	return _in(0x00000000, 0xa557aead, vehicle, colorCombination);
};

/**
 * colorPrimary & colorSecondary are the paint indexes for the vehicle.
 * For a list of valid paint indexes, view: pastebin.com/pwHci0xK
 */
global.SetVehicleColours = function (vehicle, colorPrimary, colorSecondary) {
	return _in(0x00000000, 0x57f24253, vehicle, colorPrimary, colorSecondary);
};

/**
 * p1, p2, p3 are RGB values for color (255,0,0 for Red, ect)
 */
global.SetVehicleCustomPrimaryColour = function (vehicle, r, g, b) {
	return _in(0x00000000, 0x8df9f9bc, vehicle, r, g, b);
};

/**
 * p1, p2, p3 are RGB values for color (255,0,0 for Red, ect)
 */
global.SetVehicleCustomSecondaryColour = function (vehicle, r, g, b) {
	return _in(0x00000000, 0x9d77259e, vehicle, r, g, b);
};

/**
 * Sets the dirt level of the passed vehicle.
 * @param vehicle The vehicle to set.
 * @param dirtLevel A number between 0.0 and 15.0 representing the vehicles dirt level.
 */
global.SetVehicleDirtLevel = function (vehicle, dirtLevel) {
	return _in(0x00000000, 0x2b39128b, vehicle, _fv(dirtLevel));
};

/**
 * See eDoorId declared in [`SET_VEHICLE_DOOR_SHUT`](#\_0x93D9BD300D7789E5)
 */
global.SetVehicleDoorBroken = function (vehicle, doorIndex, deleteDoor) {
	return _in(0x00000000, 0x8147fea7, vehicle, doorIndex, deleteDoor);
};

/**
 * // Source GTA VC miss2 leak, matching constants for 0/2/4, testing
 * // They use 10 in am_mp_property_int, don't know what it does atm.
 * enum eCarLock {
 * CARLOCK_NONE = 0,
 * CARLOCK_UNLOCKED = 1,
 * CARLOCK_LOCKED = 2,
 * CARLOCK_LOCKOUT_PLAYER_ONLY = 3,
 * CARLOCK_LOCKED_PLAYER_INSIDE = 4,
 * CARLOCK_LOCKED_INITIALLY = 5,
 * CARLOCK_FORCE_SHUT_DOORS = 6,
 * CARLOCK_LOCKED_BUT_CAN_BE_DAMAGED = 7
 * };
 */
global.SetVehicleDoorsLocked = function (vehicle, doorLockStatus) {
	return _in(0x00000000, 0x4cdd35d0, vehicle, doorLockStatus);
};

/**
 * SET_VEHICLE_NUMBER_PLATE_TEXT
 * @param vehicle The vehicle to set the plate for
 * @param plateText The text to set the plate to, 8 chars maximum
 */
global.SetVehicleNumberPlateText = function (vehicle, plateText) {
	return _in(0x00000000, 0x400f9556, vehicle, _ts(plateText));
};

/**
 * START_FIND_KVP
 * @param prefix A prefix match
 * @return A KVP find handle to use with [FIND_KVP](#\_0xBD7BEBC5) and close with [END_FIND_KVP](#\_0xB3210203)
 */
global.StartFindKvp = function (prefix) {
	return _in(0x00000000, 0xdd379006, _ts(prefix), _r, _ri);
};

/**
 * START_RESOURCE
 */
global.StartResource = function (resourceName) {
	return _in(0x00000000, 0x29b440dc, _ts(resourceName), _r);
};

/**
 * STOP_RESOURCE
 */
global.StopResource = function (resourceName) {
	return _in(0x00000000, 0x21783161, _ts(resourceName), _r);
};

/**
 * Makes the specified ped attack the target ped.
 * p2 should be 0
 * p3 should be 16
 */
global.TaskCombatPed = function (ped, targetPed, p2, p3) {
	return _in(0x00000000, 0xcb0d8932, ped, targetPed, p2, p3);
};

/**
 * Example:
 * TASK::TASK_DRIVE_BY(l_467[1 -- [[22]] ], PLAYER::PLAYER_PED_ID(), 0, 0.0, 0.0, 2.0, 300.0, 100, 0, ${firing_pattern_burst_fire_driveby});
 * Needs working example. Doesn't seem to do anything.
 * I marked p2 as targetVehicle as all these shooting related tasks seem to have that in common.
 * I marked p6 as distanceToShoot as if you think of GTA's Logic with the native SET_VEHICLE_SHOOT natives, it won't shoot till it gets within a certain distance of the target.
 * I marked p7 as pedAccuracy as it seems it's mostly 100 (Completely Accurate), 75, 90, etc. Although this could be the ammo count within the gun, but I highly doubt it. I will change this comment once I find out if it's ammo count or not.
 */
global.TaskDriveBy = function (driverPed, targetPed, targetVehicle, targetX, targetY, targetZ, distanceToShoot, pedAccuracy, p8, firingPattern) {
	return _in(0x00000000, 0x2b84d1c4, driverPed, targetPed, targetVehicle, _fv(targetX), _fv(targetY), _fv(targetZ), _fv(distanceToShoot), pedAccuracy, p8, _ch(firingPattern));
};

/**
 * speed 1.0 = walk, 2.0 = run
 * p5 1 = normal, 3 = teleport to vehicle, 8 = normal/carjack ped from seat, 16 = teleport directly into vehicle
 * p6 is always 0
 * @param seatIndex See eSeatPosition declared in [`IS_VEHICLE_SEAT_FREE`](#\_0x22AC59A870E6A669).
 */
global.TaskEnterVehicle = function (ped, vehicle, timeout, seatIndex, speed, flag, p6) {
	return _in(0x00000000, 0xb8689b4e, ped, vehicle, timeout, seatIndex, _fv(speed), flag, p6);
};

/**
 * TASK_EVERYONE_LEAVE_VEHICLE
 */
global.TaskEveryoneLeaveVehicle = function (vehicle) {
	return _in(0x00000000, 0xc1971f30, vehicle);
};

/**
 * TASK_GO_STRAIGHT_TO_COORD
 * @param ped The ped handle.
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @param z The z coordinate.
 * @param speed The ped movement speed.
 * @param timeout \-1 , other values appear to break the ped movement.
 * @param targetHeading The heading you want the ped to be on x,y,z coord.
 * @param distanceToSlide The distance from x,y,z where the ped will start sliding.
 */
global.TaskGoStraightToCoord = function (ped, x, y, z, speed, timeout, targetHeading, distanceToSlide) {
	return _in(0x00000000, 0x80a9e7a7, ped, _fv(x), _fv(y), _fv(z), _fv(speed), timeout, _fv(targetHeading), _fv(distanceToSlide));
};

/**
 * example from fm_mission_controller
 * TASK::TASK_GO_TO_COORD_ANY_MEANS(l_649, sub_f7e86(-1, 0), 1.0, 0, 0, 786603, 0xbf800000);
 */
global.TaskGoToCoordAnyMeans = function (ped, x, y, z, speed, p5, p6, walkingStyle, p8) {
	return _in(0x00000000, 0xf91df93b, ped, _fv(x), _fv(y), _fv(z), _fv(speed), p5, p6, walkingStyle, _fv(p8));
};

/**
 * The entity will move towards the target until time is over (duration) or get in target's range (distance). p5 and p6 are unknown, but you could leave p5 = 1073741824 or 100 or even 0 (didn't see any difference but on the decompiled scripts, they use 1073741824 mostly) and p6 = 0
 * Note: I've only tested it on entity -> ped and target -> vehicle. It could work differently on other entities, didn't try it yet.
 * Example: TASK::TASK_GO_TO_ENTITY(pedHandle, vehicleHandle, 5000, 4.0, 100, 1073741824, 0)
 * Ped will run towards the vehicle for 5 seconds and stop when time is over or when he gets 4 meters(?) around the vehicle (with duration = -1, the task duration will be ignored).
 */
global.TaskGoToEntity = function (entity, target, duration, distance, speed, p5, p6) {
	return _in(0x00000000, 0x374827c2, entity, target, duration, _fv(distance), _fv(speed), _fv(p5), p6);
};

/**
 * In the scripts, p3 was always -1.
 * p3 seems to be duration or timeout of turn animation.
 * Also facingPed can be 0 or -1 so ped will just raise hands up.
 */
global.TaskHandsUp = function (ped, duration, facingPed, p3, p4) {
	return _in(0x00000000, 0x8dcc19c5, ped, duration, facingPed, p3, p4);
};

/**
 * Flags are the same flags used in [`TASK_LEAVE_VEHICLE`](#\_0xD3DBCE61A490BE02)
 */
global.TaskLeaveAnyVehicle = function (ped, p1, flags) {
	return _in(0x00000000, 0xdbdd79fa, ped, p1, flags);
};

/**
 * Flags from decompiled scripts:
 * 0 = normal exit and closes door.
 * 1 = normal exit and closes door.
 * 16 = teleports outside, door kept closed.  (This flag does not seem to work for the front seats in buses, NPCs continue to exit normally)
 * 64 = normal exit and closes door, maybe a bit slower animation than 0.
 * 256 = normal exit but does not close the door.
 * 4160 = ped is throwing himself out, even when the vehicle is still.
 * 262144 = ped moves to passenger seat first, then exits normally
 * Others to be tried out: 320, 512, 131072.
 */
global.TaskLeaveVehicle = function (ped, vehicle, flags) {
	return _in(0x00000000, 0x7b1141c6, ped, vehicle, flags);
};

/**
 * [Animations list](https://alexguirre.github.io/animations-list/)
 * ```
 * float blendInSpeed > normal speed is 8.0f
 * ----------------------
 * float blendOutSpeed > normal speed is 8.0f
 * ----------------------
 * int duration: time in millisecond
 * ----------------------
 * -1 _ _ _ _ _ _ _> Default (see flag)
 * 0 _ _ _ _ _ _ _ > Not play at all
 * Small value _ _ > Slow down animation speed
 * Other _ _ _ _ _ > freeze player control until specific time (ms) has
 * _ _ _ _ _ _ _ _ _ passed. (No effect if flag is set to be
 * _ _ _ _ _ _ _ _ _ controllable.)
 * int flag:
 * ----------------------
 * enum eAnimationFlags
 * {
 * ANIM_FLAG_NORMAL = 0,
 * ANIM_FLAG_REPEAT = 1,
 * ANIM_FLAG_STOP_LAST_FRAME = 2,
 * ANIM_FLAG_UPPERBODY = 16,
 * ANIM_FLAG_ENABLE_PLAYER_CONTROL = 32,
 * ANIM_FLAG_CANCELABLE = 120,
 * };
 * Odd number : loop infinitely
 * Even number : Freeze at last frame
 * Multiple of 4: Freeze at last frame but controllable
 * 01 to 15 > Full body
 * 10 to 31 > Upper body
 * 32 to 47 > Full body > Controllable
 * 48 to 63 > Upper body > Controllable
 * ...
 * 001 to 255 > Normal
 * 256 to 511 > Garbled
 * ...
 * playbackRate:
 * values are between 0.0 and 1.0
 * lockX:
 * 0 in most cases 1 for rcmepsilonism8 and rcmpaparazzo_3
 * > 1 for mini@sprunk
 * lockY:
 * 0 in most cases
 * 1 for missfam5_yoga, missfra1mcs_2_crew_react
 * lockZ:
 * 0 for single player
 * Can be 1 but only for MP
 * ```
 */
global.TaskPlayAnim = function (ped, animDictionary, animationName, blendInSpeed, blendOutSpeed, duration, flag, playbackRate, lockX, lockY, lockZ) {
	return _in(0x00000000, 0x5ab552c6, ped, _ts(animDictionary), _ts(animationName), _fv(blendInSpeed), _fv(blendOutSpeed), duration, flag, _fv(playbackRate), lockX, lockY, lockZ);
};

/**
 * It's similar to the one above, except the first 6 floats let you specify the initial position and rotation of the task. (Ped gets teleported to the position).
 * [Animations list](https://alexguirre.github.io/animations-list/)
 * @param ped The target ped
 * @param animDict Name of the animation dictionary
 * @param animName Name of the animation
 * @param posX Initial X position of the task
 * @param posY Initial Y position of the task
 * @param posZ Initial Z position of the task
 * @param rotX Initial X rotation of the task, doesn't seem to have any effect
 * @param rotY Initial Y rotation of the task, doesn't seem to have any effect
 * @param rotZ Initial Z rotation of the task
 * @param animEnterSpeed Adjust character speed to fully enter animation
 * @param animExitSpeed Adjust character speed to fully exit animation (useless `ClearPedTasksImmediately()` is called)
 * @param duration Time in milliseconds
 * @param animTime Value between 0.0 and 1.0, lets you start an animation from the given point
 */
global.TaskPlayAnimAdvanced = function (ped, animDict, animName, posX, posY, posZ, rotX, rotY, rotZ, animEnterSpeed, animExitSpeed, duration, flag, animTime, p14, p15) {
	return _in(0x00000000, 0x3ddeb0e6, ped, _ts(animDict), _ts(animName), _fv(posX), _fv(posY), _fv(posZ), _fv(rotX), _fv(rotY), _fv(rotZ), _fv(animEnterSpeed), _fv(animExitSpeed), duration, flag, _fv(animTime), p14, p15);
};

/**
 * TASK_REACT_AND_FLEE_PED
 */
global.TaskReactAndFleePed = function (ped, fleeTarget) {
	return _in(0x00000000, 0x8a632bd8, ped, fleeTarget);
};

/**
 * Firing Pattern Hash Information: https://pastebin.com/Px036isB
 */
global.TaskShootAtCoord = function (ped, x, y, z, duration, firingPattern) {
	return _in(0x00000000, 0x601c22e3, ped, _fv(x), _fv(y), _fv(z), duration, _ch(firingPattern));
};

/**
 * //this part of the code is to determine at which entity the player is aiming, for example if you want to create a mod where you give orders to peds
 * Entity aimedentity;
 * Player player = PLAYER::PLAYER_ID();
 * PLAYER::_GET_AIMED_ENTITY(player, &aimedentity);
 * //bg is an array of peds
 * TASK::TASK_SHOOT_AT_ENTITY(bg[i], aimedentity, 5000, MISC::GET_HASH_KEY("FIRING_PATTERN_FULL_AUTO"));
 * in practical usage, getting the entity the player is aiming at and then task the peds to shoot at the entity, at a button press event would be better.
 * Firing Pattern Hash Information: https://pastebin.com/Px036isB
 */
global.TaskShootAtEntity = function (entity, target, duration, firingPattern) {
	return _in(0x00000000, 0xac0631c9, entity, target, duration, _ch(firingPattern));
};

/**
 * TASK_WARP_PED_INTO_VEHICLE
 * @param seatIndex See eSeatPosition declared in [`IS_VEHICLE_SEAT_FREE`](#\_0x22AC59A870E6A669).
 */
global.TaskWarpPedIntoVehicle = function (ped, vehicle, seatIndex) {
	return _in(0x00000000, 0x65d4a35d, ped, vehicle, seatIndex);
};

/**
 * TEMP_BAN_PLAYER
 */
global.TempBanPlayer = function (playerSrc, reason) {
	return _in(0x00000000, 0x1e35dbba, _ts(playerSrc), _ts(reason));
};

/**
 * The backing function for TriggerClientEvent.
 */
global.TriggerClientEventInternal = function (eventName, eventTarget, eventPayload, payloadLength) {
	return _in(0x00000000, 0x2f7a49e6, _ts(eventName), _ts(eventTarget), _ts(eventPayload), payloadLength);
};

/**
 * The backing function for TriggerEvent.
 */
global.TriggerEventInternal = function (eventName, eventPayload, payloadLength) {
	return _in(0x00000000, 0x91310870, _ts(eventName), _ts(eventPayload), payloadLength);
};

/**
 * The backing function for TriggerLatentClientEvent.
 */
global.TriggerLatentClientEventInternal = function (eventName, eventTarget, eventPayload, payloadLength, bps) {
	return _in(0x00000000, 0x70b35890, _ts(eventName), _ts(eventTarget), _ts(eventPayload), payloadLength, bps);
};

/**
 * VERIFY_PASSWORD_HASH
 */
global.VerifyPasswordHash = function (password, hash) {
	return _in(0x00000000, 0x2e310acd, _ts(password), _ts(hash), _r);
};

/**
 * Returns whether or not the currently executing event was canceled.
 * @return A boolean.
 */
global.WasEventCanceled = function () {
	return _in(0x00000000, 0x58382a19, _r);
};

