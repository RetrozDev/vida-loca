local Keys = {
	["ESC"] = 322, ["F1"] = 288, ["F2"] = 289, ["F3"] = 170, ["F5"] = 166, ["F6"] = 167, ["F7"] = 168,["F11"] = 344, ["F8"] = 169, ["F9"] = 56, ["F10"] = 57,
	["~"] = 243, ["1"] = 157, ["2"] = 158, ["3"] = 160, ["4"] = 164, ["5"] = 165, ["6"] = 159, ["7"] = 161, ["8"] = 162, ["9"] = 163, ["-"] = 84, ["="] = 83, ["BACKSPACE"] = 177,
	["TAB"] = 37, ["Q"] = 44, ["W"] = 32, ["E"] = 38, ["R"] = 45, ["T"] = 245, ["Y"] = 246, ["U"] = 303, ["P"] = 199, ["["] = 39, ["]"] = 40, ["ENTER"] = 18,
	["CAPS"] = 137, ["A"] = 34, ["S"] = 8, ["D"] = 9, ["F"] = 23, ["G"] = 47, ["H"] = 74, ["K"] = 311, ["L"] = 182,
	["LEFTSHIFT"] = 21, ["Z"] = 20, ["X"] = 73, ["C"] = 26, ["V"] = 0, ["B"] = 29, ["N"] = 249, ["M"] = 244, [","] = 82, ["."] = 81,
	["LEFTCTRL"] = 36, ["LEFTALT"] = 19, ["SPACE"] = 22, ["RIGHTCTRL"] = 70,
	["HOME"] = 213, ["PAGEUP"] = 10, ["PAGEDOWN"] = 11, ["DELETE"] = 178,
	["LEFT"] = 174, ["RIGHT"] = 175, ["TOP"] = 27, ["DOWN"] = 173,
	["NENTER"] = 201, ["N4"] = 108, ["N5"] = 60, ["N6"] = 107, ["N+"] = 96, ["N-"] = 97, ["N7"] = 117, ["N8"] = 61, ["N9"] = 118
  }

ESX = exports["es_extended"]:getSharedObject()

local FoodEat = false
local IsDead = false
local Drink = false
local ReductionEffect = false
local AlcoholEffect = false
local SplitDrink = false
local DrinkWine = false
local shake = false
local noSprint = false
local comas = false

Citizen.CreateThread(function()
  	while ESX.GetPlayerData().job == nil do
		Citizen.Wait(250)
	end
	
	ESX.PlayerData = ESX.GetPlayerData()
end)

RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function(job)
	ESX.PlayerData.job = job
end)

--alcotester
RegisterNetEvent('devcore_needs:client:alcotester')
AddEventHandler('devcore_needs:client:alcotester', function()
	local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
	if closestPlayer ~= -1 and closestDistance <= 1.5 then
	local type = type
	local playerPed = PlayerPedId()
	local elements = {}
	local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)

	for i=1, #players, 1 do
		table.insert(elements, {
			label = GetPlayerName(players[i]),
			player = players[i]
		})
	end

	ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
		title = _U('tester_title'),
		elements = elements,
		align = "right"
	}, function(data, menu)
		local player =	GetPlayerServerId(data.current.player)
			TriggerServerEvent('devcore_needs:server:AlcoTest', GetPlayerServerId(PlayerId()), player)
			menu.close()
			end, function(data, menu)
				menu.close()
		end)
	end
end)


RegisterNetEvent('devcore_needs:client:ShowAlco')
AddEventHandler('devcore_needs:client:ShowAlco', function()
	ExecuteCommand(_U('command', multiplier))
end)

AddEventHandler('esx:onPlayerDeath', function(data)
	comas = false
	noSprint = false
	shake = false
	ShakeGameplayCam('DRUNK_SHAKE', 0.0)
	ReductionEffect = false
	AlcoholEffect = false
	ResetPedMovementClipset(GetPlayerPed(-1), 0)
	ClearTimecycleModifier()
	ResetScenarioTypesEnabled()
	SetPedIsDrunk(GetPlayerPed(-1), false)
	SetPedMotionBlur(GetPlayerPed(-1), false)
	multiplier = 0.0

end)

AddEventHandler('devcore_needs:client:resetStatus', function()
	TriggerEvent('esx_status:set', 'hunger', 500000)
	TriggerEvent('esx_status:set', 'thirst', 500000)
end)

AddEventHandler('esx:onPlayerDeath', function()
	if Config.Status then
	IsDead = true
	end
end)

AddEventHandler('playerSpawned', function(spawn)
	if Config.Status then
	if IsDead then
		TriggerEvent('devcore_needs:client:resetStatus')
	end

	IsDead = false
	end
end)

