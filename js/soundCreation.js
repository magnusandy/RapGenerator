var intervalID = [];
var context = new AudioContext();
var masterVolume = context.createGain();
masterVolume.gain.value = 0.1;
masterVolume.connect(context.destination);

var rap = createRap(10); 
console.log(rap);

//returns a string rap, which consists of random words from the dictionary between raplike phrases
function createRap(length)
{
	var rapwords = ["Yo","Give it to me","Gimme some","Thats what","Heya","What","Lets go","thats it","holla","bless","Sup"];
	var j=0
	var rap = "";
	while(j<length)
	{
		rand = Math.floor((Math.random()*109560)+1);//there are lots of words in the dict array in the dist.js file
		rap = rap + rapwords[Math.floor((Math.random()*rapwords.length))]+ ". " +dict[rand].word + ". "
		j = j+1
	}
	return rap
}

//Create a tone with a specified duration, freq, detune and type
//type is a number from 1-4
//duration in miliseconds
function createSound(duration, frequency, detune, type)
{
	duration = duration/1000 //convert from miliseconds to seconds
	waveType = ['sine', 'square', 'sawtooth', 'triangle']
	var osc = context.createOscillator();
	osc.frequency.value = frequency;
	osc.type = waveType[type-1];
	osc.detune.value = detune;
	osc.connect(masterVolume);
	var startTime = context.currentTime
	osc.start(startTime);
	osc.stop(startTime+duration);
}

//TTS reads the rap and plays the beat
function startRap() {
responsiveVoice.speak(rap, "UK English Male", {rate: 1});
playSound(500, 65, 0, 4, 1000)
playSound(100, 100, 0,4, 400)
playSound(100, 1000, 0,4, 2000)
};

//stop the beats
function stopRap(intervalArray) {
for (i = 0; i < intervalArray.length; i++) { 
	clearInterval(intervalArray[i])
}
responsiveVoice.cancel();
intervalArray = [];
};

//plays a tone with specificed freq, detuene, type and duration on a loop every so many miliseconds  specified by period
function playSound(duration, frequency, detune, type, period)
{	
	intervalID.push(setInterval(function(){createSound(duration, frequency, detune,type)}, period))
}