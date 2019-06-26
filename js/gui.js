/*
	js/gui.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/

var oEvent = window.event,
translateKeyCodetoContactNumbers = function(iKeyCode) {
	/*
		Funkcja tłumaczy kod klawisza literowego na numer styku Enigmy.
		Zasada działania jest prosta: odejmujemy od przekazanetgo kodu klawisza wartość 65 (kod litery A), co stanowi stałą różnicę pomiędzy kodami klawiszy, a numerami styków.
		
		Sanityzacja argumentu iKeyCode MUSI odbywać się na wyższej warstwie aplikacji (lub w funkcji, z której wywołano opisywaną funkcję).
	*/
	return iKeyCode-65;
}
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
			/*
			switch(action) {
				case "proceed":
				//obsługa polecenia proceed
					if(sPreviousGUIState == "endgame") {
						//p-podobnie warunkiem mogłoby być bPlay==true
						//monit o potwierdzenie zakończenia bieżącej rozgrywki
						action = "gameover";
					}
					else if(bGameOver && sPreviousGUIState=="init") {
						action = "newgame";
						break;
					}
					else if(bGameOver && sPreviousGUIState=="continue") {
						action = "continue";
						break;
					}
					else if(bGameOver && sPreviousGUIState=="gameover") {
						action = "continue";
						break;
					}
				break;
				case "goback":
					if(sPreviousGUIState == "endgame") {
						action = "resume";
					}
			} */
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
		console.log("handleActions: "+action);
		
		/* ### Akcje aplikacji ### */
		/*
		switch(action) {
			//Przesuwanie klocka w lewo 
			case "moveleft": bPlay ? stepSide(0) : null;
			break;
			//Obrót klocka (zawsze przeciwnie do ruchu wskazówek zegara)
			case "flip": bPlay ? flipPiece() : null;
			break;
			//Przesuwanie klocka w prawo
			case "moveright": bPlay ? stepSide(1) : null;
			break;
			//Hard drop klocka
			case "drop": bPlay ? dropPiece() : null;
			break;
		
			case "goback": //DEPRECATED: goback i proceed nie są akcjami gry, tylko poleceniami do kontrolera!
			break;
			case "proceed"://DEPRECATED; j.w.
			break;
			case "init":
				sPreviousGUIState = "init";
				controlGUIPrompts("newplayer");
			break;
			case "continue":
				sPreviousGUIState = "init";
				controlGUIPrompts("oldplayer");
			break;
			case "newgame":
				start();
				controlGUIPrompts("resume");
			break;
			case "pause":
				//TODO: zastanowić się nad obsługą przycisku pauzy w 1. stopniu (!) kontrolera
				togglePlay();
				controlGUIPrompts("pause");
			break;
			case "resume":
				//TODO: przenieść do 1. stopnia kontrolera: obsługa przycisku resume/back
				//TODO: "Back" to będzie przycisk zamykający na górze okna ekranów takich jak O Tetrisie, Ustawienia, Codebase itp. (do 1. st. k.)
				togglePlay();
				controlGUIPrompts("resume");
			break;
			case "endgame":
				//obsługa przycisku "Zakończ grę" i monitu potwierdzenia
				bPlay ? togglePlay() : null;
				controlGUIPrompts("endgame");
			break;
			case "gameover":
				//obsługa stanu "Zakończ grę"
				clearInterval(iGravityInterval);
				main(true); //wywołujemy main() z argumentem true, aby funkcja ta zakończyła rozgrywkę
				sPreviousGUIState = "gameover";
				controlGUIPrompts("gameover");
			break;
			case "storehiscore":
				//obsługa przycisku "Zapisz wynik" (pod koniec rozgrywki, gdy gracz będzie mógł zapisać swój wynik wsród najlepszych)
				bGameOver ? controlGUIPrompts("storehiscore") : null;
			break;
			case "settings":
				//obsługa przycisku otwierającego ekran Ustawienia
				bPlay ? togglePlay() : null;
				controlGUIPrompts("settings");
			break;
			case "scoreboard":
				//obsługa przycisku otwierającego ekran tablicy najlepszych wyników
				bPlay ? togglePlay() : null;
				controlGUIPrompts("scoreboard");
			break;
			case "rules":
				//obsługa przycisku otwierającego ekran Zasady gry
				bPlay ? togglePlay() : null;
				controlGUIPrompts("rules");
			break;
			case "controls":
				//obsługa przycisku otwierającego ekran klawiszologii
				bPlay ? togglePlay() : null;
				controlGUIPrompts("controls");
			break;
			case "about":
				//obsługa przycisku otwierającego ekran artykułu o oryginalnym Tetrisie
				bPlay ? togglePlay() : null;
				controlGUIPrompts("about");
				
			break;
			case "aboutapp":
				//obsługa przycisku otwierającego ekran informacji o aplikacji
				bPlay ? togglePlay() : null;
				controlGUIPrompts("aboutapp");
			break;
			case "translate":
				//obsługa przycisku otwierającego ekran dla tłumaczy
				bPlay ? togglePlay() : null;
				controlGUIPrompts("translate");
			break;
			case "codebase":
				//obsługa przycisku otwierającego ekran informacji o bazie kodowej
				bPlay ? togglePlay() : null;
				controlGUIPrompts("codebase");
			break;
			case "copyright":
				//obsługa przycisku otwierającego ekran informacji o licencji
				bPlay ? togglePlay() : null;
				controlGUIPrompts("copyright");
			break;
		} */
		
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
	};