AddEventHandler('esx_status:loaded', function(status)
	if Config.Status then
	TriggerEvent('esx_status:registerStatus', 'hunger', 1000000, '#CFAD0F', function(status)
		return false
	end, function(status)
		status.remove(100)
	end)
end
	TriggerEvent('esx_status:registerStatus', 'thirst', 1000000, '#0C98F1', function(status)
		return false
	end, function(status)
		status.remove(75)
	end)

Citizen.CreateThread(function()
	while true do
		Citizen.Wait(1000)
		if Config.Status then
		local playerPed  = PlayerPedId()
		local prevHealth = GetEntityHealth(playerPed)
		local health     = prevHealth

		TriggerEvent('esx_status:getStatus', 'hunger', function(status)
			if status.val == 0 then
				if prevHealth <= 150 then
					health = health - 5
				else
					health = health - 1
				end
			end
		end)

		TriggerEvent('esx_status:getStatus', 'thirst', function(status)
			if status.val == 0 then
				if prevHealth <= 150 then
					health = health - 5
				else
					health = health - 1
				end
			end
		end)

			if health ~= prevHealth then
					SetEntityHealth(playerPed, health)
				end
			end
		end
	end)
end)




--Food
RegisterNetEvent('devcore_needs:client:StartEat')
AddEventHandler('devcore_needs:client:StartEat', function(item, label, g, prop, hunger, p1 , p2 , p3, p4 , p5 , p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				FoodEat = true
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propfood = CreateObject(GetHashKey(prop), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propfood, player, GetPedBoneIndex(player, 18905), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if FoodEat then 
					if IsEntityDead(player) then
						DeleteObject(propfood)
						FoodEat = false
						TriggerServerEvent('devcore_needs:server:RemoveItem', item)
						break
					end
						ESX.ShowHelpNotification(_U('food', g))
						if IsControlJustPressed(0, Config.EatButton) then
						if g > 100 then
							playAnim('mp_player_inteat@burger', 'mp_player_int_eat_burger', 2000)
							Citizen.Wait(2200)
							g = g - math.random(Config.FoodBigRemove.min, Config.FoodBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'hunger', hunger)
							end
						elseif g < 100 then
							playAnim('mp_player_inteat@burger', 'mp_player_int_eat_burger', 1000)
							Citizen.Wait(1200)
							g = g - math.random(Config.FoodSmallRemove.min, Config.FoodSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'hunger', hunger)
							end
						if g < 10 then
							playAnim('mp_player_inteat@burger', 'mp_player_int_eat_burger', 1000)
							g = 0
							Citizen.Wait(800)
							FoodEat = false
							DetachEntity(propfood, 1, 1)
							DeleteObject(propfood)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
							end
						end
						end
						if IsControlJustPressed(0, Config.FoodThrow) then
							FoodEat = false
							ClearPedTasks(player)
							DetachEntity(propfood, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propfood)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
							end
							if IsControlJustPressed(0, Config.ServeFood) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverFood', GetPlayerServerId(PlayerId()), player, item, label, g, prop, hunger, p1 , p2 , p3, p4 , p5 , p6)
										menu.close()
										FoodEat = false
										ClearPedTasks(player)
										DetachEntity(propfood, 1, 1)
										DeleteObject(propfood)
								end, function(data, menu)
									
								end)
								break
							end
						end
					end
			end
		end
end)


--Receiver Food
RegisterNetEvent('devcore_needs:client:StartReceiverEat')
AddEventHandler('devcore_needs:client:StartReceiverEat', function(item, label, g, prop, hunger, p1 , p2 , p3, p4 , p5 , p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				TriggerServerEvent('devcore_needs:server:AddItem', item)
				FoodEat = true
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propfood = CreateObject(GetHashKey(prop), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propfood, player, GetPedBoneIndex(player, 18905), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if FoodEat then 
						if IsEntityDead(player) then
							DeleteObject(propfood)
							FoodEat = false
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('food', g))
						if IsControlJustPressed(0, Config.EatButton) then
						if g > 100 then
							playAnim('mp_player_inteat@burger', 'mp_player_int_eat_burger', 2000)
							Citizen.Wait(2200)
							g = g - math.random(Config.FoodBigRemove.min, Config.FoodBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'hunger', hunger)
							end
						elseif g < 100 then
							playAnim('mp_player_inteat@burger', 'mp_player_int_eat_burger', 1000)
							Citizen.Wait(1200)
							g = g - math.random(Config.FoodSmallRemove.min, Config.FoodSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'hunger', hunger)
							end
						if g < 10 then
							playAnim('mp_player_inteat@burger', 'mp_player_int_eat_burger', 1000)
							g = 0
							Citizen.Wait(800)
							DetachEntity(propfood, 1, 1)
							DeleteObject(propfood)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							FoodEat = false
							break
							end
						end
						end
						if IsControlJustPressed(0, Config.FoodThrow) then
							ClearPedTasks(player)
							DetachEntity(propfood, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propfood)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							FoodEat = false
							break
							end
							if IsControlJustPressed(0, Config.ServeFood) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
									if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverFood', GetPlayerServerId(PlayerId()), player, item, label, g, prop, hunger, p1, p2, p3, p4, p5, p6)
										menu.close()
										ClearPedTasks(player)
										DetachEntity(propfood, 1, 1)
										DeleteObject(propfood)
										FoodEat = false
									end, function(data, menu)	
								end)
							break
							end
						end
					end
			end
		end
end)

-----------------------------------------------------Drink----------------------------------------------------------------


RegisterNetEvent('devcore_needs:client:StartDrink')
AddEventHandler('devcore_needs:client:StartDrink', function(item, item2, ml, propd, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				if split then
					TriggerEvent('devcore_needs:client:StartSplitDrink', item, item2, ml, propd, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
				else
				Drink = true
				local ad = "amb@code_human_wander_drinking_fat@beer@male@base"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propdrink = CreateObject(GetHashKey(propd), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if Drink then 
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "static", 3)~= 1 then
							TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propdrink)
							Drink = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drink', ml))
						if IsControlJustPressed(0, Config.DrinkingButton) then
						if ml > 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
								TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propdrink)
							Drink = false
								break
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkBigRemove.min, Config.DrinkBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							end
						end
						elseif ml < 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
								multiplier = multiplier + alcohol
								ReductionEffect = true
								AlcoholEffect = true
								end
							end
						if ml < 10 then
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							ml = 0
							Citizen.Wait(3000)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propdrink)
							Drink = false
							break
							end
						end
						end
						if IsControlJustPressed(0, Config.DrinkThrowButton) then
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propdrink)
							Drink = false
							break
							end
							if IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverDrink', GetPlayerServerId(PlayerId()), player, item, item2, ml, propdrink, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
										menu.close()
										Drink = false
										ClearPedTasks(playerPed)
										DetachEntity(propdrink, 1, 1)
										DeleteObject(propdrink)
										ClearPedTasks(playerPed)
									end, function(data, menu)
								end)
								break
							end
						end
					end
				end
			end
		end
