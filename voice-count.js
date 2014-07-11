
hotjs = hotjs || {};
hotjs.voice = hotjs.voice || {};

(function(){
	
var fx = {
        'click' : 'audio/button_click.mp3',
        'bad' : 'audio/bad_move.mp3',
        'logo' : 'audio/logo.mp3',
        'happymood' : 'audio/happymood.mp3'
};

function initFX( who ) {
	if(who == null) who = 'robot';
	
	var voices = ['0','1','2','3','4','5','6','7','8','9','10','100','1000','10000',
	          '0-','1-','2-','3-','4-','5-','6-','7-','8-','9-','10-','100-','1000-','10000-',
	          'ready','start','stop','pause','continue','excellent','amazing','addoil'
	          ];
	
	var files = [];
	for(var i=0; i<voices.length; i++) {
		var url = 'audio/' + who + '/' + voices[i] + '.mp3';
		fx[ voices[i] ] = url;
	}
	
	var f = []; for ( var k in fx ) f.push( fx[k] );
	resources.preloadFX( f );	
}

function voiceCount( count ) {
	var num = count;
	var numbers = [];
	do {
		numbers.push( num % 10 );
		num = Math.floor( num / 10 );
	} while (num > 0);

    var i = 0;
	while(numbers.length > 0) {
		var n = numbers.pop();
		if(numbers.length == 0) {
			if((n == 0) && (count>0)) continue; // X0 ...
		} else if(numbers.length == 1) {
			if((n == 0) && (count%100 == 0)) continue;  // X00 ...
			if((n > 0) && (n < 10)) {
				if((count % 10 > 0) && (count>20) && (count<100)) {
					// 21~99, no ten
				} else {
					numbers.push(10); 
				}
			}
			if(n == 1) continue; // 1X
		} else if( numbers.length == 2) {
			if(n < 10) numbers.push(100); // Xnn
		}
		
		n += (numbers.length>0) ? '-' : '';
        window.setTimeout(function( key ) {
            resources.playAudio( fx[ key ], true );
        }, i * 200, n );
        i ++;
	}
}

function stopAllAudio() {
	for ( var k in music ) {
		resources.stopAudio( music[k] );
	}
	for ( var k in fx ) {
		resources.stopAudio( fx[k] );
	}
}

function say( what ) {
    resources.playAudio( fx[ what ], true );
}

hotjs.voice.init = initFX;
hotjs.voice.countNumber = voiceCount;
hotjs.voice.stopAllAudio = stopAllAudio;
hotjs.voice.say = say;

})();

