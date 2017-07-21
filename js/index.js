$(document).ready(function () {
	getStatistics("0xb49f173fec783bc3e538cfd322fb8b1d515c229c");
	if (!localStorage.getItem("keystore")) {
		localStorage.setItem("secretSeed", lightwallet.keystore.generateRandomSeed())
		wallet_open(localStorage.getItem("secretSeed"));
		$.get("https://platform.dao.casino/api/?a=faucet&to=" + localStorage.getItem("openkey"));
	}

	/* POPUP */

	$('.open-register').click(function () {
		window.location = "balance.html";
		// $('.window-open-registr').slideDown();
		// $('#popup-open-text-before').slideDown();
		// $('.window-seed').slideUp();
		// $('.popup-button').slideUp();
		// $('#popup-open-text-after').slideUp();
	});

	$('.dialog-window-cancel').click(function () {
		$('.popup-button').slideDown();
		$('.window-open-registr').slideDown();
		$('#popup-open-text-after').slideDown();
		$('.window-seed').slideDown();
		$('#popup-open-text-before').slideUp();
		$('.window-open-registr').slideUp();
	});

	$('.open-dialog-window').click(function () {
		$('.dialog-content').slideUp();
		$('.popup-button').slideUp();
		$('.dialog-window-two').slideDown();
	});

	$('.dialog-window-cancel-two').click(function () {
		$('.dialog-window-two').slideUp();
		$('.popup-button').slideDown();
	});

	/* AND POPUP */

	$('.toggle-bg input').click(function () {
		if ($('input#checked-on:checked')) {
			$('.free-money').toggleClass('free-money__enable');
			$('.real-money').toggleClass('free-money__disabled');
		}
	});

	$('.open-menu').click(function () {
		$('.mobile-menu').toggleClass('open-mobile-menu');
		$('.mobile-menu-overlay').toggleClass('open-menu-overlay');
	});

	$('.mobile-menu-overlay, .closed-mnu').click(function () {
		$('.mobile-menu').removeClass('open-mobile-menu');
		$('.mobile-menu-overlay').removeClass('open-menu-overlay');
	});

	$(".cat-menu").click(function () {
		$(this).next().slideToggle();
	});

	// Popup window

	$('.popup-with-move-anim').magnificPopup({
		type: 'inline',

		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: true,
		preloader: false,

		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});

});

if (localStorage.getItem("isreg")) {
	$("#isreg").show();
	$("#regbut").hide();
} else {
	$("#isreg").hide();
	$("#regbut").css("visibility", "visible");

}


function wallet_open(secretSeed) {
	var password = "1234";
	lightwallet.keystore.createVault({
		password: password,
		seedPhrase: secretSeed, // Optionally provide a 12-word seed phrase
	}, function (err, ks) {
		ks.keyFromPassword(password, function (err, pwDerivedKey) {
			if (err) throw err;
			ks.generateNewAddress(pwDerivedKey, 1);
			localStorage.setItem("keystore", ks.serialize());
			localStorage.setItem("openkey", "0x" + ks.getAddresses()[0]);
		});
	});
}


$(".toggle-bg").click(function () {

	localStorage.setItem("mainnet", $("input[name=toggle]:checked").val());
	mainnet = localStorage.getItem('mainnet');
	if (!localStorage.getItem("mainnet")) {
		localStorage.setItem("mainnet", "off");
	}
	rebalance();
});

if (localStorage.getItem("mainnet") == "on") {
	$(".free-money").addClass("free-money__enable");
	$(".real-money").addClass("free-money__disabled");
	$("#checked-on").click();
	localStorage.setItem("mainnet", "on");
} 