end)


---------------RECEIVER DRINK-------------------

RegisterNetEvent('devcore_needs:client:StartReceiverDrink')
AddEventHandler('devcore_needs:client:StartReceiverDrink', function(item, item2, ml, propdrink, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				if split then
					TriggerEvent('devcore_needs:client:StartSplitDrink', item, item2, ml, propdrink, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
				else
				TriggerServerEvent('devcore_needs:server:AddItem', item)
				Drink = true
				local ad = "amb@code_human_wander_drinking_fat@beer@male@base"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propdrink = CreateObject(GetHashKey(propd), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1, p2, p3, p4, p5, p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if Drink then 
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "static", 3)~= 1 then
							TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propdrink)
							Drink = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drink', ml))
						if IsControlJustPressed(0, Config.DrinkingButton) then
						if ml > 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
								TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propdrink)
							Drink = false
								break
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkBigRemove.min, Config.DrinkBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							end
						end
						elseif ml < 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
								multiplier = multiplier + alcohol
								ReductionEffect = true
								AlcoholEffect = true
								end
							end
						if ml < 10 then
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							ml = 0
							Citizen.Wait(3000)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propdrink)
							Drink = false
							break
							end
						end
						end
						if IsControlJustPressed(0, Config.DrinkThrowButton) then
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propdrink)
							Drink = false
							break
							end
							if IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)

										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverDrink', GetPlayerServerId(PlayerId()), player, item, item2, ml, propd, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
										menu.close()
										DetachEntity(propdrink, 1, 1)
										DeleteObject(propdrink)
										ClearPedTasks(playerPed)
										Drink = false
								end, function(data, menu)
									
								end)
								break
							end
						end
					end
				end
			end
		end
end)


-------------SPLIT ALCOHOL--------------


RegisterNetEvent('devcore_needs:client:StartSplitDrink')
AddEventHandler('devcore_needs:client:StartSplitDrink', function(item, item2, ml, propd, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				SplitDrink = true
				local ad = "amb@code_human_wander_drinking_fat@beer@male@base"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propdrink = CreateObject(GetHashKey(propd), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if SplitDrink then 
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "static", 3)~= 1 then
							TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propdrink)
							SplitDrink = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drinksplitshot', ml))
						if IsControlJustPressed(0, Config.DrinkingButton) then
						if ml > 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
								TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propdrink, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propdrink)
							SplitDrink = false
								break
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkBigRemove.min, Config.DrinkBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							end
						end
						elseif ml < 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
								multiplier = multiplier + alcohol
								ReductionEffect = true
								AlcoholEffect = true
								end
							end
						if ml < 10 then
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							ml = 0
							Citizen.Wait(3000)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							Citizen.Wait(1500)
							DetachEntity(propdrink, 1, 1)
							DeleteObject(propdrink)
							SplitDrink = false
							break
							end
						end
						end
						if IsControlJustPressed(0, Config.DrinkThrowButton) then
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							Citizen.Wait(1500)
							DetachEntity(propdrink, 1, 1)
							DeleteObject(propdrink)
							SplitDrink = false
							break
							end
							if IsControlJustPressed(0, Config.SplitDrinkButton) then
								if ml > 29 then
									SplitDrink = false
									playAnim('mp_arresting', 'a_uncuff', 2000)
									Citizen.Wait(2000)
								ml = ml-30

								TriggerEvent('devcore_needs:client:ShotDrinkSplit', item, item2, ml, propdrink, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
								else
									exports['mythic_notify']:DoHudText('error', _U('alreadybottle'))
								end
							end
							if IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)

										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverDrink', GetPlayerServerId(PlayerId()), player, item, item2, ml, propdrink, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
										menu.close()
										SplitDrink = false
										ClearPedTasks(playerPed)
										DetachEntity(propdrink, 1, 1)
										DeleteObject(propdrink)
										ClearPedTasks(playerPed)
									end, function(data, menu)
								end)
								break
						end
					end
				end
			end
		end
