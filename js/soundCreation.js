
var intervalID = [];//create storage for the interval ID values so the tones and mouth animations can be stopped
var context = new AudioContext();
var masterVolume = context.createGain();
masterVolume.gain.value = 0.5;//set volume of the beats
masterVolume.connect(context.destination);//link the volume setting to the AudioContext
//var rap= ""
var isTTSgoing = false; //used by the startTTS function, and checked by the playSound function to see if there is a current TTS session going, so that the beat doesnt stop between words
var rapPhrases = ["yo",
"give it to me",
"gimme some",
"thats what",
"heya",
"what",
"lets go",
"thats it",
"holla",
"sup",
 "player",
 "homeslice",
 "homeslizzle" ]; //list of rap words that will be used when generating the rap string


/**
Creates a rap with length number of random dictionary words 
as well as length number of rapPhrases, so the total length of
the rap will be length*2 number of phrases
this function accesses the rapPhrases array and the dist.js file to grab words to create the rap.
returns an array of length = length*2 that contains string values of random words and rap phrases from rapPhrases array.
*/
function createRap(length)
{
	var j=0
	var rap = [];
    var rapString = ""
    //First create a string of rap phrases and rando Words
	while(j<length)
	{
		rand = Math.floor((Math.random()*109560)+1);//there are lots of words in the dict array in the dist.js file
        rapPhrase = rapPhrases[Math.floor((Math.random()*rapPhrases.length))]       
        rapWord = dict[rand].word
        rap.push(rapWord)
        rap.push(rapPhrase)
		j = j+1
	}
	return rap
}

/*
 Creates a tone with a specified duration in milliseconds,
 a frequency in hertz,
 a detune value
 and a integer value for the wavetype from 1-4 (sine, square, sawtooth, triangle)
*/
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

/*
Recursive function that works its way through the rapArray of of string words and plays them one after another, as well the function
handles the updating of the rap display <p> (id=display) that shows the current word being spoke and the one before and after it.
*/
function startTTS(rapArray, voice, speed, recurseCounter)
{
    isTTSgoing = true //Speech has started and the beat shouldnt stop
    if(recurseCounter < rapArray.length)//there is more words to say
    {
        var disp = document.getElementById("display")
        if(recurseCounter == 0)//On the first word, Cant display the previous word cause there isnt one
        {
            disp.innerHTML=" <br/><b>"+rapArray[recurseCounter]+"</b><br/>"+rapArray[recurseCounter+1]
        }
        else
        {
            disp.innerHTML = rapArray[recurseCounter-1]+"<br/><b>"+rapArray[recurseCounter]+"</b><br/>"+rapArray[recurseCounter+1]
        }
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

/*
creates a rap array, begins TTS playback with a the specified voice and speed, starts the beat and starts the mouth animations

*/
function startRap(voice, speed)
{
    stopRap(intervalID)//stop any currently running raps
    rap  = createRap(1000);
    startTTS(rap, voice, speed, 0)
    
    //create the beat
    playSound(500, 65, 0, 4, 1000)
    playSound(100, 100, 0,4, 400)
   
    animateMouth()        	
};

/*
clears the interval sessions that are running the mouth animations and the beats,
 as well as sets isTTSgoing to false, stopping the voice and clearing the rap display on the page
*/
function stopRap(intervalArray) {
	{
		for (i = 0; i < intervalArray.length; i++) { 
			clearInterval(intervalArray[i])
		}
		responsiveVoice.cancel();
		isTTSgoing = false;
		intervalArray = [];
        var disp = document.getElementById("display")
        disp.innerHTML = "";
	}
};

/*
plays a sound with a specified duration and period in milliseconds, as well as specified frequency, detune and type in the same
format as createSound.
the period specified should be >= to the duration, as the period specifes how often the tone is played, and if the duration of the tune is longer,
there will be an overlap
*/
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

/*This function accesses the mouth image on the on the page and moves it down 18px, and back up after a specified closeTime in milliseconds essentially animating the mouth*/
function openThenCloseMouth(closeTime)
{
   var element = document.getElementById("mouth");
   element.style.top = 'calc(50% + 18px)';
   window.setTimeout(function(){element.style.top = '50%'}, closeTime)
   
} 

/*
Animates the mouth by setting it on an interval of 400 milliseconds, within that 400 millisecond time window the mouth opening and closing sequence
is slightly randomized, having the mouth open at the start of the 400 milliseconds and closing somewhere between 300 and 400 milliseconds, 
the randomness of the closing makes the animation look a little more real when played together with the TTS and the beat.
*/
function animateMouth()
{

    intervalID.push(setInterval(function(){
        closeTime = Math.floor((Math.random()*200)+1)+100 //rand number between 300 and 400
       
        if(isTTSgoing == true)
        {
        openThenCloseMouth(closeTime)
        }
        else
        {
            stopRap(intervalID)
        }
    }, 400))

}

//helper function used in onPressStartOrStop to start the rap
function clickStart()
{
	startRap("UK English Male", 0.9)
}

/*
Function called when the user clicks on the image of the rapper, 
it will start a new rap if there isnt one currently playing or
 stop the current rap if it is playing
*/
function onPressStartOrStop()
{
	if(isTTSgoing == true)
        {
        stopRap(intervalID);
        
        }
        else
        {
        clickStart();
        }
}

/*Unused function regarding the Hypenation which never panned out
My original Idea was to set the mouth animations on a loop that would open and close on sylable/ word breaks, so that it would look realistic,
unfortuantly I could not figure out a way to run any code in between sylables, 
I tried an array of the sylables similar to how the rap reader is structured now, but the pronouciation of the words wasnt coming through when
broken into seperate calls to the responsive voice. 
I also played around a bit with the google TTS, that supposidly had support of a text to speech markdown language that would have allowed me to 
add flags into the reading itself to function calls, but it did not pan out, i couldnt get the markdown language to work, I feel like there is
not yet support for it, as the W3 specifications are pretty new. 
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/text 
note above there is suppose to be support for SSML, but i couldnt get it working
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/onmark
my plan was to use the function above, build an SSML document and add marks at the sylable start/stop points so I could animate the mouth on the marks
unfortunatly I could not get the SSML to work, maybe will have to try again some other time, there is very little information or support on
the subject.
//TAKES THE TEXT IN p.hyphenate and put hyphens between sylables
function hyp()
{
    $('p.hyphenate').hyphenate('en-us');
    var hypString = document.getElementById("hyp").innerHTML
    console.log(hypString)
    var result = hypString.replace(/[\u00AD\u002D\u2011]+/g,'-');
    console.log(result)
}
*/

