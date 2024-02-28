return {

	Ammunation = {
		name = 'Ammunation',
		inventory = {
			{ name = 'ammo-9', price = 5, },
			{ name = 'WEAPON_KNIFE', price = 200 },
			{ name = 'WEAPON_BAT', price = 100 },
			{ name = 'WEAPON_PISTOL', price = 1000, metadata = { registered = true }, license = 'weapon' }
		}, locations = {
			vec3(-662.180, -934.961, 21.829),
			vec3(810.25, -2157.60, 29.62),
			vec3(1693.44, 3760.16, 34.71),
			vec3(-330.24, 6083.88, 31.45),
			vec3(252.63, -50.00, 69.94),
			vec3(22.56, -1109.89, 29.80),
			vec3(2567.69, 294.38, 108.73),
			vec3(-1117.58, 2698.61, 18.55),
			vec3(842.44, -1033.42, 28.19)
		}, targets = {
			{ loc = vec3(-660.92, -934.10, 21.94), length = 0.6, width = 0.5, heading = 180.0, minZ = 21.8, maxZ = 22.2, distance = 2.0 },
			{ loc = vec3(808.86, -2158.50, 29.73), length = 0.6, width = 0.5, heading = 360.0, minZ = 29.6, maxZ = 30.0, distance = 2.0 },
			{ loc = vec3(1693.57, 3761.60, 34.82), length = 0.6, width = 0.5, heading = 227.39, minZ = 34.7, maxZ = 35.1, distance = 2.0 },
			{ loc = vec3(-330.29, 6085.54, 31.57), length = 0.6, width = 0.5, heading = 225.0, minZ = 31.4, maxZ = 31.8, distance = 2.0 },
			{ loc = vec3(252.85, -51.62, 70.0), length = 0.6, width = 0.5, heading = 70.0, minZ = 69.9, maxZ = 70.3, distance = 2.0 },
			{ loc = vec3(23.68, -1106.46, 29.91), length = 0.6, width = 0.5, heading = 160.0, minZ = 29.8, maxZ = 30.2, distance = 2.0 },
			{ loc = vec3(2566.59, 293.13, 108.85), length = 0.6, width = 0.5, heading = 360.0, minZ = 108.7, maxZ = 109.1, distance = 2.0 },
			{ loc = vec3(-1117.61, 2700.26, 18.67), length = 0.6, width = 0.5, heading = 221.82, minZ = 18.5, maxZ = 18.9, distance = 2.0 },
			{ loc = vec3(841.05, -1034.76, 28.31), length = 0.6, width = 0.5, heading = 360.0, minZ = 28.2, maxZ = 28.6, distance = 2.0 }
		}
	},

	

	Bieres = {
		name = 'Bières',
		inventory = {
			{ name = 'piswasser', price = 5 },
		},
		model = {
			`beerrow_local`, `beerrow_world`
		}
	},

	Alcools = {
		name = 'Alcools',
		inventory = {
			{ name = 'mount_whisky', price = 30 },
			{ name = 'tequila', price = 35 },
			{ name = 'nogo_vodka', price = 25 },
		},
		model = {
			`v_ret_ml_liqshelfc`
		}
	},

	Boissons = {
		name = 'Boissons',
		inventory = {
			{ name = 'sprunk', price = 4 },
			{ name = 'cola', price = 4 },
			{ name = 'orang_o_tang', price = 3 },
		},
		model = {
			`v_ret_247shelves02`
		}
	},

	Meteorite = {
		name = 'Meteorite',
		inventory = {
			{ name = 'meteorite', price = 3 },
		},
		model = {
			`v_ret_ml_sweet1`
		}
	},

	EgoChaser = {
		name = 'Ego Chaser',
		inventory = {
			{ name = 'chaser', price = 3 },
		},
		model = {
			`v_ret_ml_sweetego`
		}
	},

	Donuts = {
		name = 'Donuts',
		inventory = {
			{ name = 'donut', price = 2 },
		},
		model = {
			`v_ret_247_donuts`
		}
	},	

	Chips = {
		name = 'Chips',
		inventory = {
			{ name = 'chips_fromage', price = 3 },
			{ name = 'chips_piment', price = 3 },
			{ name = 'chips_ribs', price = 3 },
			{ name = 'chips_nature', price = 2 },
		},
		model = {
			`v_ret_247shelves03`
		}
	},	

	DistributeurBoissons = {
		name = 'Distributeur automatique de boissons',
		inventory = {
			{ name = 'cola', price = 3 },
			{ name = 'sprunk', price = 2 },
			{ name = 'raine', price = 1 },
		},
		model = {
			`prop_vend_soda_01`,`prop_vend_soda_02`,`prop_vend_water_01`,
		}
	},	

	MachineCafe = {
		name = 'Machine à café',
		inventory = {
			{ name = 'bean_machine_coffe', price = 2 },
		},
		model = {
			`prop_vend_coffe_01`
		}
	},

	StandCafe = {
		name = 'Stand de café',
		inventory = {
			{ name = 'bean_machine_coffe', price = 4 },
			{ name = 'meteorite', price = 3 },
		},
		model = {
			`p_ld_coffee_vend_01`,`p_ld_coffee_vend_s`
		}
	},	

	DistributeurSnacks = {
		name = 'Distributeur automatique de snack',
		inventory = {
			{ name = 'meteorite', price = 3 },
			{ name = 'chaser', price = 4 },
		},
		model = {
			`prop_vend_snak_01`,`prop_vend_snak_01_tu`
		}
	},

	StandHotdog = {
		name = 'Stand de hotdog',
		inventory = {
			{ name = 'hotdog', price = 5 },
			{ name = 'cola', price = 5 },
		},
		model = {
			`prop_hotdogstand_01`
		}
	},

	StandBurger = {
		name = 'Stand de burger',
		inventory = {
			{ name = 'burger', price = 7 },
			{ name = 'sprunk', price = 3 },
		},
		model = {
			`prop_burgerstand_01`
		}
	},
}
