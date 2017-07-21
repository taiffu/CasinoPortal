$(document).ready(function () {

	if (!localStorage.getItem('keystore')) {
		$('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="https://platform.dao.casino">Platform</a>');
		return;
	}

	localStorage.setItem("isreg", 1);
	var clipboard = new Clipboard('#myado');
	$("#myado").html(player.openkey);


	getTxList(10);


	if (localStorage.getItem('secretSeed')) {
		$('#bg_popup.faucet').show();
		$("#words").show();
		faucet(player.openkey);
		var i = 0;
		var t = setInterval(function () {
			i++;
			if (i >= 80) {
				localStorage.removeItem("isreg");
				location.reload();
			};
			if (player.bet * player.eth) {
				$('#bg_popup.faucet').hide();
				sendRefAndOperator(function (result) {
					console.log("refTx: ", result)
				});
				clearInterval(t);
				return;
			}
		}, 500)
	}


})

$("#sendValue").click(function (e) {
	e.preventDefault();
	send();
});

function words() {
	$('#secret').show().html(localStorage.getItem('secretSeed'))
	$('#btnWords').html('I SAVE');
	$("#btnWords").attr("onclick", "iSave()");

}

function iSave() {
	localStorage.removeItem('secretSeed');
	$('#words').remove();
}