$(document).ready(function () {

	if (!localStorage.getItem('keystore')) {
		$('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="https://platform.dao.casino">Platform</a>');
		return;
	}

	var clipboard = new Clipboard('#myado');
	$("#myado").html(player.openkey);

	if (!localStorage.getItem("isreg")) {
		localStorage.setItem("isreg", true);
		faucet(player.openkey);
		$('#bg_popup.faucet').show();
		var t = setInterval(function () {
			if (player.bet * player.eth) {
				$('#bg_popup.faucet').hide();
				clearInterval(t)
			}
		}, 1000)
	}
	getTxList(10);
})



$("#sendValue").click(function (e) {
	e.preventDefault();
	if ($("select#typeSend").val() == "eth") {
		sendEth();
	} else if ($("select#typeSend").val() == "bet") {
		sendBet();
	}
});

$("input#outetht").change(function () {

	// TODO  

	if (!/0x[0-9A-F]{40}/i.test($(this).val())) {
		return;
	}
})