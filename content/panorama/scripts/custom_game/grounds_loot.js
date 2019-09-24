var slotsRoot = $("#GroundsLootSlots");

function OnLootPicked(args) {
	$.Each(args, (function (v, k) {
		if (!k || !v) return;
		var slot = slotsRoot.Children()[parseInt(k) - 1];
		var slotIcon = slot.FindChildTraverse("GroundsLootIcon");
		var slotNameLabel = slot.FindChildTraverse("SlotName");

		for (var i = 0; i < slotIcon.GetChildCount(); i++) {
			slotIcon.Children()[i].SetHasClass("Hide", true);
		}		

		if (v.lootType == 1) { // Abilities
			var abilityIcon = slotIcon.FindChildTraverse("SlotAbilityIcon");
			abilityIcon.SetHasClass("Hide", false);
			abilityIcon.abilityname = v.content;
			slotNameLabel.text = $.Localize("DOTA_Tooltip_ability_" + v.content);

			var heroEntity = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
 	
			if (Entities.GetAbilityByName(heroEntity, v.content) > 0)
			{
				var miscIcon = slotIcon.FindChildTraverse("SlotMiscIcon");
				miscIcon.SetHasClass("Hide", false);
				miscIcon.SetImage("file://{images}/custom_game/levelup.png");

				slotNameLabel.text = slotNameLabel.text + " (+1)";
			}
		}
		if (v.lootType == 2) { // Items
			var itemIcon = slotIcon.FindChildTraverse("SlotItemIcon");
			itemIcon.SetHasClass("Hide", false);
			itemIcon.itemname = v.content;
			slotNameLabel.text = $.Localize("DOTA_Tooltip_ability_" + v.content);
		}
		if (v.lootType == 3) { // Bonuses
			var miscIcon = slotIcon.FindChildTraverse("SlotMiscIcon");
			miscIcon.SetHasClass("Hide", false);
			miscIcon.SetImage("file://{images}/custom_game/bonuses/" + v.quality + "/" + v.content + ".png");
			slotNameLabel.text = $.Localize(v.content);
			if (typeof(v.value) != "object") 
			{
				slotNameLabel.text = slotNameLabel.text + " (+" + v.value + ")"
			}
		}	
		if (v.lootType == 4) { // Heroes
			var heroIcon = $.CreatePanel( "Panel", slotIcon, "SlotHeroIcon" );
			heroIcon.BLoadLayoutFromString('<root><Panel><DOTAScenePanel style="width: 600px; height: 600px;" unit="'+v.content+'"/></Panel></root>', false, false );
			slotNameLabel.text = $.Localize(v.content.toUpperCase());
		}	
		if (v.lootType == 5) {  // Starting Gifts
			var itemIcon = slotIcon.FindChildTraverse("SlotItemIcon");
			itemIcon.SetHasClass("Hide", false);
			itemIcon.itemname = v.content;
			slotNameLabel.text = $.Localize("DOTA_Tooltip_ability_" + v.content);
		}

		var option = parseInt(k);
		var activate = (function () {
			GameEvents.SendCustomGameEventToServer("grounds_claim", { "option" : option } );
			$("#GroundsLootWindow").SetHasClass("WindowClosed", true);
		});
		slot.FindChildTraverse("SlotButton").SetPanelEvent("onactivate", function () {
			activate();
		});	
		slotIcon.SetPanelEvent("onactivate", function () {
			activate();
		});	
	}));
	$("#GroundsLootWindow").SetHasClass("WindowClosed", false);
}

(function () {
	for (var i = 0; i < slotsRoot.GetChildCount(); i++) {
		slotsRoot.Children()[i].DeleteAsync(0.0);
		slotsRoot.Children()[i].RemoveAndDeleteChildren();
	}
	for (var i = 0; i < 3; i++) {
		var slotPanel = $.CreatePanel( "Panel", slotsRoot, "Slot" + i );
		slotPanel.BLoadLayoutSnippet("Slot");
	}

	GameEvents.Subscribe("grounds_loot_picked", OnLootPicked)
})();