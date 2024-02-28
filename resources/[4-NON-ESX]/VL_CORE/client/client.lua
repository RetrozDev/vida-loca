--Cayo

local requestedIpl = {"h4_islandairstrip", "h4_islandairstrip_props", "h4_islandx_mansion", "h4_islandx_mansion_props", "h4_islandx_props", "h4_islandxdock", "h4_islandxdock_props", "h4_islandxdock_props_2", "h4_islandxtower", "h4_islandx_maindock", "h4_islandx_maindock_props", "h4_islandx_maindock_props_2", "h4_IslandX_Mansion_Vault", "h4_islandairstrip_propsb", "h4_beach", "h4_beach_props", "h4_beach_bar_props", "h4_islandx_barrack_props", "h4_islandx_checkpoint", "h4_islandx_checkpoint_props", "h4_islandx_Mansion_Office", "h4_islandx_Mansion_LockUp_01", "h4_islandx_Mansion_LockUp_02", "h4_islandx_Mansion_LockUp_03", "h4_islandairstrip_hangar_props", "h4_IslandX_Mansion_B", "h4_islandairstrip_doorsclosed", "h4_Underwater_Gate_Closed", "h4_mansion_gate_closed", "h4_aa_guns", "h4_IslandX_Mansion_GuardFence", "h4_IslandX_Mansion_Entrance_Fence", "h4_IslandX_Mansion_B_Side_Fence", "h4_IslandX_Mansion_Lights", "h4_islandxcanal_props", "h4_beach_props_party", "h4_islandX_Terrain_props_06_a", "h4_islandX_Terrain_props_06_b", "h4_islandX_Terrain_props_06_c", "h4_islandX_Terrain_props_05_a", "h4_islandX_Terrain_props_05_b", "h4_islandX_Terrain_props_05_c", "h4_islandX_Terrain_props_05_d", "h4_islandX_Terrain_props_05_e", "h4_islandX_Terrain_props_05_f", "H4_islandx_terrain_01", "H4_islandx_terrain_02", "H4_islandx_terrain_03", "H4_islandx_terrain_04", "H4_islandx_terrain_05", "H4_islandx_terrain_06", "h4_ne_ipl_00", "h4_ne_ipl_01", "h4_ne_ipl_02", "h4_ne_ipl_03", "h4_ne_ipl_04", "h4_ne_ipl_05", "h4_ne_ipl_06", "h4_ne_ipl_07", "h4_ne_ipl_08", "h4_ne_ipl_09", "h4_nw_ipl_00", "h4_nw_ipl_01", "h4_nw_ipl_02", "h4_nw_ipl_03", "h4_nw_ipl_04", "h4_nw_ipl_05", "h4_nw_ipl_06", "h4_nw_ipl_07", "h4_nw_ipl_08", "h4_nw_ipl_09", "h4_se_ipl_00", "h4_se_ipl_01", "h4_se_ipl_02", "h4_se_ipl_03", "h4_se_ipl_04", "h4_se_ipl_05", "h4_se_ipl_06", "h4_se_ipl_07", "h4_se_ipl_08", "h4_se_ipl_09", "h4_sw_ipl_00", "h4_sw_ipl_01", "h4_sw_ipl_02", "h4_sw_ipl_03", "h4_sw_ipl_04", "h4_sw_ipl_05", "h4_sw_ipl_06", "h4_sw_ipl_07", "h4_sw_ipl_08", "h4_sw_ipl_09", "h4_islandx_mansion", "h4_islandxtower_veg", "h4_islandx_sea_mines", "h4_islandx", "h4_islandx_barrack_hatch", "h4_islandxdock_water_hatch", "h4_beach_party"}

CreateThread(function()
	for i = #requestedIpl, 1, -1 do
		RequestIpl(requestedIpl[i])
		requestedIpl[i] = nil
	end
	requestedIpl = nil
end)

CreateThread(function()
	while true do
		SetRadarAsExteriorThisFrame()
		SetRadarAsInteriorThisFrame(`h4_fake_islandx`, vec(4700.0, -5145.0), 0, 0)
		Wait(0)
	end
end)

