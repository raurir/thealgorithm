var con = console;

let thealgorithm = () => {

	var audioPath = "wav/", audioExtension = ".wav";
	// var audioPath = "mp3/", audioExtension = ".mp3";
	var inputs = document.getElementById("inputs");
	var logger = document.getElementById("logger");

	var sounds = [
		{index: 0, id: "danke", src:"danke-tambourine"},
		// {index: 1, id: "cod2pac", src:"cod2pac-2-hara-luu-loop-chippy-120"},
		// {index: 2, id: "fanto8bc", src:"fanto8bc-fto-break-beat-120"},
		// {index: 3, id: "theshivaeffect", src:"theshivaeffect-interesting-drum-pattern"},
	];

	let createInput = (name, min, max, handler) => {
		var div = document.createElement("div");
		var label = document.createElement("label");
		label.innerHTML = name;
		var input = document.createElement("input");
		input.type = "range";
		input.min = min;
		input.max = max;
		inputs.appendChild(div);
		div.appendChild(label);
		div.appendChild(input);
		input.addEventListener("change", handler);
	}

	let log = (msg) => {
		con.log("log", msg);
		var div = document.createElement("div");
		div.innerHTML = msg;
		logger.appendChild(div);
	}

	log('code loaded');


	var channels = [], loaded = 0;


	// createInput("delay", 0, 100, (e) => {
	// 	delay.set({mul: e.currentTarget.value / 100});
	// });
	// createInput("hiss", 0, 100, (e) => {
	// 	hiss.set({mul: e.currentTarget.value / 100});
	// });


	function loadSound(i) {

		log("loadSound " + i);

		var file = `${audioPath}${sounds[i].src}${audioExtension}`;
		var soundID = sounds[i].id;

		var channel ;
		var filter = i % 2 == 0 ? "lpf" : "hpf";

		let handleFilter = (e) => {
			var cutoff = parseFloat(e.currentTarget.value);
			con.log("handleFilter", soundID, cutoff);
			channel.set({cutoff: cutoff})
		};

		let handleVolume = (e) => {
			var volume = parseFloat(e.currentTarget.value / 100);
			con.log("handleVolume", soundID, volume);
			channel.set({mul: volume})
		};

		function loadComplete(res) {
			loaded++;
			log(`loaded!  ${i} ${loaded}`);

			createInput("cutoff " + soundID, 0, 10000, handleFilter);
			createInput("vol " + soundID, 0, 100, handleVolume);

			if (loaded === sounds.length) {
				log("playing music");
				T("+", channels).play();
			}

		}

		let loadFail = (err) => {
			log(`loadFail ${i} ${err}`);
		}

		try {
			var channel = T(filter, {cutoff: 1200},
				T("audio", {loop: true}).loadthis(file, loadComplete, loadFail)
				.on("load", (a) => { log(`on load ${i} error:${a}`);})
				.on("loadedmetadata", (a) => { log(`on loadedmetadata ${i} error:${a}`); })
				.on("loadeddata", (a) => { log(`on loadeddata ${i} error:${a}`); })
				.on("done", (a) => { log(`on done ${i} error:${a}`); })
				.on("error", (a) => { log(`on error ${i} error:${a}`); })
			);
			channels[i] = channel;
		} catch (err) {
			log("try catch " + err);
		}


	}

	let init = () => {
		log("init");
		for (var i = 0; i < sounds.length; i++) {
			loadSound(i);
		};
	}

	return {
		init: init
	}
};

window.thealgorithm = thealgorithm();