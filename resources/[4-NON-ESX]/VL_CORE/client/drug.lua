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

local playerPed = playerPed
local playerPed = PlayerPedId()

RegisterCommand('effet', function()
    SetTimecycleModifier("spectator9")
    Citizen.Wait(10000)
    ClearTimecycleModifier()
end, true)


RegisterNetEvent('Vida-Loca-drugs:useItem')
AddEventHandler('Vida-Loca-drugs:useItem', function(itemName)
    if itemName == 'lean' then
        local lib, anim = 'amb@world_human_smoking_pot@male@base', 'base'
        local playerPed = PlayerPedId()

        ESX.Streaming.RequestAnimDict(lib, function()
            --TaskPlayAnim(playerPed, lib, anim, 8.0, -8.0, -1, 32, 0, false, false, false)
            

            Citizen.Wait(500)
            while IsEntityPlayingAnim(playerPed, lib, anim, 3) do
                Citizen.Wait(0)
                DisableAllControlActions(0)
            end

            TriggerEvent('Vida-Loca-drugs:Lean')
        end)

    elseif itemName == 'coke_bag' then
        local lib, anim = 'move_p_m_two_idles@generic', 'fidget_blow_snot' -- TODO better animations
        local playerPed = PlayerPedId()

        ESX.Streaming.RequestAnimDict(lib, function()
            TaskPlayAnim(playerPed, lib, anim, 8.0, -8.0, -1, 32, 0, false, false, false)

            Citizen.Wait(500)
            while IsEntityPlayingAnim(playerPed, lib, anim, 3) do
                Citizen.Wait(0)
                DisableAllControlActions(0)
            end

            TriggerEvent('Vida-Loca-drugs:Coke')
        end)

    elseif itemName == 'meth' then
        local lib, anim = 'mp_weapons_deal_sting', 'crackhead_bag_loop' -- TODO better animations
        local playerPed = PlayerPedId()

        ESX.Streaming.RequestAnimDict(lib, function()
            TaskPlayAnim(playerPed, lib, anim, 8.0, -8.0, -1, 32, 0, false, false, false)

            Citizen.Wait(500)
            while IsEntityPlayingAnim(playerPed, lib, anim, 3) do
                Citizen.Wait(0)
                DisableAllControlActions(0)
            end

            TriggerEvent('Vida-Loca-drugs:Meth')
        end)

    elseif itemName == 'crack' then
        local lib, anim = 'mp_weapons_deal_sting', 'crackhead_bag_loop' -- TODO better animations
        local playerPed = PlayerPedId()

        ESX.Streaming.RequestAnimDict(lib, function()
            TaskPlayAnim(playerPed, lib, anim, 8.0, -8.0, -1, 32, 0, false, false, false)

            Citizen.Wait(500)
            while IsEntityPlayingAnim(playerPed, lib, anim, 3) do
                Citizen.Wait(0)
                DisableAllControlActions(0)
            end

            TriggerEvent('Vida-Loca-drugs:Crack')
        end)

    elseif itemName == 'exta' then
        local lib, anim = 'mp_suicide', 'pill' -- TODO better animations
        local playerPed = PlayerPedId()

        ESX.Streaming.RequestAnimDict(lib, function()
            TaskPlayAnim(playerPed, lib, anim, 8.0, -8.0, 3000, 32, 0, false, false, false)

            Citizen.Wait(500)
            while IsEntityPlayingAnim(playerPed, lib, anim, 3) do
                Citizen.Wait(0)
                DisableAllControlActions(0)
            end

            TriggerEvent('Vida-Loca-drugs:Exta')
        end)
    elseif itemName == 'autre' then
    end
end)

RegisterNetEvent('Vida-Loca-drugs:Lean')
AddEventHandler('Vida-Loca-drugs:Lean', function()
    RequestAnimSet("move_m@drunk@slightlydrunk")
    while not HasAnimSetLoaded("move_m@drunk@slightlydrunk") do
        Citizen.Wait(0)
    end
    onDrugs = true
    ExecuteCommand("e sipsoda")
    Citizen.Wait(2000)
    DoScreenFadeOut(1000)
    Citizen.Wait(1000)
    SetTimecycleModifier("NG_filmic08")
    SetPedMotionBlur(playerPed, true)
    SetPedMovementClipset(playerPed, "move_m@drunk@slightlydrunk", true)
    SetRunSprintMultiplierForPlayer(PlayerId(),0.50)
    ShakeGameplayCam("DRUNK_SHAKE", 3.0)
    DoScreenFadeIn(1000)
    ExecuteCommand("me est défoncé")
    Citizen.Wait(120000)
    DoScreenFadeOut(1000)
    DoScreenFadeIn(1000)
    ClearTimecycleModifier()
    ResetPedMovementClipset(playerPed, 0)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 0.0)
    SetPedMotionBlur(playerPed, false)
    onDrugs = false

