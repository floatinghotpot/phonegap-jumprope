
hotjs = hotjs || {};

(function(){
	var ad_units = {};
	if( /(android)/i.test(navigator.userAgent) ) {
		ad_units = {
			banner: 'ca-app-pub-6869992474017983/9375997553',
			interstitial: 'ca-app-pub-6869992474017983/1657046752'
		};
	} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
		ad_units = {
			banner: 'ca-app-pub-6869992474017983/4806197152',
			interstitial: 'ca-app-pub-6869992474017983/7563979554'
		};
	} else {
		ad_units = {
			banner: 'ca-app-pub-6869992474017983/8878394753',
			interstitial: 'ca-app-pub-6869992474017983/1355127956'
		};
	}
        
	function initAd( options ) {
		if(AdMob) {
			AdMob.createBanner({
				adId: ad_units.banner,
				position:AdMob.AD_POSITION.BOTTOM_CENTER,
				autoShow:true
			});
		}
	}

	function showAd( show ) {
		if(AdMob) {
			if(show) {
				AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
			} else {
				AdMob.hideBanner();
			}
		}
	}
	
	hotjs.Ad = {
		init : initAd,
		show : showAd
	};
	
})();

