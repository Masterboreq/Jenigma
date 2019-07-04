/*
	js/enigma.js
	Author: Marcin Borkowicz 2019
	Package: Jenigma Project
	Desc: The famous Enigma encrypting machine simulator.
	Codebase: github.com/Masterboreq/jenigma
	TODO: Website: boreq.com/jenigma
*/

/*function Rotor(number, initialSetting) {
	this.prototype.type = 0;
	this.prototype.initialSetting = initialSetting;
	this.prototype.scheme = new Map(oRotorTypes.number);
	this.prototype.currentState = 0; //aktualna pozycja bębna
	
};*/
var Letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],

Rotors = {
	types: {
		1: {
			name: "I",
			rightContacts: [4,10,12,5,11,6,3,16,22,25,13,19,14,21,24,7,23,20,18,15,0,8,1,17,2,9],
			leftContacts: [20,22,24,6,0,3,5,15,21,25,1,4,2,10,12,19,7,23,18,11,17,13,8,16,14,9],
			/*
				Mała uwaga do zmiennej this.notchAt: z uwagi na mechanikę działania funkcji 
				wykonującej kroki wirników, wartość zmiennej jest zawsze o 1 MNIEJSZA względem
				indeksu litery w okienku (określanej przez zmienną this.currentPosition), PO KROKU której o następną pozycję (literę) występuje obrot następnego wirnika. Np. dla wirnika I: (Q->R); litera w okienku tuż przed krokiem to Q[indeks 16]; w następnym kroku zmieni się na R[indeks 17], WIĘC: 16 (indeks litery Q) odjąć 1 = 15 i to jest prawidłowa wartość this.notchAt.
			*/
			notchAt: [15], //gdy wirnik w okienku pokazuje literę "Q".
			isMoveable: true
		},
		2: {
			name: "II",
			rightContacts: [0,9,3,10,18,8,17,20,23,1,11,7,22,19,12,2,16,6,25,13,15,24,5,21,14,4],
			leftContacts: [0,9,15,2,25,22,17,11,5,1,3,10,14,19,24,20,16,6,4,13,7,23,12,8,21,18],
			notchAt: [3], //E
			isMoveable: true			
		},
		3: {
			name: "III",
			rightContacts: [1,3,5,7,9,11,2,15,17,19,23,21,25,13,24,4,8,22,6,0,10,12,20,18,16,14],
			leftContacts: [19,0,6,1,15,2,18,3,16,4,20,5,21,13,25,7,24,8,23,9,22,11,17,10,14,12],
			notchAt: [20], //V
			isMoveable: true	
		},
		4: {
			name: "IV",
			rightContacts: [4,18,14,21,15,25,9,0,24,16,20,8,17,7,23,11,13,5,19,6,10,3,2,12,22,1],
			leftContacts: [7,25,22,21,0,17,19,13,11,6,20,15,23,16,2,4,9,12,1,18,10,3,24,14,8,5],
			notchAt: [8], //J
			isMoveable: true	
		},
		5: {
			name: "V",
			rightContacts: [21,25,1,17,6,8,19,24,20,15,18,3,13,7,11,23,0,22,12,9,16,14,5,4,2,10],
			leftContacts: [16,2,24,11,23,22,4,13,5,19,25,14,18,12,21,9,20,3,10,6,8,0,17,15,7,1],
			notchAt: [24], //Z
			isMoveable: true	
		},
		6: {
			name: "VI",
			rightContacts: [9,15,6,21,14,20,12,5,24,16,1,4,13,7,25,17,3,10,0,18,23,11,8,2,19,22],
			leftContacts: [18,10,23,16,11,7,2,13,22,0,17,21,6,12,4,1,9,15,19,24,5,3,25,20,8,14],
			notchAt: [15],
			isMoveable: true	
		},
		7: {
			name: "VII",
			rightContacts: [13,25,9,7,6,17,2,23,12,24,18,22,1,14,20,5,0,8,21,11,15,4,10,16,3,19],
			leftContacts: [16,12,6,24,21,15,4,3,17,2,22,19,8,0,13,20,23,5,10,25,14,18,11,7,9,1],
			notchAt: [15],
			isMoveable: true	
		},
		8: {
			name: "VIII",
			rightContacts: [5,10,16,7,19,11,23,14,2,1,9,18,15,3,25,17,0,12,4,22,13,8,20,24,6,21],
			leftContacts: [16,9,8,13,18,0,24,3,21,10,1,5,17,20,7,12,2,15,11,4,22,25,19,6,23,14],
			notchAt: [15],
			isMoveable: true	
		},
		9: {
			name: "&beta;",
			rightContacts: [11,4,24,9,21,2,13,8,23,22,15,1,16,12,3,17,19,0,10,25,6,5,20,7,14,18],
			leftContacts: [17,11,5,14,1,21,20,23,7,3,18,0,13,6,24,10,12,15,25,16,22,4,9,8,2,19],
			isMoveable: false	
		},
		10: {
			name: "&gamma;",
			rightContacts: [5,18,14,10,0,13,20,4,17,7,12,1,19,8,24,2,22,11,16,15,25,23,21,6,9,3],
			leftContacts: [4,11,15,25,7,0,23,9,13,24,3,17,10,5,2,19,18,8,1,12,6,22,16,21,14,20],
			isMoveable: false	
		},
		11: {
			//podły hack dla czwartego "wirtualnego" wirnika w 3-wirnikowych wersjach maszyny. Pozwala uniknąć używania instrukcji warunkowych sprawdzających obecność 4. wirnika.
			name: "ghost",
			rightContacts: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
			leftContacts: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
			isMoveable: false	
		}
	}
},
Reflectors = {
	types: {
		1: {
			name: "Umkehrwalze A",
			shortname: "UKW A",
			contacts: [4,9,12,25,0,11,24,23,21,1,22,5,2,17,16,20,14,13,19,18,15,8,10,7,6,3]
		},
		2: {
			name: "Umkehrwalze B",
			shortname: "UKW B",
			contacts: [24,17,20,7,16,18,11,3,15,23,13,6,14,10,12,8,4,1,5,25,2,22,21,9,0,19]
		},
		3: {
			name: "Umkehrwalze C",
			shortname: "UKW C",
			contacts: [5,21,15,9,8,0,14,24,4,3,17,25,23,22,6,2,19,10,20,16,18,1,13,12,7,11]
		},
		4: {
			name: "Umkehrwalze Bruno",
			shortname: "Bruno",
			contacts: [
			]			
		},
		5: {
			name: "Umkehrwalze Cäsar",
			shortname: "Cäsar",
			contacts: [
			]			
		}
	}
},

