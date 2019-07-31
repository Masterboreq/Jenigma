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
	oReflectorDescLabel = document.getElementById("reflector-desc"),
	oFreehandModeIndicator = document.getElementById("fh-indicator"),
	oProtocolModeIndicator = document.getElementById("prtcl-indicator"),

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
	lightLamps = function(iLetter) {
		/*
			Funkcja służy do zapalania lampki panelu wyjściowego.
		*/
			j = 0;
		do {
			//reset (wygaszanie) lampek po poprzednim przejściu sygnału
			oLamps.children[j].setAttribute("lit","no");
		}
		while(++j<26);
		
		//zapalanie właściwej lampki
		oLamps.children[iLetter].setAttribute("lit","yes");
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
			action = oEvent.target.hash;
			action = action.substring(1); //usuwamy znak "#"
			
			switch(action) {
				case "protocol":
				//obsługa trybu "protocol"
					action = "protocol";
				break;
				case "freehand":
				//obsługa trybu "freehand"
					action = "freehand";
				break;
			}
		}
		else if(oEvent.type == "mouseover") {
			//oEvent.
			action = oEvent.currentTarget.getAttribute("id");
			
			switch(action) {
				case "fast":
					//JEŻELI w trybie ustawiania (freehand lub protocol), to UMOŻLIW edycję
					//jeśli NIE, wyświetl etykietę
					oFastRotorDescLabel.style.display = "inline-block";
				break;
				case "middle":
				//
				
					oMiddleRotorDescLabel.style.display = "inline-block";
				break;
				case "slow":
				//
					oSlowRotorDescLabel.style.display = "inline-block";
				break;
			}
		}
		else if(oEvent.type == "mouseout") {
			//oEvent.
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
		console.log("Wprowadzono na wejście literę: "+Letters[action]);
		
		/* ### Akcje aplikacji ### */
		switch(action) {			
			case "protocol": oProtocolModeIndicator.setAttribute("lit", "yes");
				oFreehandModeIndicator.setAttribute("lit", "no");
			break;
			
			case "freehand": oProtocolModeIndicator.setAttribute("lit", "no");
				oFreehandModeIndicator.setAttribute("lit", "yes");
			break;
			
		
		} /* */
		
		/* ### 3. stopień kontrolera: moduł obsługi flagi sPreviousGUIState ### */
		/*switch(action) {
			case "newgame":
				sPreviousGUIState = "init";
			break;
			case "init":
				sPreviousGUIState = "init";
			break;
			case "endgame":
				sPreviousGUIState = "endgame";
			break;
			default:
			//domyślne przypisanie wartości zmiennej sPreviousGUIState
			//sPreviousGUIState = "resume";
			//sPreviousGUIState = action;
			break;
		} */
		
		/* TYLKO DLA DEBUGGERA!
		
		console.log("Naciśnięto ");
		
		*/
		return action;
	},
	controlGUIPrompts = function(command) {
		/*
			Funkcja obsługi zachowania GUI dla akcji ustawianych w kontrolerze handleActions().
			
			UWAGA! Funkcja przyjmuje następujące dane wejściowe:
			1. Wyraźnie zadany argument command, JEŻELI wywołana jawnie w kodzie,
			LUB
			2. [DEPRECATED] polega na wartości Element.hash, JEŻELI wywołana za pomocą procedury obsługi zdarzenia jako funkcja do obsługi zdarzenia.
		*/
		
		// ### Czyszczenie stanu ekranów
	/* 	oInitScreen.setAttribute("mode", "off");
		oContinueScreen.setAttribute("mode", "off");
		oPauseScreen.setAttribute("mode", "off");
		oAbortScreen.setAttribute("mode", "off");
		oEndScreen.setAttribute("mode", "off");
		oStoreHiscore.setAttribute("mode", "off");
		oSettings.setAttribute("mode", "off");
		oScoreboard.setAttribute("mode", "off");
		oRules.setAttribute("mode", "off");
		oControls.setAttribute("mode", "off");
		oAbout.setAttribute("mode", "off");
		oAboutApp.setAttribute("mode", "off");
		oTranslate.setAttribute("mode", "off");
		oCodebase.setAttribute("mode", "off");
		oLicence.setAttribute("mode", "off");
		
		### Lista obsługiwanych ekranów dla zdarzeń ### 
		oOverlay.setAttribute("mode", "off");
		oPromptsWrapper.setAttribute("mode", "on");
		oTicker.setAttribute("mode", "on");
		
		switch(command) {
			case "newplayer": //ekran powitalny nowego gracza zaraz po intrze (TODO: intro gry)
				oTicker.firstChild.nodeValue = oGamePrompts.newGame;
				//oOverlay.setAttribute("mode", "off");
				//oPromptsWrapper.setAttribute("mode", "on");
				//oTicker.setAttribute("mode", "on");
				oInitScreen.setAttribute("mode", "on");
			break;
			
			case "oldplayer": //ekran powitalny stałego gracza zaraz po intrze 
				oTicker.firstChild.nodeValue = oGamePrompts.continueGame;
				//oOverlay.setAttribute("mode", "off");
				//oPromptsWrapper.setAttribute("mode", "on");
				//oTicker.setAttribute("mode", "on");
				oContinueScreen.setAttribute("mode", "on");
			break;
			
			case "newgame": //[DEPRECATED: TO SAMO ROBI "resume"] stan gry: nowa runda rozgrywki (pierwsza lub kolejna)
			//TODO: zaprojektować przepływ sterowania od stanu "init"/"endgame" do stanu "newgame"
				oOverlay.setAttribute("mode", "off");
				oPromptsWrapper.setAttribute("mode", "off");
				oTicker.setAttribute("mode", "off");
				oInitScreen.setAttribute("mode", "off");
			break;
			
			case "pause": //grę spauzowano
				oWell.style.display = "none";
				oOverlay.setAttribute("mode", "on");
				//oPromptsWrapper.setAttribute("mode", "on");
				//oTicker.setAttribute("mode", "on");
				oTicker.firstChild.nodeValue = oGamePrompts.pause;
				oPauseScreen.setAttribute("mode", "on");
			break;
					
			case "resume": //grę wznowiono po pauzie
				oWell.style.display = "block";
				oOverlay.setAttribute("mode", "off");
				oPromptsWrapper.setAttribute("mode", "off");
				oTicker.setAttribute("mode", "off");
				oPauseScreen.setAttribute("mode", "off");
			break;
			
			case "endgame": //monit o potwierdzenie zakończenia gry
				oOverlay.setAttribute("mode", "on");
				//oPromptsWrapper.setAttribute("mode", "on");
				//oTicker.setAttribute("mode", "on");
				oTicker.firstChild.nodeValue = oGamePrompts.abortGameTicker;
				oAbortScreen.setAttribute("mode", "on");
			break;
			
			case "gameover": //gra się zakończyła
				oOverlay.setAttribute("mode", "on");
				//oPromptsWrapper.setAttribute("mode", "on");
				//oTicker.setAttribute("mode", "on");
				oTicker.firstChild.nodeValue = oGamePrompts.gameOver;
				oEndScreen.setAttribute("mode", "on");
			break;
			
			case "storehiscore": //wpisz się na listę najlepszych wyników
				oTicker.firstChild.nodeValue = oGamePrompts.enterHiScore;
				//oTicker.setAttribute("mode", "on");
				oStoreHiscore.setAttribute("mode", "on");
			break;
			
			case "settings": //pokaż ekran ustawień
				oOverlay.setAttribute("mode", "on");
				oTicker.firstChild.nodeValue = oGamePrompts.settings;
				//oTicker.setAttribute("mode", "on");
				//oPromptsWrapper.setAttribute("mode", "on");
				oSettings.setAttribute("mode", "on");
			break;
			
			case "scoreboard": //pokaż tablicę najlepszych wyników
				oTicker.firstChild.nodeValue = oGamePrompts.showHiScores;
				//oTicker.setAttribute("mode", "on");
				oScoreboard.setAttribute("mode", "on");
			break;
			
			case "rules": //pokaż zasady gry
				oTicker.firstChild.nodeValue = oGamePrompts.rules;
				//oTicker.setAttribute("mode", "on");
				oRules.setAttribute("mode", "on");
			break;

			case "controls": //pokaż klawiszologię
				oTicker.firstChild.nodeValue = oGamePrompts.controls;
				//oTicker.setAttribute("mode", "on");
				oControls.setAttribute("mode", "on");
			break;
			
			case "about": //pokaż artykuł o oryginalnym Tetrisie
				oTicker.firstChild.nodeValue = oGamePrompts.about;oPromptsWrapper.setAttribute("mode", "opaque");
				//oTicker.setAttribute("mode", "on");
				oAbout.setAttribute("mode", "on");
			break;
			
			case "aboutapp": //pokaż info o tej aplikacji
				oTicker.firstChild.nodeValue = oGamePrompts.aboutapp;
				//oTicker.setAttribute("mode", "on");
				oAboutApp.setAttribute("mode", "on");
			break;
			
			case "translate": //pokaż ekran zachęcający do przetłumaczenia aplikacji
				oTicker.firstChild.nodeValue = oGamePrompts.translate;
				//oTicker.setAttribute("mode", "on");
				oTranslate.setAttribute("mode", "on");
			break;
			
			case "codebase": //pokaż ekran z informacją o kodzie do pobrania
				oTicker.firstChild.nodeValue = oGamePrompts.codebase;
				//oTicker.setAttribute("mode", "on");
				oCodebase.setAttribute("mode", "on");
			break;
			
			case "copyright": //pokaż ekran z informacją o licencji
				oTicker.firstChild.nodeValue = oGamePrompts.copyright;
				//oTicker.setAttribute("mode", "on");
				oLicence.setAttribute("mode", "on");
			break;
		}*/
		return;
	};
	