end)
--------------------Shot Drink-----------------
RegisterNetEvent('devcore_needs:client:ShotDrinkSplit')
AddEventHandler('devcore_needs:client:ShotDrinkSplit', function(item, item2, ml, propdrink, alcohol, split, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				mlshot = 30
				DrinkShot = true
				local ad = "anim@heists@humane_labs@finale@keycards"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propsplitdrink = CreateObject(GetHashKey('p_cs_shot_glass_s'), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), 0.13 , -0.05, -0.16, -70.0, 50.0, 60.0, true, true, false, true, 1, true)
				AttachEntityToEntity(propsplitdrink, player, GetPedBoneIndex(player, 18905), 0.11, 0.03, 0.02, 250.0, 0.0, 0.0, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkShot then
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "ped_a_enter_loop", 3)~= 1 then
							TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propsplitdrink)
							DeleteObject(propdrink)
							DrinkShot = false
							SplitDrink = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drinkshot', mlshot))
						if IsControlJustPressed(0, Config.DrinkingButton) then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
							SplitDrink = true
								break
							else
							playAnim('mp_player_inteat@pnq', 'loop', 2500)
							Citizen.Wait(2500)
							mlshot = mlshot - 30
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propsplitdrink)
							SplitDrink = true
							
							AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
						end
						if mlshot < 10 then
							mlshot = 0
							Citizen.Wait(3000)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propsplitdrink)
							ClearPedTasks(player)
							DrinkShot = false
							SplitDrink = true
							AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							break
						end
						end
					elseif IsControlJustPressed(0, Config.DrinkThrowButton) then
							ClearPedTasks(player)
							Citizen.Wait(1500)
							DetachEntity(propsplitdrink, 1, 1)
							DeleteObject(propsplitdrink)
							DrinkShot = false
							SplitDrink = true
							AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							break
						elseif IsControlJustPressed(0, Config.CleanUpItem) then
						if mlshot < 29 then
							exports['mythic_notify']:DoHudText('error', _U('cleanup_limit'))
						else
							ClearPedTasks(player)
							Citizen.Wait(1500)
							DetachEntity(propsplitdrink, 1, 1)
							DeleteObject(propsplitdrink)
							TriggerServerEvent('devcore_needs:server:AddItem', item2)
							DrinkShot = false
							SplitDrink = true
							AttachEntityToEntity(propdrink, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							break
						end
					elseif IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkShot', GetPlayerServerId(PlayerId()), player, item, item2, mlshot, alcohol, drinkstatus)
										menu.close()
										DrinkShot = false
										ClearPedTasks(playerPed)
										DetachEntity(propsplitdrink, 1, 1)
										DeleteObject(propsplitdrink)
										SplitDrink = true
									end, function(data, menu)
								end)
							break
						end
					end
				end
			end
		end
end)


RegisterNetEvent('devcore_needs:client:ReceiverDrinkShot')
AddEventHandler('devcore_needs:client:ReceiverDrinkShot', function(item, item2, mlshot, alcohol, drinkstatus)
			if  Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				DrinkShot = true
				local ad = "anim@heists@humane_labs@finale@keycards"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propsplitdrink = CreateObject(GetHashKey('p_cs_shot_glass_s'), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propsplitdrink, player, GetPedBoneIndex(player, 18905), 0.11, 0.03, 0.02, 250.0, 0.0, 0.0, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkShot then
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "ped_a_enter_loop", 3)~= 1 then
							TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propsplitdrink)
							DrinkShot = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							break
						end
						ESX.ShowHelpNotification(_U('drink', mlshot))
						if IsControlJustPressed(0, Config.DrinkingButton) then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
								break
							else
							playAnim('mp_player_inteat@pnq', 'loop', 2500)
							Citizen.Wait(2500)
							mlshot = mlshot - 30
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propsplitdrink)
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
						if mlshot < 10 then
							mlshot = 0
							Citizen.Wait(3000)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
							break
						end
						end
					elseif IsControlJustPressed(0, Config.DrinkThrowButton) then
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
							break
					elseif IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkShot', GetPlayerServerId(PlayerId()), player, item2, label, mlshot, alcohol, drinkstatus)
										menu.close()
										DrinkShot = false
										ClearPedTasks(playerPed)
										DetachEntity(propsplitdrink, 1, 1)
										DeleteObject(propsplitdrink)
										ClearPedTasks(playerPed)
									end, function(data, menu)
								end)
							break
							end
					end
				end
			end
		end