Uhr = {
	presets: {
		1: {
			wiring: [4,9,12,25,0,11,24,23,21,1,22,5,2,17,16,20,14,13,19,18,15,8,10,7,6,3]
		}
	},
	get: function(iPreset) {
		if(iPreset>0 & iPreset<=40) {
			return this.presets[iPreset].wiring;
		}
	}
},

step = function() {
	//funkcja jest metodą obiektów wirników (Rotor). Jeśli wywołana, odpowiada za postęp wirnika o jedno pole literowe/styk naprzód (A-01->B-02 itd.).
	this.currentPosition = (++this.currentPosition)%26;
	this.currentOffset = (++this.currentOffset)%26;
	this.currentNotchOffset > 0 ? this.currentNotchOffset-- : this.currentNotchOffset = 25;
	
	//ustawiamy flagę wirnika informującą o obrocie kolejnego wirnika
	if(this.currentNotchOffset < 25) {
		this.stepNextRotor = false;
	}
	else {
		/* Z uwagi na to, że krok kolejnego wirnika występuje dopiero,
		gdy kolejne naciśnięcie klawisza (a więc i przekręcenie się licznika this.currentNotchOffset z wartości zero na 25) ustawienie 
		flagi this.stepNextRotor na true występuje wtedy i tylko wtedy, gdy  this.currentNotchOffset = 25 */
		this.stepNextRotor = true;
	}
	
	//console.log("currentPosition: "+this.currentPosition+"; currentNotchOffset: "+this.currentNotchOffset+"; currentOffset: "+this.currentOffset);
	return;
};

