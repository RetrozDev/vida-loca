--[[ Main ]]--
fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'

--[[ Misc ]]--
author 'Lucy & d3Ex2 @Lunaris - https://discord.gg/jKcV2tgr9X'
description '[ESX / OX] Vehicle Shop'
version '1.0.2'


--[[ Resource related ]]--
files { 'locales/*.json' }
dependencies { 'oxmysql', 'ox_lib' }
provide 'esx_vehicleshop'

shared_scripts {'@es_extended/imports.lua', '@ox_lib/init.lua', 'config.lua'}
server_scripts {'@oxmysql/lib/MySQL.lua', 'server/fn.lua', 'server/main.lua'}
client_scripts {'client/bridge.lua', 'client/main.lua'}

escrow_ignore {
    -- Config files
    "config.lua",
    -- Locales
    "locales/*.lua",
}
dependency '/assetpacks'