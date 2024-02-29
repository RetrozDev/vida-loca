fx_version 'adamant'
game 'gta5'

description 'devcore - by bary - discord - https://discord.gg/zcG9KQj3sa'
credits 'Pravidla pro jednani s produkty od sluzby devcore naleznete na discordu'

shared_scripts '@es_extended/imports.lua'

server_scripts {
	'@mysql-async/lib/MySQL.lua',
	'@es_extended/locale.lua',
	'config.lua',
	'locales/cs.lua',
	'locales/en.lua',
	'locales/fr.lua',
	'server/server.lua'
}

client_scripts {
	'@es_extended/locale.lua',
	'config.lua',
	'locales/cs.lua',
	'locales/en.lua',
	'client/client.lua',
}