set = function(iRingstellung, iLetter) {
	/*funkcja jest metodą obiektów wirników (Rotor). Służy do ustawienia początkowych pozycji wirnika. Funkcja ustawia następujące właściwości obiektów:
	 - this.currentOffset, czyli, o ile prawy styk A-01 wirnika przesunął się względem styku wyjściowego A-01 stojana.
	 - this.currentPosition, czyli który styk znajduje się pod okienkiem literowym Enigmy na tym wirniku.
	 - this.currentNotchOffset, czyli za ile kroków nastąpi pozycja obrotu kolejnego wirnika 
	*/
	
	//zawsze resetuj zmienne!
	this.currentOffset = 0; 
	this.currentPosition = 0;
	this.currentNotchOffset = (this.notchAt*1); //pozycja wyjściowa dla danego wirnika
	
	if(iRingstellung<=25 && iRingstellung>=0) {
		this.currentPosition += iRingstellung; //przesuwamy pierścień alfabetyczny względem połączeń wirnika. Wirnik nadal znajduje się w pozycji A-01 stojana, zaś litera na pierścieniu alfabetycznym znajduje się w okienku literowym Enigmy na tym wirniku w pozycji zadanej poprzez dodanie do zera wartości iRingstellung.
		
		/*
			Wraz z przesunięciem się pierścienia alfabetycznego, przesuwa się także wycięcie (notch) na tym pierścieniu.
		*/
		this.currentNotchOffset = (26 + this.currentNotchOffset - iRingstellung)%26;
		
	}
	if(iLetter<=25 && iLetter>=0) {
		/*
		Ustawiamy zadaną literę na pozycji w okienku, naprzeciwko styku A-01 stojana. Podczas ustawiania litery musimy wziąć pod uwagę, że this.currentPosition posiada już inną wartość niż zero (jeśli iRingstellung>0). Dlatego należy zbadać, czy zmienne:
		 - this.currentPosition
		 - this.currentNotchOffset
		 - this.currentOffset
		będziemy powiększać czy pomniejszać. Aby to ustalić, odejmujemy od wartości zmiennej argumentu iLetter wartość this.currentPosition i zapisujemy do pomocniczej zmiennej iSettingOffset. Następnie dodajemy iSettingOffset do this.currentPosition.
		Jeżeli iSettingOffset>0 to this.currentPosition powiększy się (bo np. iRingstellung określił this.currentPosition na 5, a iLetter = 6, więc wynikowa wartość this.currentPosition to skok o +1). Jeżeli iLetter wynosiła np. 3, to wynikowa wartość this.currentPosition to skok o -2.
		*/
				
		var iSettingOffset = iLetter - this.currentPosition;
		this.currentPosition += iSettingOffset; //nowa pozycja litery w okienku
		
		/*
			Wraz z ustawieniem wirnika i przytwierdzonego doń pierścienia alfabetycznego, znów przesuwa się wycięcie pierścienia.
		*/
		this.currentNotchOffset = (26 + this.currentNotchOffset - iSettingOffset)%26; //ostateczna pozycja wycięcia
		
		//w tym miejscu sprawdzamy, czy nie należy ustawić flagi wirnika informującej o obrocie kolejnego wirnika (porównaj z analogicznym zapisaem w f-cji step())
		if(this.currentNotchOffset < 25) {
			this.stepNextRotor = false;
		}
		else {
			this.stepNextRotor = true;
		}
		
		/*
		Należy pamiętać, że odtąd nie obracamy już tylko pierścienia na wirniku, lecz cały wirnik, a więc i jego uzwojenie! Pozycja styku A-01 uzwojenia względem styku A-01 stojana również się zmieni o wartość tymczasowej zmiennej iSettingOffset.
		*/
		this.currentOffset = (26 + iSettingOffset)%26;
	}
	//console.log("currentPosition: "+this.currentPosition+"; currentNotchOffset: "+this.currentNotchOffset+"; currentOffset: "+this.currentOffset);
	return;
},

