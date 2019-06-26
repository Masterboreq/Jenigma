/*
	js/application.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Desc: The famous Enigma encrypting machine simulator.
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/
var action = null,
	oContactStrips = document.getElementsByClassName("contacts");
	
document.addEventListener("keydown", handleActions, true);