/*
	Enigma Encrypting Machine Simulator
	Creative Commons Marcin Borkowicz 2019
*/

/*function Rotor(number, initialSetting) {
	this.prototype.type = 0;
	this.prototype.initialSetting = initialSetting;
	this.prototype.scheme = new Map(oRotorTypes.number);
	this.prototype.currentState = 0; //aktualna pozycja bębna
	
};*/
var Letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
],
Rotors = {
	types: {
		1: {
			name: "I",
			rightContacts: [4,10,12,5,11,6,3,16,22,25,13,19,14,21,24,7,23,20,18,15,0,8,1,17,2,9],
			leftContacts: [20,22,24,6,0,3,5,15,21,25,1,4,2,10,12,19,7,23,18,11,17,13,8,16,14,9],
			notchAt: [15], //TODO: sprawdzić, czy wartość nie powinna wynosić 16
			isMoveable: true
		},
		2: {
			name: "II",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true			
		},
		3: {
			name: "III",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true	
		},
		4: {
			name: "IV",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true	
		},
		5: {
			name: "V",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true	
		},
		6: {
			name: "VI",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true	
		},
		7: {
			name: "VII",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true	
		},
		8: {
			name: "VIII",
			rightContacts: [
			],
			leftContacts: [
			],
			notchAt: [15],
			isMoveable: true	
		},
		9: {
			name: "&beta;",
			rightContacts: [
			],
			leftContacts: [
			],
			isMoveable: false	
		},
		10: {
			name: "&gamma;",
			rightContacts: [
			],
			leftContacts: [
			],
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
	return true;
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
	
	
	console.log("currentPosition: "+this.currentPosition+"; currentNotchOffset: "+this.currentNotchOffset+"; currentOffset: "+this.currentOffset);
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
		
		/*
		Należy pamiętać, że odtąd nie obracamy już tylko pierścienia na wirniku, lecz cały wirnik, a więc i jego uzwojenie! Pozycja styku A-01 uzwojenia względem styku A-01 stojana również się zmieni o wartość tymczasowej zmiennej iSettingOffset.
		*/
		this.currentOffset = (26 + iSettingOffset)%26;
	}
	console.log("currentPosition: "+this.currentPosition+"; currentNotchOffset: "+this.currentNotchOffset+"; currentOffset: "+this.currentOffset);
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
		
	if(bIsReflected) {
		//faza powrotu
		this.output = this.leftContacts[iInput + this.currentOffset] - this.currentOffset; //to jest ciekawe!!
	}
	else {
		//faza propagacji w kierunku reflektora
		this.output = this.rightContacts[iInput + this.currentOffset] - this.currentOffset; //to jest ciekawe!!
	}
	this.output = (26+this.output)%26;
	console.log("Output: "+this.output);
	return this.output;
},

preset = function() {
	//TODO: ZAPCHAJDZIURA DLA METODY obiektu Enigma()
	console.log("Funkcja preset");
	return;
},

encipher = function(iCharCode) {
	//console.log("Funkcja encipher");

	// ### etap ustawiania (obrotu) wirników
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
	this.rotor1.code(this.plugboard.output, false); //(2)
	this.rotor2.code(this.rotor1.output, false); //(3)
	this.rotor3.code(this.rotor2.output, false); //(4)
	this.rotor4.code(this.rotor3.output, false); //(5)
	
	// ### nawrót sygnału przez reflektor ###
	this.reflector.send(this.rotor4.output); //(6)
	
	// ### faza powrotu sygnału ###
	this.rotor4.code(this.reflector.output, true); //(7)
	this.rotor3.code(this.rotor4.output, true); //(8)
	this.rotor2.code(this.rotor3.output, true); //(9)
	this.rotor1.code(this.rotor2.output, true); //(10)
	
	this.output.charCode = this.rotor1.output;
	this.output.charName = Letters[this.rotor1.output];
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
	return this.output = this.wiring[iCharCode];
},

toggleDefault = function() {
	return this.wiring = this.defaultWiring;
};

function Plugboard() {
	this.defaultWiring = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]; //domyślny układ braku łącznicy; żadna litera nie jest zamieniana
	this.wiring = this.defaultWiring; //roboczy układ (zmieniany metodą rewire()).
	
	this.rewire = rewire; //metoda służąca do zmiany ustawienia łącznicy
	this.toggleDefault = toggleDefault; //metoda służąca do przywracania łącznicy do stanu rozłączonego (brak komutacji)
	
	this.send = sendChar; //metoda do komutacji przesyłanego sygnału
	
	this.output = null; //do tej zmiennej będzie zapisywać metoda this.send()
	
	return;
};

function Rotor(iType) {
	//funkcja tworzy obiekt wirnika danego typu 
	this.name = Rotors.types[iType].name;
	/* 
		### Rozkład kontaktów (połączeń)
		Numer elementu tablicy to numer kontaktu po każdej ze stron wirnika danego typu.
		W prawdziwej Enigmie kontakty są ponumerowane od 1 do 26, ale ze względu na specyfikę JS, elementy tablicy liczone są od zera, więc pierwszys kontakt ma "adres" zero, a ostatni 25. Natomiast liczba całkowita w danym elemencie tablicy oznacza numer koresponującego styku po drugiej stronie bębna z zachowaniem tego samego sposobu wyliczania styków: np. A<->K to [0=>4] (notacja elementu tablicy jak z PHP; tylko dla potrzeb przykładu).
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
	
	return;
};

function Reflector(iType) {
	//funkcja tworzy obiekt reflektora danego typu 
	this.name = Reflectors.types[iType].name;
	this.shortname = Reflectors.types[iType].shortname;
	this.wiring = Rotors.types[iType].contacts; //zmienna ma taką samą nazwę jak ta w łącznicy (Plugboard), ponieważ obeikt typu Reflector i Plugboard korzystają z tej samej funkcji do komutacji sygnału - f. sendChar
	
	this.send = sendChar; //metoda do komutacji przesyłanego sygnału
	
	this.output = null; //do tej zmiennej będzie zapisywać metoda this.send()
	
	return;
};

function Enigma() {
	/*
		Obiekt spajający mechanikę działania maszyny.
	*/
	this.plugboard;
	this.rotor1;
	this.rotor2;
	this.rotor3;
	this.rotor4 = null;
	this.reflector;
	//this.setup = [plugboard, rotor1, rotor2, rotor3, rotor4, reflector]; //układ wirników; pierwszy element tablicy to wirnik "szybki" (pierwszy z prawej, zaraz za stojanem)
	this.output = {
						charCode: 0, //kod styku na wejściu panelu lampek
						charName: "" //litera na wejściu panelu lampek
					};
	this.reflector = null; //który reflektor jest zamontowany
	this.plugboard = null; //ustawienia łącznicy sygnałowej (Steckerbrett) lub przystawki Uhr
	
	this.preset = preset; //funkcja ładująca konfigurację danej maszyny (np. Enigma M3, Norenigma, itp.)
	this.encipher = encipher //funkcja przeprowadzająca kompletne szyfrowanie
	
	this.presetName = "Generic Enigma";
	this.manufacturer = ""; //easter egg
	
	return;
};

