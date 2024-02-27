return {
	--money
		['money'] = {
			label = 'Billet',
		},
	
		['black_money'] = {
			label = 'Billet tracé',
		},
	
	--outils
		['parachute'] = {
			label = 'Parachute',
			weight = 8000,
			stack = false,
			client = {
				anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
				usetime = 1500
			}
		},
	
		['lockpick'] = {
			label = 'Lockpick',
			weight = 160,
		},
	--electroniques
		['phone'] = {
			label = 'Phone',
			weight = 190,
			stack = false,
			consume = 0,
			client = {
				add = function(total)
					if total > 0 then
						pcall(function() return exports.npwd:setPhoneDisabled(false) end)
					end
				end,
	
				remove = function(total)
					if total < 1 then
						pcall(function() return exports.npwd:setPhoneDisabled(true) end)
					end
				end
			}
		},
	
		['radio'] = {
			label = 'Radio',
			weight = 200,
			stack = false,
			allowArmed = true
		},
	
	--bouffes
		['burger'] = {
			label = 'Burger',
			weight = 200,
		},
	
		['chaser'] = {
			label = 'Barre d\'ego chaser',
			weight = 30,
		},
	
		['meteorite'] = {
			label = 'Barre de meteorite',
			weight = 30,
		},
	
		['donut'] = {
			label = 'Donut',
			weight = 200,
		},
	
	
		['hotdog'] = {
			label = 'Hotdog',
			weight = 200,
			description = 'C\'est pas du chien t\'inquiète'
		},
	
		['chips_nature'] = {
			label = 'Chips nature',
			weight = 100,
		},
	
		['chips_piment'] = {
			label = 'Chips au piment',
			weight = 100,
		},
	
		['chips_fromage'] = {
			label = 'Chips au fromage',
			weight = 100,
		},
	
		['chips_ribs'] = {
			label = 'Chips au ribs de porc',
			weight = 100,
		},
	
	--boisson
		['bean_machine_coffe'] = {
			label = 'Café Bean Machine',
			weight = 300,
		},
		['raine'] = {
			label = 'Bouteille d\'eau Raine',
			weight = 300,
		},
	
		['cola'] = {
			label = 'Canette de Ecola',
			weight = 300,
		},
	
		['sprunk'] = {
			label = 'Canette de Sprunk',
			weight = 300,
		},
	
		['orang_o_tang'] = {
			label = 'Canette de Orang-O-Tang',
			weight = 300,
		},
	
	--alcools
		['piswasser'] = {
			label = 'Pißwasser',
			weight = 300,
		},
	
		['mount_whisky'] = {
			label = 'Bouteille de whisky Mount',
			weight = 1000,
		},
	
		['tequila'] = {
			label = 'Bouteille de Tequilya',
			weight = 1000,
		},
	
		['nogo_vodka'] = {
			label = 'Bouteille de vodka Nogo',
			weight = 1000,
		},
	
		['shot_mount_whisky'] = {
			label = 'Shot de whisky',
			weight = 1,
		},
	
		['shot_nogo_vodka'] = {
			label = 'Shot de vodka',
			weight = 1,
		},
	
		['shot_tequila'] = {
			label = 'Shot de tequila',
			weight = 1,
		},
	
		['costa_del_perro'] = {
			label = 'Costa Del Perro',
			weight = 1000,
		},
	
		['rockford_hill'] = {
			label = 'Rockford Hill Reserve',
			weight = 1000,
		},
	
		['vinewood_red'] = {
			label = 'Vinewood Red Zinfadel',
			weight = 1000,
		},
	
		['vinewood_blanc'] = {
			label = 'Vinewood Sauvignon Blanc',
			weight = 1000,
		},
	
		['glass_costa_del_perro'] = {
			label = 'Verre de Costa Del Perro',
			weight = 100,
		},
	
		['glass_rockford_hill'] = {
			label = 'Verre de Rockford Hill',
			weight = 100,
		},
	
		['glass_vinewood_red'] = {
			label = 'Verre de Vinewood Red Zinfadel',
			weight = 100,
		},
		
		['glass_vinewood_blanc'] = {
			label = 'Verre de Vinewood Sauvignon Blanc',
			weight = 100,
		},
}