code = function(iInput, bIsReflected=false) {
	/*
		Funkcja odpowiada za transkodowanie (komuntację) sygnału pomiędzy stykami. Paramentr iInput przyjmuje liczbę z zakresu <0,25>. Drugi służy do rozróżnienia kierunku komutacji:
		 - false: sygnał przechodzi z prawej do lewej, czyli od stojana do reflektora,
		 - true: sygnał wraca od reflektora do stojana.
		Funkcja nie ma zabezpieczeń przed idiotami, którzy podadzą argumenty spoza zakresu. Zakłada się, że programista wie, co robi.
		
		Zwracana wartość to pozycja (nr styku) względem stojana.
	*/
	//TODO: DO POPRAWY arytmetyka wyboru elementu tablicy!	
	if(bIsReflected) {
		//faza powrotu 
		this.output = this.leftContacts[(iInput + this.currentOffset)%26] - this.currentOffset; //to jest ciekawe!! (DO SPRAWDZENIA - POWINNO DZIAŁAĆ POPRAWNIE)
	}
	else {
		//faza propagacji w kierunku reflektora
		this.output = this.rightContacts[(iInput + this.currentOffset)%26] - this.currentOffset; //to jest ciekawe!! (DO SPRAWDZENIA - POWINNO DZIAŁAĆ POPRAWNIE)
	}
	this.output = (26+this.output)%26;
//	console.log("Output "+this.name+": "+this.output);
	return this.output;
},

getCurrentPosition = function() {
	return Letters[this.currentPosition];
}