end)

RegisterNetEvent('devcore_needs:client:DrinkShot')
AddEventHandler('devcore_needs:client:DrinkShot', function(item, label, mlshot, alcohol, drinkstatus)
			if  Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				mlshot = 30
				DrinkShot = true
				local ad = "anim@heists@humane_labs@finale@keycards"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propsplitdrink = CreateObject(GetHashKey('p_cs_shot_glass_s'), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propsplitdrink, player, GetPedBoneIndex(player, 18905), 0.11, 0.03, 0.02, 250.0, 0.0, 0.0, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkShot then 
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "ped_a_enter_loop", 3)~= 1 then
							TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propsplitdrink)
							DrinkShot = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							break
						end
						ESX.ShowHelpNotification(_U('drink', mlshot))
						if IsControlJustPressed(0, Config.DrinkingButton) then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
								break
							else
							playAnim('mp_player_inteat@pnq', 'loop', 2500)
							Citizen.Wait(2500)
							mlshot = mlshot - 30
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propsplitdrink)
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
						if mlshot < 10 then
							mlshot = 0
							Citizen.Wait(3000)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
							break
						end
						end
					elseif IsControlJustPressed(0, Config.DrinkThrowButton) then
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(1000)
							ClearPedTasks(player)
							DetachEntity(propsplitdrink, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propsplitdrink)
							DrinkShot = false
							break
					elseif IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkShot', GetPlayerServerId(PlayerId()), player, item, label, mlshot, alcohol, drinkstatus)
										menu.close()
										DrinkShot = false
										ClearPedTasks(playerPed)
										DetachEntity(propsplitdrink, 1, 1)
										DeleteObject(propsplitdrink)
									end, function(data, menu)
								end)
								break
						end
					end
				end
			end
		end
end)



---------------WINE---------------------


RegisterNetEvent('devcore_needs:client:StartDrinkWine')
AddEventHandler('devcore_needs:client:StartDrinkWine', function(item, item2, ml, propw, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				DrinkWine = true
				local ad = "amb@code_human_wander_drinking_fat@beer@male@base"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propwine = CreateObject(GetHashKey(propw), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propwine, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkWine then 
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "static", 3)~= 1 then
							TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propwine)
							DrinkWine = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drinkwine', ml))
						if IsControlJustPressed(0, Config.DrinkingButton) then
						if ml > 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
								TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propwine, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propwine, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propwine)
							DrinkWine = false
								break
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkBigRemove.min, Config.DrinkBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							end
						end
						elseif ml < 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
								multiplier = multiplier + alcohol
								ReductionEffect = true
								AlcoholEffect = true
								end
							end
						if ml < 10 then
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							ml = 0
							Citizen.Wait(3000)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propwine, 1, 1)
							DeleteObject(propwine)
							multiplier = multiplier + alcohol
							DrinkWine = false
							break
							end
						end
					end
						if IsControlJustPressed(0, Config.DrinkThrowButton) then
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							Citizen.Wait(1500)
							DetachEntity(propwine, 1, 1)
							DeleteObject(propwine)
							ClearPedTasks(player)
							DrinkWine = false
							break
							end
							if IsControlJustPressed(0, Config.SplitDrinkButton) then
								if ml > 99 then
									DrinkWine = false
									playAnim('mp_arresting', 'a_uncuff', 2000)
									Citizen.Wait(2000)
								ml = ml-100

								TriggerEvent('devcore_needs:client:WineDrinkGlass', item, item2, propw, ml, alcohol, drinkstatus, p1 , p2, p3, p4, p5, p6)
								else
									exports['mythic_notify']:DoHudText('error', _U('alreadybottle'))
								end
							end
							if IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkSplitWine', GetPlayerServerId(PlayerId()), player, item, item2, ml, propw, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
										menu.close()
										DrinkWine = false
										ClearPedTasks(playerPed)
										DetachEntity(propwine, 1, 1)
										DeleteObject(propwine)
										ClearPedTasks(playerPed)
									end, function(data, menu)
								end)
								break
						end
					end
				end
			end
		end
end)


