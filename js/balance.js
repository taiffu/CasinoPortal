$(document).ready(function () {



	if (!localStorage.getItem('keystore')) {
		$('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="https://platform.dao.casino">Platform</a>');
		return;
	}

	if (localStorage.getItem('secretSeed')) {
		$("#words").show();
	}

	var clipboard = new Clipboard('#myado');
	$("#myado").html(player.openkey);

	getTxList(10);

	if (!localStorage.getItem("isreg")) {
		localStorage.setItem("isreg", 1);
		faucet(player.openkey);
		$('#bg_popup.faucet').show();
		var i = 0;
		var t = setInterval(function () {
			i++;
			if (i >= 80) {
			};
			if (player.bet * player.eth) {
				$('#bg_popup.faucet').hide();
				sendRefAndOperator();
				clearInterval(t);
				return;
			}
		}, 500)
	}

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

function words() {
	$('#secret').show().html(localStorage.getItem('secretSeed'))
	$('#btnWords').html('I SAVE');
	$("#btnWords").attr("onclick", "iSave()");

}

function iSave() {
	localStorage.removeItem('secretSeed');
	$('#words').remove();
}