encipher = function(iCharCode) {
	// ### etap ustawiania (obrotu) wirników
	
	//TODO: wpasować tu wywołanie metod stepContactsPositionOnRotor()
	if(this.rotor1.stepNextRotor == true) {
		if(this.rotor2.stepNextRotor == true) {
			this.rotor3.step();
		}
		this.rotor2.step();
	}
	this.rotor1.step(); //wirnik 1 kroczy przy każdorazowym naciśnięciu dowolnej litery
	
	/*
	Przepływ sygnału:
		(1) Klawiatura (iCharCode) -> 
		(2) -> kodowanie sygnału przez wirnik 1 w kierunku propagacji ->
		(3) -> kodowanie sygnału przez wirnik 2 w kierunku propagacji ->
		(4) -> kodowanie sygnału przez wirnik 3 w kierunku propagacji ->
		(5) -> kodowanie sygnału przez wirnik 4 w kierunku propagacji ->
		(6) -> kodowanie sygnału przez reflektor ->
		(7) -> kodowanie sygnału przez wirnik 4 w kierunku powrotu ->
		(8) -> kodowanie sygnału przez wirnik 3 w kierunku powrotu ->
		(9) -> kodowanie sygnału przez wirnik 2 w kierunku powrotu ->
		(10) -> kodowanie sygnału przez wirnik 1 w kierunku powrotu ->
		(11) -> wyjście sygnału przez zmienną this.output
	*/
	
	// ### faza propagacji sygnału ###
	this.plugboard.send(iCharCode); // (1)
		//console.log("Wyjście łącznicy: "+Letters[this.plugboard.output]);
		hightlightLetterStrips(oContactStrips[0], this.plugboard.output, bDirection=0);
	this.rotor1.code(this.plugboard.output, false); //(2)
		//console.log("Wyjście wirnika1: "+Letters[this.rotor1.output]);
<<<<<<< Updated upstream
		//TU SKOŃCZYŁEŚ > TODO: na wyjściu wirnika1 jest zły wynik. P-podobnie coś nie tak w f-cji code();
=======
		/* Wycięte w gałęzi Experimental
		*/
>>>>>>> Stashed changes
		stepContactsPositionOnRotor(this.rotor1);
		stepRingPositionOnRotor(this.rotor1);
		hightlightLetterStrips(this.rotor1.guiContactsRight, this.plugboard.output, 0);
		hightlightLetterStrips(this.rotor1.guiContactsLeft, this.rotor1.output, 0);
		hightlightLetterStrips(oContactStrips[1], this.rotor1.output, bDirection=0);
	this.rotor2.code(this.rotor1.output, false); //(3)
		//stepContactsPositionOnRotor(this.rotor2);
		//stepRingPositionOnRotor(this.rotor2);
		hightlightLetterStrips(this.rotor2.guiContactsRight, this.rotor1.output, 0);
		hightlightLetterStrips(this.rotor2.guiContactsLeft, this.rotor2.output, 0);
		hightlightLetterStrips(oContactStrips[2], this.rotor2.output, bDirection=0);
	this.rotor3.code(this.rotor2.output, false); //(4)
	this.rotor4.code(this.rotor3.output, false); //(5)
	
	// ### nawrót sygnału przez reflektor ###
	this.reflector.send(this.rotor4.output); //(6)
	
	// ### faza powrotu sygnału ###
	this.rotor4.code(this.reflector.output, true); //(7)
	this.rotor3.code(this.rotor4.output, true); //(8)
	this.rotor2.code(this.rotor3.output, true); //(9)
	this.rotor1.code(this.rotor2.output, true); //(10)
	this.plugboard.send(this.rotor1.output);
	
	this.output.charCode = this.plugboard.output;
	this.output.charName = Letters[this.plugboard.output];
	
	//DEBUGGER
	//console.log("Wyjście Enigmy: "+e.output.charName);
	//console.log("Litera w okienkach IV: "+r4.getCurrentPosition()+", III: "+r3.getCurrentPosition()+", II: "+r2.getCurrentPosition()+", I: "+r1.getCurrentPosition());
	
	return this.output;
},

rewire = function(aWiring) {
	if(aWiring instanceof Array) {
		//naprawdę bardzo podstawowe sprawdzenie typu zmiennej; nic szczególnego. Elementami tablicy równie dobrze mogą być gołe baby:)
		this.wiring = aWiring;
	}
	return this.wiring;
},

sendChar = function(iCharCode) {
	this.output = this.wiring[iCharCode];
	//console.log("Reflector output: "+this.output);
	return this.output;
},

toggleDefault = function() {
	return this.wiring = this.defaultWiring;
};

preset = function(oRotor1, oRotor2, oRotor3, oRotor4 = new Rotor(11), oReflector, oPlugboard = 	new Plugboard) {
	var i =3;
	do {
		if(arguments[i].constructor !== Rotor) {
			//sprawdź, czy argumenty od 0 do 3 są obiektami typu Rotor
			return true; //zgłoś błąd
		}
		this["rotor"+(i+1)] = arguments[i];
	}
	while(--i>=0);
	if(oReflector.constructor !== Reflector || oPlugboard.constructor !== Plugboard) {
		return true; //również w tych przypadkach zgłoś błąd
	}
	this.reflector = oReflector;
	this.plugboard = oPlugboard;
}

function Plugboard() {
	this.defaultWiring = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]; //domyślny układ braku łącznicy; żadna litera nie jest zamieniana
	this.wiring = this.defaultWiring; //roboczy układ (zmieniany metodą rewire()).
	
	this.rewire = rewire; //metoda służąca do zmiany ustawienia łącznicy
	this.toggleDefault = toggleDefault; //metoda służąca do przywracania łącznicy do stanu rozłączonego (brak komutacji)
	
	this.send = sendChar; //metoda do komutacji przesyłanego sygnału
	
	this.output = null; //do tej zmiennej będzie zapisywać metoda this.send()
	
	return;
};