end)

RegisterNetEvent('Vida-Loca-drugs:Coke')
AddEventHandler('Vida-Loca-drugs:Coke', function()
    RequestAnimSet("MOVE_M@QUICK")
    while not HasAnimSetLoaded("MOVE_M@QUICK") do
        Citizen.Wait(0)
    end
    onDrugs = true
    DoScreenFadeOut(1000)
    Citizen.Wait(1000)
    SetTimecycleModifier("gunclubrange")
    SetPedMotionBlur(playerPed, true)
    SetPedMovementClipset(playerPed, "MOVE_M@QUICK", true)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.49)
    ShakeGameplayCam("DRUNK_SHAKE", 3.0)
    DoScreenFadeIn(1000)
    ExecuteCommand("me est défoncé")
    Citizen.Wait(120000)
    DoScreenFadeOut(1000)
    DoScreenFadeIn(1000)
    ClearTimecycleModifier()
    ResetPedMovementClipset(playerPed, 0)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 0.0)
    SetPedMotionBlur(playerPed, false)
    onDrugs = false

end)

RegisterNetEvent('Vida-Loca-drugs:Meth')
AddEventHandler('Vida-Loca-drugs:Meth', function()
    RequestAnimSet("move_m@buzzed")
    while not HasAnimSetLoaded("move_m@buzzed") do
        Citizen.Wait(0)
    end
    onDrugs = true
    DoScreenFadeOut(1000)
    Citizen.Wait(1000)
    SetTimecycleModifier("MP_death_grade_blend01")
    SetPedMotionBlur(playerPed, true)
    SetPedMovementClipset(playerPed, "move_m@buzzed", true)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 3.0)
    DoScreenFadeIn(1000)
    ExecuteCommand("me est défoncé")
    Citizen.Wait(120000)
    DoScreenFadeOut(1000)
    DoScreenFadeIn(1000)
    ClearTimecycleModifier()
    ResetPedMovementClipset(playerPed, 0)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 0.0)
    SetPedMotionBlur(playerPed, false)
    onDrugs = false
end)

RegisterNetEvent('Vida-Loca-drugs:Exta')
AddEventHandler('Vida-Loca-drugs:Exta', function()
    RequestAnimSet("anim@move_m@grooving@")
    while not HasAnimSetLoaded("anim@move_m@grooving@") do
        Citizen.Wait(0)
    end
    onDrugs = true
    DoScreenFadeOut(1000)
    Citizen.Wait(1000)
    SetTimecycleModifier("spectator9")
    SetPedMotionBlur(playerPed, true)
    SetPedMovementClipset(playerPed, "anim@move_m@grooving@", true)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 1.0)
    DoScreenFadeIn(1000)
    ExecuteCommand("me est défoncé")
    Citizen.Wait(120000)
    DoScreenFadeOut(1000)
    DoScreenFadeIn(1000)
    ClearTimecycleModifier()
    ResetPedMovementClipset(playerPed, 0)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 0.0)
    SetPedMotionBlur(playerPed, false)
    onDrugs = false

end)
local playerPed = playerPed
  local playerPed = PlayerPedId()
  
RegisterNetEvent('Vida-Loca-drugs:Crack')
AddEventHandler('Vida-Loca-drugs:Crack', function()
    RequestAnimSet("MOVE_M@QUICK")
    while not HasAnimSetLoaded("MOVE_M@QUICK") do
        Citizen.Wait(0)
    end
    onDrugs = true
    DoScreenFadeOut(1000)
    Citizen.Wait(1000)
    SetTimecycleModifier("gunclubrange")
    SetPedMotionBlur(playerPed, true)
    SetPedMovementClipset(playerPed, "MOVE_M@QUICK", true)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.49)
    ShakeGameplayCam("DRUNK_SHAKE", 3.0)
    DoScreenFadeIn(1000)
    ExecuteCommand("me est défoncé")
    Citizen.Wait(120000)
    DoScreenFadeOut(1000)
    DoScreenFadeIn(1000)
    ClearTimecycleModifier()
    ResetPedMovementClipset(playerPed, 0)
    SetRunSprintMultiplierForPlayer(PlayerId(),1.0)
    ShakeGameplayCam("DRUNK_SHAKE", 0.0)
    SetPedMotionBlur(playerPed, false)
    onDrugs = false

end)