RegisterNetEvent('devcore_needs:client:ReceiverDrinkSplitWine')
AddEventHandler('devcore_needs:client:ReceiverDrinkSplitWine', function(item, item2, ml, propw, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				TriggerServerEvent('devcore_needs:server:AddItem', item)
				DrinkWine = true
				local ad = "amb@code_human_wander_drinking_fat@beer@male@base"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propwine = CreateObject(GetHashKey(propw), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propwine, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkWine then 
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "static", 3)~= 1 then
							TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "static", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propwine)
							DrinkWine = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drinkwine', ml))
						if IsControlJustPressed(0, Config.DrinkingButton) then
						if ml > 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
								TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propwine, 1, 1)
							Citizen.Wait(1500)
							ClearPedTasks(player)
							DetachEntity(propwine, 1, 1)
							Citizen.Wait(3000)
							DeleteObject(propwine)
							DrinkWine = false
								break
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkBigRemove.min, Config.DrinkBigRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
							end
						end
						elseif ml < 100 then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							else
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							Citizen.Wait(3000)
							ml = ml - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
								multiplier = multiplier + alcohol
								ReductionEffect = true
								AlcoholEffect = true
								end
							end
						if ml < 10 then
							playAnim('amb@code_human_wander_drinking@male@idle_a', 'idle_c', 3000)
							ml = 0
							Citizen.Wait(3000)
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propwine, 1, 1)
							DeleteObject(propwine)
							multiplier = multiplier + alcohol
							DrinkWine = false
							break
							end
						end
					end
						if IsControlJustPressed(0, Config.DrinkThrowButton) then
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							Citizen.Wait(1500)
							DetachEntity(propwine, 1, 1)
							DeleteObject(propwine)
							ClearPedTasks(player)
							DrinkWine = false
							break
							end
							if IsControlJustPressed(0, Config.SplitDrinkButton) then
								if ml > 99 then
									DrinkWine = false
									playAnim('mp_arresting', 'a_uncuff', 2000)
									Citizen.Wait(2000)
								ml = ml-100

								TriggerEvent('devcore_needs:client:WineDrinkGlass', item, item2, propw, ml, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
								else
									exports['mythic_notify']:DoHudText('error', _U('alreadybottle'))
								end
							end
							if IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkSplitWine', GetPlayerServerId(PlayerId()), player, item, item2, ml, propw, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
										menu.close()
										DrinkWine = false
										ClearPedTasks(playerPed)
										DetachEntity(propwine, 1, 1)
										DeleteObject(propwine)
									end, function(data, menu)
								end)
								break
						end
					end
				end
			end
		end
end)


RegisterNetEvent('devcore_needs:client:ReceiverDrinkGlass')
AddEventHandler('devcore_needs:client:ReceiverDrinkGlass', function(item, label, mlwine, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				
				mlwine = 100
				DrinkGlass = true
				local ad = "anim@heists@humane_labs@finale@keycards"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propwineglass = CreateObject(GetHashKey('p_wine_glass_s'), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propwineglass, player, GetPedBoneIndex(player, 18905), 0.11, -0.03, 0.03, 250.0, 0.0, 0.0, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkGlass then
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "ped_a_enter_loop", 3)~= 1 then
							TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propwineglass)
							DrinkGlass = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							break
						end
						ESX.ShowHelpNotification(_U('drink', mlwine))
						if IsControlJustPressed(0, Config.DrinkingButton) then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propwineglass)
							DrinkGlass = false
								break
							else
							playAnim('mp_player_inteat@pnq', 'loop', 1000)
							Citizen.Wait(1000)
							ClearPedTasks(player)
							mlwine = mlwine - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
						end
						if mlwine < 10 then
							mlwine = 0
							multiplier = multiplier + alcohol
							Citizen.Wait(3000)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							DeleteObject(propwineglass)
							DrinkGlass = false
							break
						end
						end
					elseif IsControlJustPressed(0, Config.DrinkThrowButton) then
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							Citizen.Wait(1000)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							Citizen.Wait(2000)
							DeleteObject(propwineglass)
							DrinkGlass = false
							break
					elseif IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkGlass', GetPlayerServerId(PlayerId()), player, item, label, mlwine, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
										menu.close()
										DrinkGlass = false
										DetachEntity(propwineglass, 1, 1)
										DeleteObject(propwineglass)
										ClearPedTasks(playerPed)
									end, function(data, menu)
								end)
							break
							end
					end
				end
			end
		end