function Rotor(iType,sRotorDomId="fourth") {
	//funkcja tworzy obiekt wirnika danego typu 
	this.name = Rotors.types[iType].name;
	
	//przypisany element DOM o danym id w GUI aplikacji (np. div o id="forth").
	this.guiElement = document.getElementById(sRotorDomId);
	
	//paski kontaktów w GUI: prawy i lewy
	this.guiContactsRight = this.guiElement.children[0];
	this.guiContactsLeft = this.guiElement.children[1];
	
	//pierścień literowy w GUI
	this.guiRing = this.guiElement.getElementsByClassName("indexes")[0];
	/* 
		### Rozkład kontaktów (połączeń)
		Numer elementu tablicy to numer kontaktu po każdej ze stron wirnika danego typu.
		W prawdziwej Enigmie kontakty są ponumerowane od 1 do 26, ale ze względu na specyfikę JS, elementy tablicy liczone są od zera, więc pierwszy kontakt ma "adres" zero, a ostatni 25. Natomiast liczba całkowita w danym elemencie tablicy oznacza numer koresponującego styku po drugiej stronie bębna z zachowaniem tego samego sposobu wyliczania styków: np. A<->K to [0=>4] (notacja elementu tablicy jak z PHP; tylko dla potrzeb przykładu).
	*/
	this.rightContacts = Rotors.types[iType].rightContacts; //26-elementowa tablica wskazująca na numer odpowiadającego każdemu ze styków po prawej stronie wirnika (wchodzących) stykowi po stronie lewej (wychodzącej)
	this.leftContacts = Rotors.types[iType].leftContacts; //26-elementowa tablica wskazująca na numer odpowiadającego każdemu ze styków po lewej (wychodzącej) stronie wirnika stykowi po stronie prawej (wchodzącej). Ma to znaczenie dla fazy powrotu sygnału po wcześniejszym jego zawróceniu przez reflektor.
	
	this.notchAt = Rotors.types[iType].notchAt; //styk(i), po którym (jeśli Ringstellung ustawiony w pozycji A-01, czyli literze a przypada styk this.rightContacts[0]) następuje przesunięcie kolejnego wirnika z lewej o jedną pozycję (i poprzedzającego wirnika także). Wirniki typu VI, VII i VIII posiadają dwa nacięcia (notches) więc tam tablica będzie zawierać dwa elementy.
	this.isMoveable = Rotors.types[iType].isMoveable; //czy dany wirnik może się kręcić (true). Wirniki beta i gamma się nie kręcą i mogą być "zainstalowane" tylko jako 4. wirnik wraz ze specjalnymi wąskoprofilowymi reflektorami B lub C (odmiana normalnych reflektorów B lub C). TODO: CZY TO W OGÓLE POTRZEBNE? MOŻNA TAK ZROBIĆ METODĘ this.step(), ŻEBY DLA WIRNIKÓW beta i gamma W OGÓLE NIE ZMIENIAŁA POZYCJI WIRNIKA LUB W OGÓLE JEJ NIE WYWOŁYWAĆ.
	
	// ### Ustawienia wirnika ###
	/*	UWAGA! I tak należy wywołać metodę this.set() celem dokonania ustawień wstępnych wirnika,
		więc poniższe zapisy są nieco nadmiarowe.
	*/
	this.currentOffset = 0; //o ile prawy styk A-01 (this.rightContacts[0]) wirnika przesunął się względem styku wyjściowego A-01 stojana. Jest to zawsze liczba całkowita z zakresu <0,25>.
	this.currentPosition = 0; //która litera na pierścieniu alfabetycznym znajduje się w okienku literowym Enigmy na tym wirniku.
	this.currentNotchOffset = this.currentPosition + (this.notchAt*1); // wyznacza, kiedy popychacz trafia na wycięcie (notch) pierścienia.  this.currentNotchOffset jest dekrementowana z każdym wywołaniem mtody this.step() aż osiągnie zero. Wtedy w następnym kroku nastąpi przesunięcie kolejnego wirnika z lewej o jedną pozycję (i TEGO wirnika także). W następny kroku (this.step()) także this.currentNotchOffset zostaje ustawiona na 25 i całe odejmowanie zaczyna się od początku.
	
	// ### Flagi stanu wirnika ###
	this.stepNextRotor = false; //jeśli ta flaga jest ustawiona na true, wirnik wymusi krok kolejnego wirnika (na lewo od niego).
	this.output = 0; //wynik transkodowania sygnału przekazany do następnego modułu maszyny. Do tej zmiennej będzie zapisywać metoda this.code().
	
	// ### Metody obiektu ###
	this.step = step; //przypisanie funkcji z globalnego zasięgu jako metody obiektu
	this.set = set; //przypisanie funkcji z globalnego zasięgu jako metody obiektu
	this.code = code; //funkcja odpowiadająca za substytucję znaków, czyli transkodowanie sygnału przez wirnik.
	this.getCurrentPosition = getCurrentPosition; //zwraca aktualną literę w okienka wirnika. Metoda konwertuje this.currentPosition na literę z tablicy globalnej Letters.
	this.toString = function() {
		//TODO: zrewidować!
		var dltr = ";\n";
		console.log("Wirnik " + this.name + dltr + "Pozycja: "+this.getCurrentPosition() + dltr +"currentOffset: " + Letters[this.currentOffset] + dltr + "currentNotchOffset: " + this.currentNotchOffset + dltr + "Styk wyjściowy: "+ Letters[this.output]);
		return false;
	}
	
	return;
};

