ShowNotificationTicker = function(message)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(message)
    EndTextCommandThefeedPostTicker(0, 1)
end

RegisterCommand('v3', function()
    local coords = GetEntityCoords(PlayerPedId())
    SendNUIMessage({
        type = 'clipboard',
        data = '' .. vec(coords.x, coords.y, coords.z)
    })
    ShowNotificationTicker('Copied to clipboard! ' .. vec(coords.x, coords.y, coords.z))
end)

RegisterCommand('v4', function()
    local coords, heading = GetEntityCoords(PlayerPedId()), GetEntityHeading(PlayerPedId())
    SendNUIMessage({
        type = 'clipboard',
        data = '' .. vec(coords.x, coords.y, coords.z, heading)
    })
    ShowNotificationTicker('Copied to clipboard! ' .. vec(coords.x, coords.y, coords.z, heading))
end)