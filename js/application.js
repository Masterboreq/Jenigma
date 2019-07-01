/*
	js/application.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Desc: The famous Enigma encrypting machine simulator.
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/
var oEnigma = new Enigma,
	r1 = new Rotor(1,"fast"),
	r2 = new Rotor(2,"middle"),
	r3 = new Rotor(3,"slow"),
	r4 = new Rotor(11,"forth"),
	ref = new Reflector(1);
	
r1.set(0,25);
r2.set(0,0);
r3.set(0,0);
r4.set(0,0);

oEnigma.preset(r1, r2, r3, r4, ref);
setContactsPositionOnRotor(r1);
setRingPositionOnRotor(r1);


document.addEventListener("keydown", handleActions, true);