function Reflector(iType) {
	//funkcja tworzy obiekt reflektora danego typu 
	this.name = Reflectors.types[iType].name;
	this.shortname = Reflectors.types[iType].shortname;
	this.wiring = Reflectors.types[iType].contacts; //zmienna ma taką samą nazwę jak ta w łącznicy (Plugboard), ponieważ obeikt typu Reflector i Plugboard korzystają z tej samej funkcji do komutacji sygnału - f. sendChar
	
	this.send = sendChar; //metoda do komutacji przesyłanego sygnału
	
	this.output = null; //do tej zmiennej będzie zapisywać metoda this.send()
	
	return;
};

function Enigma() {
	/*
		Obiekt spajający mechanikę działania maszyny.
	*/
	
	//części składowe (wirniki, reflektor, etc.)
	this.plugboard = null; //ustawienia łącznicy sygnałowej (Steckerbrett) lub przystawki Uhr
	this.rotor1; //wirnik szybki
	this.rotor2;
	this.rotor3;
	this.rotor4;
	this.reflector = null; //który reflektor jest zamontowany
	
	this.output = {
						charCode: 0, //kod styku na wejściu panelu lampek
						charName: "" //litera na wejściu panelu lampek
					};
	
	// Metody maszyny
	this.preset = preset; //funkcja ładująca konfigurację danej maszyny (np. Enigma M3, Norenigma, itp.)
	this.encipher = encipher //funkcja przeprowadzająca kompletne szyfrowanie
	
	// Flagi stanu maszyny
	//TOCONS
	
	
	// Inne właściwości
	this.presetName = "Generic Enigma";
	this.manufacturer = ""; //easter egg
	
	return;
};

//start próbnego programu
/*var e = new Enigma,
	r1 = new Rotor(1),
	r2 = new Rotor(2),
	r3 = new Rotor(3),
	r4 = new Rotor(11),
	ref = new Reflector(1);

r1.set(0,15);
r2.set(0,0);
r3.set(0,0);
r4.set(0,0);
	
e.preset(r1, r2, r3, r4, ref);
r3.step();
r3.step();
r3.step();
r3.step();
r3.step();
inp = 0;
e.encipher(inp);
*/
