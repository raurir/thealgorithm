var con = console;

var sounds = [
	{index: 0, id: "danke", src:"danke-tambourine.wav"},
	{index: 1, id: "cod2pac", src:"cod2pac-2-hara-luu-loop-chippy-120.wav"},
	{index: 2, id: "fanto8bc", src:"fanto8bc-fto-break-beat-120.wav"},
	{index: 3, id: "theshivaeffect", src:"theshivaeffect-interesting-drum-pattern.wav"},
];

var stage = new createjs.Stage("demoCanvas");
var circle = new createjs.Shape();
circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;
stage.addChild(circle);


stage.update();

function updateEffect(value) {
	con.log("updateEffect", value);
	stage.update();
}

function init() {
	// if initializeDefaultPlugins returns false, we cannot play sound in this browser
	if (!createjs.Sound.initializeDefaultPlugins()) {return;}
	var audioPath = "wav/"; 
//   createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.addEventListener("fileload", handleLoad);
	createjs.Sound.registerSounds(sounds, audioPath);
}
 
var index = 0;
function handleLoad(event) {
	con.log("handleLoad", event);
	var instance = createjs.Sound.play(event.id, {
		interrupt: createjs.Sound.INTERRUPT_ANY,
		loop: -1
	});

	instance.on("complete", handleComplete, this);
	instance.volume = 0.5;

	index ++;

	var slider = new Slider(0, 1, 200, 50).set({x: 200, y: index * 50, value: 25});
	slider.on("change", handleSliderChange, this);
	stage.addChild(slider);
	stage.update();


	function handleSliderChange(evt) {
		updateEffect(evt.target.value);
		instance.volume = evt.target.value;
	}

	updateEffect(slider.value);

}

function handleComplete(event) {
	con.log("handleComplete", event);
}

init();