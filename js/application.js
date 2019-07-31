/*
	js/application.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Desc: The famous Enigma encrypting machine simulator.
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/
var oEnigma = new Enigma,
	plugboard = new Plugboard(),
	r1 = new Rotor(6,"fast"),
	r2 = new Rotor(7,"middle"),
	r3 = new Rotor(8,"slow"),
	r4 = new Rotor(11,"forth"), //aktualnie "wirnik duch"
	ref = new Reflector(2),
	
	aPlugSetting = [4,1,2,3,0,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
	
plugboard.rewire(aPlugSetting);
r1.set(0,20);
r2.set(0,25);
r3.set(0,16);
r4.set(0,0);

oEnigma.preset(r1, r2, r3, r4, ref, plugboard);
setContactsPositionOnRotor(r1);
setRingPositionOnRotor(r1);
setContactsPositionOnRotor(r2);
setRingPositionOnRotor(r2);
setContactsPositionOnRotor(r3);
setRingPositionOnRotor(r3);

//wyświetlanie zaktualizowanych podpisów na elementach maszyny
oFastRotorDescLabel.textContent = "Szybki wirnik typu "+r1.name;
oMiddleRotorDescLabel.textContent = "Środkowy wirnik typu "+r2.name;
oSlowRotorDescLabel.textContent = "Wolny wirnik typu "+r3.name;
oReflectorDescLabel.textContent = ref.shortname;

document.addEventListener("keydown", handleActions, true);
oFreehandModeIndicator.addEventListener("click", handleActions, true);
oProtocolModeIndicator.addEventListener("click", handleActions, true);
r1.guiElement.addEventListener("mouseover", handleActions, true);
r2.guiElement.addEventListener("mouseover", handleActions, true);
r3.guiElement.addEventListener("mouseover", handleActions, true);

r1.guiElement.addEventListener("mouseout", handleActions, true);
r2.guiElement.addEventListener("mouseout", handleActions, true);
r3.guiElement.addEventListener("mouseout", handleActions, true);