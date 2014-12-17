
hotjs = hotjs || {};

(function(){
        var ad_units = {
            ios : {
                banner: 'ca-app-pub-6869992474017983/9801473155',
                interstitial: 'ca-app-pub-6869992474017983/7563979554'
            },
            android : {
                banner: 'ca-app-pub-6869992474017983/3754939559',
                interstitial: 'ca-app-pub-6869992474017983/1657046752'
            }
        };
        var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;
	function initAd( options ) {
		if(AdMob) {
			AdMob.createBanner({
				adId: admobid.banner,
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

