$(document).ready(function () {
	if (!localStorage.getItem('keystore')) {
		$('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="https://platform.dao.casino">Platform</a>');
		return
	}
	var openkey = localStorage.getItem("openkey");
	var clipboard = new Clipboard('#myado');
	$("#myado").html(localStorage.getItem("openkey"));
	$("#sendValue").click(function (e) {
		e.preventDefault();
		sendMoney();
	});
	console.log("BALANCE ETH:", checkBalance())

	if (checkBalance() < 5) {
		console.log("<5")
		faucet();
	}

	if (checkBalance() != 0 || callERC20('balanceOf', openkey) != 0) {
		getTxList(10);
		return;
	}
	checkstatus()
	$('#bg_popup.faucet').show();
	animateTimer(60);

	function checkstatus() {
		if (checkBalance() == 0) {
			console.log("ETH = 0 ")
			setTimeout(checkstatus, 5000);
			return;
		}
		$('#eth_status').html('ETH SUCCESS!')
		if (callERC20('balanceOf', openkey) == 0) {
			console.log("BET = 0 ")
			setTimeout(checkstatus, 5000);
			return;
		}
		console.log("success!")
		$('#bet_status').html('BET SUCCESS!')
		$('#bg_popup.faucet').hide();
		sendRefAndOperator(function(d){
			console.log('refTx: ', d)
		})
		return;
	}

})


function faucet() {
	$.ajax({
		url: "https://platform.dao.casino/faucet?to=" + openkey,
		success: function (result) {
			console.log("bet: ", result[0].result, " eth: ", result[1].result)
		},
		error: function () {
			console.log("faucet error")
		},
	});

}

function animateTimer(second) {
	var time = second;
	var t = setInterval(function () {
		$("#timer").html(time + " second");
		time--;
		if (time < 0) {
			if (checkBalance() == 0 || callERC20('balanceOf', openkey) == 0) {
				window.location.reload();
			}
			clearInterval(t);
			$('#bg_popup').hide();
		}
	}, 1000)
}

function checkBalance() {
	var result;
	$.ajax({
		type: "POST",
		url: urlInfura,
		dataType: 'json',
		async: false,
		data: JSON.stringify({
			"id": 0,
			"jsonrpc": '2.0',
			"method": "eth_getBalance",
			"params": [openkey, "latest"]
		}),
		success: function (d) {
			result = hexToNum(d.result) / (10 ** 18)

		}
	})
	return result;
}

function getTxList(count) {

	var timeOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};

	var k = 1000000000000000000
	$.get("https://ropsten.etherscan.io/api?module=account&action=txlist&address=" + openkey + "&startblock=0&endblock=latest&", function (d) {
		for (var n = 0; n < Math.min(d.result.length, count); n++) {
			var r = d.result[n];
			if (r.isError != "0") {
				continue;
			}
			switch (r.input.substr(0, 10)) {
				case '0x':
					if (r.from == openkey) {
						$("tbody").prepend(['<tr>' +
							'<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
							'<td>send ' + (r.value) / k + ' ETH to:  <a href="https://ropsten.etherscan.io/address/' + r.to + '" target="_blank"> ' + r.to.substr(0, 24) + '...</td>' +
							'<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
							'</tr>'
						].join(''));
					} else {
						$("tbody").prepend(['<tr>' +
							'<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
							'<td>got ' + (r.value) / k + ' Eth from: <a href="https://ropsten.etherscan.io/address/' + r.from + '" target="_blank">' + r.from.substr(0, 24) + '...</td>' +
							'<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
							'</tr>'
						].join(''));
					}
					break;
				case '0x29eae053':
					$("tbody").prepend(['<tr>' +
						'<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
						'<td> select service </td>' +
						'<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
						'</tr>'
					].join(''));
					break;
			}
		}

	})
}