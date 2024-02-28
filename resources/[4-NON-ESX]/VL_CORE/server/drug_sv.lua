ESX = exports["es_extended"]:getSharedObject()

--Drogues
	--lean
		ESX.RegisterUsableItem('lean', function(source)
			local xPlayer = ESX.GetPlayerFromId(source)
			xPlayer.removeInventoryItem('lean', 1)

			TriggerClientEvent('Vida-Loca-drugs:useItem', source, 'lean')

			Citizen.Wait(1000)
		end)

	--Coke
		ESX.RegisterUsableItem('coke_bag', function(source)
			local xPlayer = ESX.GetPlayerFromId(source)
			xPlayer.removeInventoryItem('coke_bag', 1)

			TriggerClientEvent('Vida-Loca-drugs:useItem', source, 'coke_bag')

			Citizen.Wait(1000)
		end)

	--Crack
		ESX.RegisterUsableItem('crack_bag', function(source)
			local xPlayer = ESX.GetPlayerFromId(source)
			xPlayer.removeInventoryItem('crack_bag', 1)

			TriggerClientEvent('Vida-Loca-drugs:useItem', source, 'crack')

			Citizen.Wait(1000)
		end)

	--Meth
		ESX.RegisterUsableItem('meth_bag', function(source)
			local xPlayer = ESX.GetPlayerFromId(source)
			xPlayer.removeInventoryItem('meth_bag', 1)

			TriggerClientEvent('Vida-Loca-drugs:useItem', source, 'meth')

			Citizen.Wait(1000)
		end)

	--Exta
		ESX.RegisterUsableItem('exta_bag', function(source)
			local xPlayer = ESX.GetPlayerFromId(source)
			xPlayer.removeInventoryItem('exta_bag', 1)

			TriggerClientEvent('Vida-Loca-drugs:useItem', source, 'exta')

			Citizen.Wait(1000)
		end)
