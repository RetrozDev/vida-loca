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
	
		["bandage"] = {
			label = "Bandage",
			weight = 2,
			stack = true,
			close = true,
		},
	
		["medikit"] = {
			label = "Medikit",
			weight = 2,
			stack = true,
			close = true,
		},
	
	["alive_chicken"] = {
		label = "Living chicken",
		weight = 1,
		stack = true,
		close = true,
	},

	["blowpipe"] = {
		label = "Blowtorch",
		weight = 2,
		stack = true,
		close = true,
	},

	["bread"] = {
		label = "Bread",
		weight = 1,
		stack = true,
		close = true,
	},

	["cannabis"] = {
		label = "Cannabis",
		weight = 3,
		stack = true,
		close = true,
	},

	["carokit"] = {
		label = "Body Kit",
		weight = 3,
		stack = true,
		close = true,
	},

	["carotool"] = {
		label = "Tools",
		weight = 2,
		stack = true,
		close = true,
	},

	["clothe"] = {
		label = "Cloth",
		weight = 1,
		stack = true,
		close = true,
	},

	["copper"] = {
		label = "Copper",
		weight = 1,
		stack = true,
		close = true,
	},

	["cutted_wood"] = {
		label = "Cut wood",
		weight = 1,
		stack = true,
		close = true,
	},

	["diamond"] = {
		label = "Diamond",
		weight = 1,
		stack = true,
		close = true,
	},

	["essence"] = {
		label = "Gas",
		weight = 1,
		stack = true,
		close = true,
	},

	["fabric"] = {
		label = "Fabric",
		weight = 1,
		stack = true,
		close = true,
	},

	["fish"] = {
		label = "Fish",
		weight = 1,
		stack = true,
		close = true,
	},

	["fixkit"] = {
		label = "Repair Kit",
		weight = 3,
		stack = true,
		close = true,
	},

	["fixtool"] = {
		label = "Repair Tools",
		weight = 2,
		stack = true,
		close = true,
	},

	["gazbottle"] = {
		label = "Gas Bottle",
		weight = 2,
		stack = true,
		close = true,
	},

	["gold"] = {
		label = "Gold",
		weight = 1,
		stack = true,
		close = true,
	},

	["iron"] = {
		label = "Iron",
		weight = 1,
		stack = true,
		close = true,
	},

	["marijuana"] = {
		label = "Marijuana",
		weight = 2,
		stack = true,
		close = true,
	},

	["packaged_chicken"] = {
		label = "Chicken fillet",
		weight = 1,
		stack = true,
		close = true,
	},

	["packaged_plank"] = {
		label = "Packaged wood",
		weight = 1,
		stack = true,
		close = true,
	},

	["petrol"] = {
		label = "Oil",
		weight = 1,
		stack = true,
		close = true,
	},

	["petrol_raffin"] = {
		label = "Processed oil",
		weight = 1,
		stack = true,
		close = true,
	},

	["slaughtered_chicken"] = {
		label = "Slaughtered chicken",
		weight = 1,
		stack = true,
		close = true,
	},

	["stone"] = {
		label = "Stone",
		weight = 1,
		stack = true,
		close = true,
	},

	["washed_stone"] = {
		label = "Washed stone",
		weight = 1,
		stack = true,
		close = true,
	},

	["water"] = {
		label = "Water",
		weight = 1,
		stack = true,
		close = true,
	},

	["wood"] = {
		label = "Wood",
		weight = 1,
		stack = true,
		close = true,
	},

	["wool"] = {
		label = "Wool",
		weight = 1,
		stack = true,
		close = true,
	},
}