
var intervalID = [];//create storage for the interval ID values so the tones can be stopped
var context = new AudioContext();
var masterVolume = context.createGain();
masterVolume.gain.value = 0.2;
masterVolume.connect(context.destination);//link the volume setting to the AudioContext
var rap= ""
var isTTSgoing = false; //used by the startTTS function, and checked by the playSound function to see if there is a current TTS session going, so that the beat doesnt stop between words


//creates a safe and censored version of the rap that is displayed on the page
function censorship()
{
    var censoredRap = rap.replace(/\./g,"")
    document.getElementById("displayRap").innerHTML = censoredRap
}

//returns a string rap, which consists of random words from the dictionary between raplike phrases
function createRap(length)
{
	var rapwords = ["yo","give it to me","gimme some","thats what","heya","what","lets go","thats it","holla","sup", "player", "homeslice", "homeslizzle" ];
	var j=0
	var rap = [];
    var rapString = ""
    //First create a string of rap phrases and rando Words
	while(j<length)
	{
		rand = Math.floor((Math.random()*109560)+1);//there are lots of words in the dict array in the dist.js file
        rapPhrase = rapwords[Math.floor((Math.random()*rapwords.length))]       
        rapWord = dict[rand].word
        rap.push(rapWord)
        rap.push(rapPhrase)
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

function startTTS(rapArray, voice, speed, recurseCounter)
{
    isTTSgoing = true //Speech has started and the beat shouldnt stop
    if(recurseCounter < rapArray.length)//there is more words to say
    {
        var disp = document.getElementById("displayRap")
        disp.innerHTML = disp.innerHTML + rapArray[recurseCounter] + " "
        responsiveVoice.speak(rapArray[recurseCounter], voice, {rate: speed, onend: 
            function(){
                startTTS(rapArray, voice, speed, recurseCounter+1)          
            }
        });
    }
    else
    {
        isTTSgoing = false
    }
    //else there is nothing to say
}

//TTS reads the rap and plays the beat
function startRap(voice, speed) {
stopRap(intervalID)//stop any currently running raps
rap = createRap(10);
startTTS(rap, voice, speed, 0)
//censorship();
//responsiveVoice.speak(rap, voice, {rate: speed});
playSound(500, 65, 0, 4, 1000)
playSound(100, 100, 0,4, 400)
//playSound(100, 1000, 0,4, 2000)
animateMouth()
    	
};

//stop the beats
function stopRap(intervalArray) {
	{
		for (i = 0; i < intervalArray.length; i++) { 
			clearInterval(intervalArray[i])
		}
		responsiveVoice.cancel();
		intervalArray = [];
	}
};

//plays a tone with specificed freq, detuene, type and duration on a loop every so many miliseconds  specified by period
function playSound(duration, frequency, detune, type, period)
{	
	intervalID.push(setInterval(function(){
        if(isTTSgoing == true)
        {
        createSound(duration, frequency, detune,type)
        }
        else
        {
            stopRap(intervalID)
        }
    }, period))
}

function openThenCloseMouth(closeTime)
{
   var element = document.getElementById("mouth");
   console.log(element.style.top)
   element.style.top = 'calc(50% + 18px)';
   window.setTimeout(function(){element.style.top = '50%'}, closeTime)
   
} 
//randomizes the mouth movement by a certian degree run on the same interval block as the sound beats
function animateMouth()
{

    intervalID.push(setInterval(function(){
        closeTime = Math.floor((Math.random()*200)+1)+100 //rand number between 300 and 400
       
        if(isTTSgoing == true)
        {
        openThenCloseMouth(closeTime)//open and close the mouth at speed between 50 and 100
        }
        else
        {
            stopRap(intervalID)
        }
    }, 400))

}


