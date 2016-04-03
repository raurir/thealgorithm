var con = console;

var audioPath = "wav/"; 

var sounds = [
	{index: 0, id: "danke", src:"danke-tambourine.wav"},
	{index: 1, id: "cod2pac", src:"cod2pac-2-hara-luu-loop-chippy-120.wav"},
	{index: 2, id: "fanto8bc", src:"fanto8bc-fto-break-beat-120.wav"},
	{index: 3, id: "theshivaeffect", src:"theshivaeffect-interesting-drum-pattern.wav"},
];

var createInput = (name, min, max, handler) => {
	var div = document.createElement("div");
	var label = document.createElement("label");
	label.innerHTML = name;
	var input = document.createElement("input");
	input.type = "range";
	input.min = min;
	input.max = max;
	document.body.appendChild(div);
	div.appendChild(label);
	div.appendChild(input);
	input.addEventListener("change", handler);
}



var channels = [], loaded = 0;


// createInput("delay", 0, 100, (e) => {
// 	delay.set({mul: e.currentTarget.value / 100});
// });
// createInput("hiss", 0, 100, (e) => {
// 	hiss.set({mul: e.currentTarget.value / 100});
// });


function loadSound(i) {

	var file = audioPath + sounds[i].src;
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
		con.log("loaded!", i, loaded);

		createInput("cutoff " + soundID, 0, 10000, handleFilter);
		createInput("vol " + soundID, 0, 100, handleVolume);

		if (loaded === sounds.length) {
			T("+", channels).play();
		}

	}

	var channel = T(filter, {cutoff: 1200},
		T("audio", {loop: true}).loadthis(file, loadComplete)
	);

	channels[i] = channel;

}
for (var i = sounds.length - 1; i >= 0; i--) {
	loadSound(i);
};


// init();