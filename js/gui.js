/*
	js/gui.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/

var oEvent = window.event,
	action = null,
	oContactStrips = document.getElementsByClassName("contacts"),
	oLamps = document.getElementById("lamps"),
	oFastRotorDescLabel = document.getElementById("fast-rotor-desc"),
	oMiddleRotorDescLabel = document.getElementById("middle-rotor-desc"),
	oSlowRotorDescLabel = document.getElementById("slow-rotor-desc"),
	oFourthRotorDescLabel = document.getElementById("fourth-rotor-desc"),
	oReflectorDescLabel = document.getElementById("reflector-desc"),
	oFreehandModeIndicator = document.getElementById("fh-indicator"),
	oProtocolModeIndicator = document.getElementById("prtcl-indicator"),
	oPresetSwitch = document.getElementById("preset-switch"),
	oControlsSwitch = document.getElementById("controls-switch"),
	oAboutSwitch = document.getElementById("about-switch"),
	
	//panele aplikacji
	oOverlay = document.getElementById("overlay"),
	oHeadline = document.getElementById("headline"),
	oGallery = document.getElementById("machine-gallery"),
	oManual = document.getElementById("manual"),
	oAbout = document.getElementById("about-enigma"),
	oCloseButton = document.getElementById("close-button"),
	
		
	//pozycje menu parku maszynowego
	oM1 = document.getElementById("m1"),
	oM2 = document.getElementById("m2"),
	reLetterOnStrip = /[A-Z]/,
	
	hightlightLetterStrips = function(oLetterList, iContact, bDirection=0) {
		/*
			Funkcja służy do poświetlania styku przez który aktualnie przepływa sygnał.
			Funkcja rozróżnia kierunek przepływu sygnału (false lub 0 dla fazy propagacji; true lub 1 dla fazy powrotu).
		*/
		var j = (26+(13-iContact))%26;
		
		if(bDirection) {			
			oLetterList.children[j].setAttribute("lit","green");
		}
		else {
			j = 0;
			do {
				//reset (wygaszanie) liter po poprzednim przejściu sygnału
				oLetterList.children[j].setAttribute("lit","no");
			}
			while(++j<26);
			j = (26+(13-iContact))%26;
			oLetterList.children[j].setAttribute("lit","red");
		}
		return false;
	},	
	hightlightVirtualStrips = function(oLetterList, iContact, bDirection=0) {
		/*
			Funkcja służy do poświetlania wirtualnego styku (tego pomiędzy wirnikami) przez który aktualnie przepływa sygnał.
			Funkcja rozróżnia kierunek przepływu sygnału (false lub 0 dla fazy propagacji; true lub 1 dla fazy powrotu).
			
			UWAGA! Obiekt RegEx "reLetterOnStrip" został zdefiniowany u szczytu pliku.
		*/
		var j = (26+(13-iContact))%26,
			sSpecialLetter = "",
			aRegTempResult = [];
		
		if(bDirection) {
			sSpecialLetter = oLetterList.children[j].textContent;
			aRegTempResult = reLetterOnStrip.exec(sSpecialLetter);
			oLetterList.children[j].textContent = aRegTempResult[0] + String.fromCharCode(9205);
			oLetterList.children[j].setAttribute("lit","green");
		}
		else {
			j = 0;
			do {
				//reset (wygaszanie i przywracanie) liter i dywizów po poprzednim przejściu sygnału
				sSpecialLetter = oLetterList.children[j].textContent;
				aRegTempResult = reLetterOnStrip.exec(sSpecialLetter);
				oLetterList.children[j].textContent = "-" + aRegTempResult[0] + "-" ;
				oLetterList.children[j].setAttribute("lit","no");
			}
			while(++j<26);
			j = (26+(13-iContact))%26;			
			sSpecialLetter = oLetterList.children[j].textContent;
			aRegTempResult = reLetterOnStrip.exec(sSpecialLetter);
			oLetterList.children[j].textContent = String.fromCharCode(9204) + aRegTempResult[0];
			oLetterList.children[j].setAttribute("lit","red");
		}
		return false;
	},
	highlightPlugboardLetters = function(oPlugboard, bDirection=0) {
		/*
			Funkcja służy do poświetlania par styków łącznicy kablowej, przez które aktualnie przepływa sygnał.
			Funkcja rozróżnia kierunek przepływu sygnału (false lub 0 dla fazy propagacji; true lub 1 dla fazy powrotu).
		*/
		var sInputChar = String.fromCharCode(oPlugboard.input+65),
			sOutputChar = String.fromCharCode(oPlugboard.output+65),
			j = 0;
		if(!bDirection) {
			do {
				//funkcja wymaga, aby istniały w zasięgu głównym programu obiekty list styków literowych
				oContactStrips[5].children[j].setAttribute("lit","no");
				oContactStrips[6].children[j].setAttribute("lit","no");
				oContactStrips[7].children[j].setAttribute("lit","no");
			}
			while(++j<9);
		}
		
		j = 0;
		if(bDirection) {
			do {
				if(oContactStrips[7].children[j].textContent == sInputChar) {
					oContactStrips[7].children[j].setAttribute("lit","green");
					oContactStrips[6].children[j].setAttribute("lit","green");
					oContactStrips[5].children[j].setAttribute("lit","green");
					break;
				}
				else if(oContactStrips[5].children[j].textContent == sInputChar) {
					oContactStrips[7].children[j].setAttribute("lit","green");
					oContactStrips[6].children[j].setAttribute("lit","green");
					oContactStrips[5].children[j].setAttribute("lit","green");
					break;
				}
			}
			while(++j<9);
		}
		else {
			do {
				if(oContactStrips[5].children[j].textContent == sInputChar) {
					oContactStrips[5].children[j].setAttribute("lit","red");
					oContactStrips[6].children[j].setAttribute("lit","red");
					oContactStrips[7].children[j].setAttribute("lit","red");
					break;
				}
				else if(oContactStrips[7].children[j].textContent == sInputChar) {
					oContactStrips[7].children[j].setAttribute("lit","red");
					oContactStrips[6].children[j].setAttribute("lit","red");
					oContactStrips[5].children[j].setAttribute("lit","red");
					break;
				}
			}
			while(++j<9);
		}
		return false;
	},
	lightLamps = function(iLetter) {
		/*
			Funkcja służy do zapalania lampki panelu wyjściowego.
		*/
		var j = 0;
		do {
			//reset (wygaszanie) lampek po poprzednim przejściu sygnału
			oLamps.children[j].setAttribute("lit","no");
		}
		while(++j<26);
		
		//zapalanie właściwej lampki
		oLamps.children[iLetter].setAttribute("lit","yes");
		return false;
	},
	_fIsNotDoublet = function(iNeedle, aDblts) {
		/*
			Funkcja pomocnicza służąca do odfiltrowania dubletów wartości podczas wypełniania listy sparowanych kontaktów w widoku łącznicy sygnałowej.
			Bierze argument iNeedle (sprawdzana wartość) i porównuje jego wartośc z każdym elementem w tablicy aDblts.
			Zwraca true, jeśli NIE ZNALEZIONO w tablicy aDblts wartości równej iNeedle; w przeciwnym razie:
				- usuwa z tablicy aDblts element równy iNeedle,
				- zwraca false.
		*/
		var j = 0, l = aDblts.length;
		if(l==0) {
			return true;
		}
		do {
			if(aDblts[j]==iNeedle) {
				aDblts.splice(j, 1);
				return false;
			}
		}
		while(++j<l)
		return true;
	}
	setContactsOnPlugboard = function(oPlugboard) {
		
		var j = 0,
			aDoublets = [],
			oWirePairs = {
				letter: [],
				substitute: []
			};
		do {
			if(oPlugboard.wiring[j] != j && _fIsNotDoublet(oPlugboard.wiring[j], aDoublets)) {
				oWirePairs.letter.push(j);
				oWirePairs.substitute.push(oPlugboard.wiring[j]);
				aDoublets.push(j);
			}
		}
		while(++j<26);
		
		//oWirePairs.letter.sort();
		//oWirePairs.substitute.sort();
		console.log("Letters: "+oWirePairs.letter);
		console.log("Substis: "+oWirePairs.substitute);
		console.log("Doublets: "+aDoublets);
		
		j = 0;
		l = oWirePairs.letter.length;
		do {
			oContactStrips[5].children[j].textContent = Letters[oWirePairs.letter[j]];
			oContactStrips[6].children[j].textContent = "–";
			oContactStrips[7].children[j].textContent = Letters[oWirePairs.substitute[j]];
		}
		while(++j<l);
		return false;
	},
	setContactsPositionOnRotor = function(oRotor) {
		/*
			Funkcja służy do wstępnego ustawiania styków danego wirnika w GUI.
			Co się nad tym kurewstwem namęczyłem..?! ;)
		*/
		var j = 0,
			shift = 0; 
			
		do {
			shift = (26+(13-j))%26; //zaczynamy od "N"
			shift = (26+(shift + oRotor.currentOffset))%26; //uwzględniamy currentOffset
			
			oRotor.guiContactsRight.children[j].textContent = Letters[shift];
			oRotor.guiContactsLeft.children[j].textContent = Letters[shift];
			++j;
		}
		while(j<=25); //styk A znajduje się pośrodku listy, [13] element
		
		return false;
	},
	
	setRingPositionOnRotor = function(oRotor) {
		/*
			Funkcja służy do wstępnego ustawiania liter pierścienia alfabetycznego wirnika w GUI.
			UWAGA! Funkcja zakłada, że istnieje łącznie 9 elementów do opisania litarami;
			 - jeden indeks w okienku maszyny (currentPosition),
			 - cztery elementy powyżej niego,
			 - cztery elementy poniżej niego.
		*/
		
		var j = 0, iToTop = 5,
			shift = (iToTop+(25-j+oRotor.currentPosition))%26,
			iLoopDelimiter = (iToTop*2)-1 ; /*przesunięcie wyznaczane na podstawie oRotor.currentPosition
			itoTop oznacza liczbę indeksów, które trzeba odliczyć od góry listy widocznych liter na pierścieniu, aby trafić na widoczny w okienku maszyny indeks (oRotor.currentPosition).
			Łączna długość (HTMLlistElement.lenght) listy więc, to: (iToTop*2)-1 i tutaj akurat została użyta jako warunek działania pętli poniżej (iLoopDelimiter)
			
			*/
				
		do {
			oRotor.guiRing.children[j].textContent = Letters[shift];
			++j;
			shift = (iToTop+(25-j+oRotor.currentPosition))%26;
		}
		while(j<iLoopDelimiter);
		return false;
	},
	
	stepContactsPositionOnRotor = function(oRotor) {
		/*
			Funkcja służy do przestawienia w GUI o krok naprzód styków danego wirnika.
			Funkcja usuwa ostatni [25] element listy prawych i lewych styków i wstawia go jako pierwszy [0] element odpowiednich list.
		*/
		var movedLetter = oRotor.guiContactsRight.children[25];
		
		//dla prawych styków wirnika
		movedLetter = oRotor.guiContactsRight.removeChild(movedLetter);
		oRotor.guiContactsRight.insertBefore(movedLetter, oRotor.guiContactsRight.children[0]);
		
		//dla lewych styków wirnika
		movedLetter = oRotor.guiContactsLeft.children[25];
		movedLetter = oRotor.guiContactsLeft.removeChild(movedLetter);
		oRotor.guiContactsLeft.insertBefore(movedLetter, oRotor.guiContactsLeft.children[0]);
			
		return false;
	},
	stepRingPositionOnRotor = function(oRotor) {
		/*
			Funkcja służy do przestawienia w GUI o krok naprzód indeksów pierścienia alfabetycznego danego wirnika.
			Funkcja stanowi w zasadzie jednokierunkowy rejestr przesuwny.
		*/
		var j = 8, movedLetter = "", newValue = 0;
		//przesuń literę na pozycji [7] na pozycję [8] jednocześnie postdekrementując zm. j
		do {
			movedLetter = oRotor.guiRing.children[--j].textContent;
			oRotor.guiRing.children[j+1].textContent = movedLetter; 
		}
		while(j>0);
		
		//nowa zawartość dla pierwszego elementu listy
		newValue = Letters.indexOf(movedLetter);
		newValue < 25 ? movedLetter = Letters[++newValue] : movedLetter = Letters[0]
		oRotor.guiRing.children[j].textContent = movedLetter;
			
		return false;
	},

	translateKeyCodetoContactNumbers = function(iKeyCode) {
		/*
			Funkcja tłumaczy kod klawisza literowego na numer styku Enigmy.
			Zasada działania jest prosta: odejmujemy od przekazanetgo kodu klawisza wartość 65 (kod litery A), co stanowi stałą różnicę pomiędzy kodami klawiszy, a numerami styków.
			
			Sanityzacja argumentu iKeyCode MUSI odbywać się na wyższej warstwie aplikacji (lub w funkcji, z której wywołano opisywaną funkcję).
		*/
		return iKeyCode-65;
	},

