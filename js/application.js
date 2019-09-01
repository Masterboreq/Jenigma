/*
	js/application.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Desc: The famous Enigma encrypting machine simulator.
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/

/*var oEnigma = new Enigma,
	plugboard = new Plugboard(),
	r1 = new Rotor(6,"fast"),
	r2 = new Rotor(7,"middle"),
	r3 = new Rotor(8,"slow"),
	r4 = new Rotor(9,"forth"), //aktualnie wirnik "duch"
	ref = new Reflector(2),
	
	aPlugSetting = [3,2,1,0,4,5,6,7,8,9,10,11,12,13,14,15,16,18,17,19,25,21,22,23,24,20];
	
plugboard.rewire(aPlugSetting);
r1.set(0,20);
r2.set(0,25);
r3.set(0,16);
r4.set(5,0);

oEnigma.preset(r1, r2, r3, r4, ref, plugboard);
setContactsOnPlugboard(plugboard);
setContactsPositionOnRotor(r1);
setRingPositionOnRotor(r1);
setContactsPositionOnRotor(r2);
setRingPositionOnRotor(r2);
setContactsPositionOnRotor(r3);
setRingPositionOnRotor(r3);
setContactsPositionOnRotor(r4);
setRingPositionOnRotor(r4);

//wyświetlanie zaktualizowanych podpisów na elementach maszyny
oFastRotorDescLabel.textContent = "Szybki wirnik typu "+r1.name;
oMiddleRotorDescLabel.textContent = "Środkowy wirnik typu "+r2.name;
oSlowRotorDescLabel.textContent = "Wolny wirnik typu "+r3.name;
oReflectorDescLabel.textContent = ref.shortname;
*/

document.addEventListener("keydown", handleActions, true);

// ### Akcje przycisków wyboru maszyny
oM1.addEventListener("click", handleActions, true);

// ### Akcje przycisków menu głównego
oPresetSwitch.addEventListener("click", handleActions, true);
oControlsSwitch.addEventListener("click", handleActions, true);
oAboutSwitch.addEventListener("click", handleActions, true);

// ### Akcje przycisków trybów
oFreehandModeIndicator.addEventListener("click", handleActions, true);
oProtocolModeIndicator.addEventListener("click", handleActions, true);

// ### Zamykanie panelu Overlay
oCloseButton.addEventListener("click", handleActions, true);

r1.guiElement.addEventListener("mouseover", handleActions, true);
r2.guiElement.addEventListener("mouseover", handleActions, true);
r3.guiElement.addEventListener("mouseover", handleActions, true);

r1.guiElement.addEventListener("mouseout", handleActions, true);
r2.guiElement.addEventListener("mouseout", handleActions, true);
r3.guiElement.addEventListener("mouseout", handleActions, true);

