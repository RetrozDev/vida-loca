fx_version 'cerulean'

game 'gta5'
description 'Viva Vida Loca Rp !'

shared_script 'config.lua'

client_script {
	'client/*.lua',
}

server_script {
	'server/*.lua',
}

files {
	'events.meta',
	'relationships.dat'
}



ui_page 'index.html'