end)
-----------wine glass---------------
RegisterNetEvent('devcore_needs:client:WineDrinkGlass')
AddEventHandler('devcore_needs:client:WineDrinkGlass', function(item, item2, propw, ml, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				mlwine = 100
				DrinkGlass = true
				local ad = "anim@heists@humane_labs@finale@keycards"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propwineglass = CreateObject(GetHashKey('p_wine_glass_s'), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propw, player, GetPedBoneIndex(player, 28422), 0.13 , -0.05, -0.16, -70.0, 50.0, 60.0, true, true, false, true, 1, true)
				AttachEntityToEntity(propwineglass, player, GetPedBoneIndex(player, 18905), 0.11, -0.03, 0.03, 250.0, 0.0, 0.0, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkGlass then
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "ped_a_enter_loop", 3)~= 1 then
							TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propwineglass)
							DeleteObject(propwine)
							DrinkWine = false
							DrinkGlass = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drinkwineglass', mlwine))
						if IsControlJustPressed(0, Config.DrinkingButton) then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propwineglass)
							DrinkGlass = false
							DrinkWine = true
								break
							else
								playAnim('mp_player_inteat@pnq', 'loop', 1000)
								Citizen.Wait(1000)
								ClearPedTasks(player)
								mlwine = mlwine - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
								ClearPedTasks(player)
								if Config.Status then
									TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
								end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
						end
						if mlwine < 10 then
							mlwine = 0
							multiplier = multiplier + alcohol
							Citizen.Wait(3000)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							DeleteObject(propwineglass)
							DrinkGlass = false
							DrinkWine = true
							AttachEntityToEntity(propw, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							break
						end
						end
					elseif IsControlJustPressed(0, Config.DrinkThrowButton) then
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							DeleteObject(propwineglass)
							DrinkGlass = false
							DrinkWine = true
							AttachEntityToEntity(propw, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							break
						elseif IsControlJustPressed(0, Config.CleanUpItem) then
							if mlwine < 99 then
								exports['mythic_notify']:DoHudText('error', _U('cleanup_limit'))
							else
							ClearPedTasks(player)
							TriggerServerEvent('devcore_needs:server:AddItem', item2)
							Citizen.Wait(1500)
							DetachEntity(propwineglass, 1, 1)
							DeleteObject(propwineglass)
							DrinkGlass = false
							DrinkWine = true
							AttachEntityToEntity(propw, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
							break
							end
					elseif IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkGlass', GetPlayerServerId(PlayerId()), player, item, item2, mlwine, alcohol, drinkstatus, p1, p2, p3, p4, p5, p6)
										DrinkGlass = false
										menu.close()
										ClearPedTasks(playerPed)
										DetachEntity(propwineglass, 1, 1)
										DeleteObject(propwineglass)
										AttachEntityToEntity(propw, player, GetPedBoneIndex(player, 28422), p1 ,p2 , p3, p4 , p5 , p6, true, true, false, true, 1, true)
										DrinkWine = true
									end, function(data, menu)
								end)
							break
						end
					end
				end
			end
		end
end)


RegisterNetEvent('devcore_needs:client:WineGlass')
AddEventHandler('devcore_needs:client:WineGlass', function(item, label, mlwine, alcohol, drinkstatus)
			if Drink or FoodEat or DrinkShot or SplitDrink or DrinkWine or DrinkGlass then 
				exports['mythic_notify']:DoHudText('error', _U('already'))
			else
				DrinkGlass = true
				local ad = "anim@heists@humane_labs@finale@keycards"
				local player = PlayerPedId()
				local x,y,z = table.unpack(GetEntityCoords(player))
				propwineglass = CreateObject(GetHashKey('p_wine_glass_s'), x, y, z+0.2,  true,  true, true)
				AttachEntityToEntity(propwineglass, player, GetPedBoneIndex(player, 18905), 0.11, -0.03, 0.03, 250.0, 0.0, 0.0, true, true, false, true, 1, true)
				while true do
					Citizen.Wait(1)
					if DrinkGlass then
						if not IsPedInAnyVehicle(player, true) and IsEntityPlayingAnim(player, ad, "ped_a_enter_loop", 3)~= 1 then
							TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							ESX.Streaming.RequestAnimDict(ad, function()
								TaskPlayAnim( player, ad, "ped_a_enter_loop", 8.0, 1.0, -1, 49, 0, 0, 0, 0 )
							end)
						end
						if IsEntityDead(player) then
							DeleteObject(propwineglass)
							DrinkGlass = false
							ReductionEffect = false
							AlcoholEffect = false
							comas = false
							noSprint = false
							shake = false
							ShakeGameplayCam('DRUNK_SHAKE', 0.0)
							ResetPedMovementClipset(GetPlayerPed(-1), 0)
							ClearTimecycleModifier()
							ResetScenarioTypesEnabled()
							SetPedIsDrunk(GetPlayerPed(-1), false)
							SetPedMotionBlur(GetPlayerPed(-1), false)
							multiplier = 0.0
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							break
						end
						ESX.ShowHelpNotification(_U('drink', mlwine))
						if IsControlJustPressed(0, Config.DrinkingButton) then
							if multiplier > maxhighdone then
								exports['mythic_notify']:DoHudText('error', _U('not_want'))
							ClearPedTasks(player)
							Citizen.Wait(500)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							Citizen.Wait(1000)
							DeleteObject(propwineglass)
							DrinkGlass = false
								break
							else
							playAnim('mp_player_inteat@pnq', 'loop', 1000)
							Citizen.Wait(1000)
							mlwine = mlwine - math.random(Config.DrinkSmallRemove.min, Config.DrinkSmallRemove.max)
							ClearPedTasks(player)
							if Config.Status then
								TriggerServerEvent('devcore_needs:client:UpdateStatus', 'thirst', drinkstatus)
							end
							if alcohol > 0.0259949 then
							multiplier = multiplier + alcohol
							ReductionEffect = true
							AlcoholEffect = true
						end
						if mlwine < 10 then
							TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							mlwine = 0
							Citizen.Wait(3000)
							DetachEntity(propwineglass, 1, 1)
							DeleteObject(propwineglass)
							DrinkGlass = false
							break
						end
						end
					elseif IsControlJustPressed(0, Config.DrinkThrowButton) then
						TriggerServerEvent('devcore_needs:server:RemoveItem', item)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							Citizen.Wait(1000)
							ClearPedTasks(player)
							DetachEntity(propwineglass, 1, 1)
							DeleteObject(propwineglass)
							DrinkGlass = false
							break
					elseif IsControlJustPressed(0, Config.ServeDrink) then
								local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
								if closestPlayer ~= -1 and closestDistance <= 1.5 then
								local type = type
								local playerPed = PlayerPedId()
								local elements = {}
								local players = ESX.Game.GetPlayersInArea(GetEntityCoords(playerPed), 2.0)
							
								for i=1, #players, 1 do
									table.insert(elements, {
										label = GetPlayerName(players[i]),
										player = players[i]
									})
								end
							
								ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'reciver_menu', {
									title = _U('give'),
									elements = elements,
									align = "right"
								}, function(data, menu)
									local player =	GetPlayerServerId(data.current.player)
									TriggerServerEvent('devcore_needs:server:RemoveItem', item)
										TriggerServerEvent('devcore_needs:server:ReceiverDrinkGlass', GetPlayerServerId(PlayerId()), player, item, label, mlwine, alcohol, drinkstatus)
										menu.close()
										DrinkGlass = false
										ClearPedTasks(playerPed)
										DetachEntity(propwineglass, 1, 1)
										DeleteObject(propwineglass)
										ClearPedTasks(playerPed)
									end, function(data, menu)
								end)
							break
							end
					end
				end
			end
		end
end)