CreateThread(function()
	Wait(2500)
	local islandLoaded = false
	local islandCoords = vector3(4840.571, -5174.425, 2.0)
	SetDeepOceanScaler(0.0)
	while true do
		local pCoords = GetEntityCoords(PlayerPedId())
		if #(pCoords - islandCoords) < 2000.0 then
			if not islandLoaded then
				islandLoaded = true
				Citizen.InvokeNative(0xF74B1FFA4A15FBEA, 1)
			end
		else
			if islandLoaded then
				islandLoaded = false
				Citizen.InvokeNative(0xF74B1FFA4A15FBEA, 0)
			end
		end
		Wait(5000)
	end
end)

-- Menu pause
function SetData()
	players = {}
	for _, player in ipairs(GetActivePlayers()) do
		local ped = GetPlayerPed(player)
		table.insert( players, player )
end

	
	local name = GetPlayerName(PlayerId())
	local id = GetPlayerServerId(PlayerId())
	--Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), "Vida Loca Rp ~t~ | ~w~ID: " .. id .. " ~t~| ~w~Nom: " .. name .. " ~t~| ~w~Joueurs: " .. #players .. "~w~ / 80")
	Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'FE_THDR_GTAO', "~HUD_COLOUR_NET_PLAYER4~Vida Loca Rp ~t~ | ~w~ID: ~HUD_COLOUR_NET_PLAYER4~" .. id .. " ~t~| ~w~Nom: ~HUD_COLOUR_NET_PLAYER4~" .. name .. " ~t~| ~w~Joueurs: ~HUD_COLOUR_NET_PLAYER4~" .. #players .. "~w~ ~HUD_COLOUR_NET_PLAYER4~/ 80")

    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_MAP',"~w~GOOGLE MAP")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_GAM',"~HUD_COLOUR_NET_PLAYER4~ALLER DORMIR")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_INF',"~w~INFOS")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_STA',"~HUD_COLOUR_NET_PLAYER4~MES STATISTIQUES")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_SET',"~w~STYLE DE VIE")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_GAL',"~HUD_COLOUR_NET_PLAYER4~MES PHOTOS")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_SCR_RPL',"~w~EDITEUR PHOTOS / VIDEOS")
    Citizen.InvokeNative(GetHashKey("ADD_TEXT_ENTRY"), 'PM_PANE_CFX',"~HUD_COLOUR_NET_PLAYER4~VIDA LOCA")
end

Citizen.CreateThread(function() 
	while true do
		Citizen.Wait(100)
		SetData()
	end
end)


-- Blips Custom
if Config.customblips == true then
    local blips = Config.blips
    
    Citizen.CreateThread(function()
       for _, info in pairs(blips) do
         info.blip = AddBlipForCoord(info.x, info.y, info.z)
         SetBlipSprite(info.blip, info.id)
         SetBlipDisplay(info.blip, info.display)
         SetBlipScale(info.blip, info.scale)
         SetBlipColour(info.blip, info.colour)
         SetBlipAsShortRange(info.blip, info.shortrange)
         BeginTextCommandSetBlipName("STRING")
         AddTextComponentString(info.title)
         EndTextCommandSetBlipName(info.blip)
       end
    end)
end






-- Enlever casque
if Config.motorcyclehelmet == false then
    Citizen.CreateThread(function()
        while true do
            Citizen.Wait(5) -- Increase if you want to
            SetPedConfigFlag(PlayerPedId(), 35, false)
        end
    end)
end

-- Coords Commands
ShowNotificationTicker = function(message)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(message)
    EndTextCommandThefeedPostTicker(0, 1)
end

RegisterCommand('coords', function()
    local coords, heading = GetEntityCoords(PlayerPedId()), GetEntityHeading(PlayerPedId())
    SendNUIMessage({
        type = 'clipboard',
        data = '' .. vec(coords.x, coords.y, coords.z, heading)
    })
    ShowNotificationTicker('Copied to clipboard! ' .. vec(coords.x, coords.y, coords.z, heading))
end)

RegisterCommand('camcoords', function()
    local coords, heading = GetFinalRenderedCamCoord(), GetFinalRenderedCamRot(0)
    SendNUIMessage({
        type = 'clipboard',
        data = '{' .. vec(coords.x, coords.y, coords.z) .. ', ' .. vec(heading.x, heading.y, heading.z) .. ' }'
    })
    ShowNotificationTicker('Copied to clipboard! ' .. vec(coords.x, coords.y, coords.z) .. ', ' .. vec(heading.x, heading.y, heading.z) )
end)