handleActions = function(oEvent) {
		/*
			Zadaniem funkcji jest obsługa zdarzeń pochodzących z urządzeń interfejsu użytkownika (głównie z klawiatury).
			Funkcja jest typem kontrolera.
		*/
		
		action = null; //zerowanie zmiennej globalnej

		/* ### 1. stopień kontrolera: przechwytywanie zdarzeń ### */
		
		/* ### 1.1 Translacja zdefiniowanych zdarzeń klawiatury na akcje aplikacji ### */
		if(oEvent.type == "keydown") {
			action = oEvent.keyCode;
			//obsługa klawiszy literowych
			if(action>=65 && action<=90) {
				action = translateKeyCodetoContactNumbers(action);
				//wywołaj działanie Enigmy
				oEnigma.encipher(action);

			}
			else {
				//obsługa klawiszy kierunkowych i specjalnych (Return, Esc)
				switch(action) {
					//obsługa Esc
					case 27:
						//podejrzyj w kontrolerze z twojego Tetrisa
					break;
					//spacja
					case 32: //podejrzyj w kontrolerze z twojego Tetrisa
					break;
					//Kursor w lewo
					case 37:	//podejrzyj w kontrolerze z twojego Tetrisa
					break;
					//Kursor w górę
					case 38:	//podejrzyj w kontrolerze z twojego Tetrisa
					break;
					//Kursor w prawo
					case 39: //podejrzyj w kontrolerze z twojego Tetrisa
					break;
					//Kursor w dół
					case 40:	//podejrzyj w kontrolerze z twojego Tetrisa
					break;
				}
			}
		}
		
		/* ### 1.2 Translacja zdarzeń "click" na akcje aplikacji ### */
		else if(oEvent.type == "click") {
			action = oEvent.currentTarget.getAttribute("id");
			
			switch(action) {
				case "preset-switch":
				//otwieranie panelu wyboru typu maszyny (parku maszyn)
					action = "select";
				break;
				case "controls-switch":
				//obsługa trybu "freehand"
					action = "manual";
				break;
				case "about-switch":
				//obsługa trybu "freehand"
					action = "about";
				break;
				case "prtcl-indicator":
				//obsługa trybu "protocol"
					action = "protocol";
				break;
				case "fh-indicator":
				//obsługa trybu "freehand"
					action = "freehand";
				break;
				case "close-button":
				//zamykanie Overlay'a
					action = "close";
				break;
				case "m1":
				//wybór maszyny 1
					action = "m1";
				break;
			}
		}
		else if(oEvent.type == "mouseover") {
			action = oEvent.currentTarget.getAttribute("id");
			//TODO: zawrzeć logikę zdarzenia w controlGUIPrompts()
			switch(action) {
				case "fast":
					// TOCONS: JEŻELI w trybie ustawiania (freehand lub protocol), to UMOŻLIW edycję
					//jeśli NIE, wyświetl etykietę
					oFastRotorDescLabel.style.display = "inline-block";
				break;
				case "middle":
					oMiddleRotorDescLabel.style.display = "inline-block";
				break;
				case "slow":
					oSlowRotorDescLabel.style.display = "inline-block";
				break;
				case "forth":
					oFourthRotorDescLabel.style.display = "inline-block";
				break;
			}
		}
		else if(oEvent.type == "mouseout") {
			//TODO: zawrzeć logikę zdarzenia w controlGUIPrompts()
			action = oEvent.currentTarget.getAttribute("id");
			
			switch(action) {
				case "fast":
					//JEŻELI w trybie ustawiania (freehand lub protocol), to UMOŻLIW edycję
					//jeśli NIE, wyświetl etykietę
					oFastRotorDescLabel.style.display = "none";
				break;
				case "middle":
				
					oMiddleRotorDescLabel.style.display = "none";
				break;
				case "slow":
				//
					oSlowRotorDescLabel.style.display = "none";
				break;
				case "forth":
					oFourthRotorDescLabel.style.display = "none";
				break;
			}
		}
		/* ### 1.3 Translacja argumentów przekazanych do funkcji na akcje aplikacji ### */
		else {
			//tryb działania funkcji, gdy jako parametr zostanie przekazany ciąg znaków, a nie obiekt wbudowany Event
			if(arguments[0]) {
				/*
				switch(arguments[0]) {
					case "init":
						action = "init";
					break;
					case "continue":
						action = "continue";
					break;
					case "endgame":
						action = "endgame";
					break;
					case "gameover":
						//na potrzeby wyraźnego żądania zakończenia rozgrywki
						action = "gameover";
					break;
				} */
			}
		}
		
		/* ### 2. stopień kontrolera: obsługa akcji gry ### */
		//console.log("Wprowadzono na wejście literę: "+Letters[action]);
		
		/* ### Akcje aplikacji ### */
		switch(action) {			
			case "protocol": controlGUIPrompts("protocol");
			break;
			
			case "freehand": controlGUIPrompts("freehand");
			break;
			
			case "about": controlGUIPrompts("about");
			break;
			
			case "manual": controlGUIPrompts("manual");
			break;
			
			case "select": controlGUIPrompts("select");
			break;
			
			case "close": controlGUIPrompts("close");			
			break;
			
			case "m1": controlGUIPrompts("close");
				//wersja 3-wirnikowa
				oEnigma = new Enigma,
				plugboard = new Plugboard(),
				r1 = new Rotor(1,"fast"),
				r2 = new Rotor(2,"middle"),
				r3 = new Rotor(3,"slow"),
				r4 = new Rotor(9,"forth"), // wirnik "duch"
				ref = new Reflector(2),
				aPlugSetting = [3,2,1,0,4,5,6,7,8,9,10,11,12,13,14,15,16,18,17,19,25,21,22,23,24,20];
				
				plugboard.rewire(aPlugSetting);
				r1.set(0,2);
				r2.set(0,23);
				r3.set(0,10);
				r4.set(0,0);
				
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
			break;			
			case "m2": controlGUIPrompts("close");
				//wersja 4-wirnikowa
				oEnigma = new Enigma,
				plugboard = new Plugboard(),
				r1 = new Rotor(3,"fast"),
				r2 = new Rotor(2,"middle"),
				r3 = new Rotor(4,"slow"),
				r4 = new Rotor(7,"forth"), // wirnik "duch"
				ref = new Reflector(4),
				aPlugSetting = [3,2,1,0,4,5,6,7,8,9,10,11,12,13,14,15,16,18,17,19,25,21,22,23,24,20];
				
				plugboard.rewire(aPlugSetting);
				r1.set(0,12);
				r2.set(0,15);
				r3.set(0,7);
				r4.set(0,4);
				
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
				oFourthRotorDescLabel.textContent = "Czwarty wirnik typu "+r4.name;
				oReflectorDescLabel.textContent = ref.shortname;
			break;
		}
		
		return action;
	},
	controlGUIPrompts = function(command) {
		/*
			Funkcja obsługi zachowania GUI dla akcji ustawianych w kontrolerze handleActions().
			
		*/
		
		// ### Czyszczenie stanu ekranów
		oGallery.setAttribute("mode", "off");
		oManual.setAttribute("mode", "off");
		oAbout.setAttribute("mode", "off");
		/*
		//To się może przydać na późniejszym etapie prac, TODO
		oSettings.setAttribute("mode", "off");
		oTranslate.setAttribute("mode", "off");
		oCodebase.setAttribute("mode", "off");
		oLicence.setAttribute("mode", "off");
		*/
		
		// ### Lista obsługiwanych ekranów dla zdarzeń ### 
		oOverlay.setAttribute("mode", "off");
		oHeadline.setAttribute("mode", "on");
		
		switch(command) {
			case "select": //pokaż ekran wyboru maszyn
				oOverlay.setAttribute("mode", "on");
				oHeadline.firstChild.nodeValue = oTicker.selectMachine;
				oGallery.setAttribute("mode", "on");
			break;
			
			case "about": //pokaż artykuł o oryginalnej Enigmie
				oOverlay.setAttribute("mode", "on");
				oHeadline.firstChild.nodeValue = oTicker.originalEnigma;
				oAbout.setAttribute("mode", "on");
			break;

			case "manual": //pokaż instrukcję obsługi
				console.log("manual");
				oOverlay.setAttribute("mode", "on");
				oHeadline.firstChild.nodeValue = oTicker.manual;
				oManual.setAttribute("mode", "on");
			break;
			
			case "protocol": //włącz tryb Protocol
				oProtocolModeIndicator.setAttribute("lit", "yes");
				oFreehandModeIndicator.setAttribute("lit", "no");
			break;	

			case "freehand": //włącz tryb Freehand
				oProtocolModeIndicator.setAttribute("lit", "no");
				oFreehandModeIndicator.setAttribute("lit", "yes");
			break;
			
			case "close": //zamknij panele overlay
				oOverlay.setAttribute("mode", "off");;
			break;
			/*
			case "translate": //pokaż ekran zachęcający do przetłumaczenia aplikacji
				oHeadline.firstChild.nodeValue = oGamePrompts.translate;
				//oHeadline.setAttribute("mode", "on");
				oTranslate.setAttribute("mode", "on");
			break;
			
			case "codebase": //pokaż ekran z informacją o kodzie do pobrania
				oHeadline.firstChild.nodeValue = oGamePrompts.codebase;
				//oHeadline.setAttribute("mode", "on");
				oCodebase.setAttribute("mode", "on");
			break;
			
			case "copyright": //pokaż ekran z informacją o licencji
				oHeadline.firstChild.nodeValue = oGamePrompts.copyright;
				//oHeadline.setAttribute("mode", "on");
				oLicence.setAttribute("mode", "on");
			break; */
		}
		return;
	};
	
	//aktualna maszyna
	var oEnigma = new Enigma,
	plugboard = new Plugboard(),
	r1 = new Rotor(6,"fast"),
	r2 = new Rotor(7,"middle"),
	r3 = new Rotor(8,"slow"),
	r4 = new Rotor(11,"forth"), //aktualnie wirnik "duch"
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
	oFourthRotorDescLabel.textContent = "Czwarty wirnik typu "+r4.name;
	oReflectorDescLabel.textContent = ref.shortname;
	
	// ### Ustawianie nazw zgodnie z językiem ###
	oPresetSwitch.firstChild.textContent = oInterface.machineType;
	oFreehandModeIndicator.firstChild.textContent = oInterface.freehandMode;
	oProtocolModeIndicator.firstChild.textContent = oInterface.protocolMode;
	oControlsSwitch.firstChild.textContent = oInterface.howto;
	oAboutSwitch.firstChild.textContent = oInterface.about;
	oCloseButton.firstChild.textContent = oInterface.close;
	