Citizen.CreateThread(function()
	while true do
		Wait(1)
		if noSprint then
			DisableControlAction(0,21, true)
		else
			Wait(500)
		end
	end
end)


------------EFFECT----------------------
multiplier = 0.0
increasephaseeff = 1.249949
minusphase4 = 0.014048
maxhighdone = 1.7159437055846
--maxhigh = 0.9309426647617
maxhigh = 1.7259437055846
minhigh = 0.1249949
drunk = 0.8259437055846


Citizen.CreateThread(function(source)
while true do
	Wait(100)

if AlcoholEffect then

	if multiplier > maxhigh then
		multiplier = 1.7259437055846
		RequestAnimSet("move_m@drunk@verydrunk")
		SetPedMovementClipset(GetPlayerPed(-1), "move_m@drunk@verydrunk", true)
		coma()
		else
			SetTimecycleModifier("spectator5")
			SetPedIsDrunk(GetPlayerPed(-1), true)
			SetPedMotionBlur(GetPlayerPed(-1), true)
			SetTimecycleModifierStrength(multiplier)
		end
		if multiplier > 0.8259437055846 then
			noSprint = true
			RequestAnimSet("move_m@drunk@a")
			SetPedMovementClipset(GetPlayerPed(-1), "move_m@drunk@a", true)
			shakecam()
		else
			comas = false
			noSprint = false
			shake = false
				ShakeGameplayCam('DRUNK_SHAKE', 0.0)
				ResetPedMovementClipset(GetPlayerPed(-1), 0)
			end
		end
	end
end)

function coma()
	if not comas then
		comas = true
		local playerPed = PlayerPedId()
		local myPed = GetPlayerPed(-1)
		SetPedToRagdoll(myPed, 10000, 10000, 0, 0, 0, 0)
		DoScreenFadeOut(100)
		Citizen.Wait(10000)
		DoScreenFadeIn(250)
		comas = false
	end
end



function shakecam()
	if not shake then
		shake = true
				ShakeGameplayCam('DRUNK_SHAKE', 1.5)
	end
end


--V1
Citizen.CreateThread(function(source)
while true do
	Citizen.Wait(13000)
	local player = PlayerId()

	if ReductionEffect then

		  if multiplier > minhigh then
				SetTimecycleModifier("spectator5")
				SetTimecycleModifierStrength(multiplier)
				multiplier = multiplier - minusphase4
			if multiplier < minhigh	then
				AlcoholEffect = false
				ReductionEffect = false
				ResetPedMovementClipset(GetPlayerPed(-1), 0)
				ClearTimecycleModifier()
				ResetScenarioTypesEnabled()
				SetPedIsDrunk(GetPlayerPed(-1), false)
				SetPedMotionBlur(GetPlayerPed(-1), false)
					end
				end
			end
		end
end)


function playAnim(animDict, animName, duration)
	RequestAnimDict(animDict)
	while not HasAnimDictLoaded(animDict) do Citizen.Wait(0) end
	TaskPlayAnim(GetPlayerPed(-1), animDict, animName, 1.0, -1.0, duration, 49, 1, false, false, false)
	RemoveAnimDict(animDict)
end



