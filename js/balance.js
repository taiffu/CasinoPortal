	$(document).ready(function () {
		if (!localStorage.getItem('keystore')) {
			$('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="' + window.location.origin + window.location.search + '">Platform</a>');
		} else {
			var openkey = localStorage.getItem("openkey");
			var clipboard = new Clipboard('#myado');
			$("#myado").html(localStorage.getItem("openkey"));
			$("#sendValue").click(function (e) {
				e.preventDefault();
				sendMoney();
			});
			$.get("https://platform.dao.casino/api/?a=faucet&to=" + openkey);
			$.ajax({
				url: urlInfura,
				type: "POST",
				async: false,
				dataType: 'json',
				data: JSON.stringify({
					"jsonrpc": '2.0',
					"method": "eth_call",
					"params": [{
						"to": addressReferral,
						"data": "0x5865c60c" + pad(openkey.substr(2), 64),
					}, "latest"],
					"id": 1
				}),
				success: function (d) {
					//console.log(d.result, openkey, addressReferral)
					if (d.result.substr(-5) == 00000) {
						$('#bg_popup.faucet').show();
						animateTimer(60);
						console.log("___send_adviser_And_Operator__")
						sendRefAndOperator();
					} else {
						getTxList(10);
						$('#bg_popup.faucet').hide()
					}
				}
			})
		}
	});

	function animateTimer(second) {
		var time = second;
		var t = setInterval(function () {
			$("#timer").html(time + " second");
			time--;
			if (time < 0) {
				clearInterval(t);
				$('#bg_popup').hide();
			}
		}, 1000)
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
		$.get("http://ropsten.etherscan.io/api?module=account&action=txlist&address=" + openkey + "&startblock=0&endblock=latest&", function (d) {
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
								'<td>send ' + (r.value) / k + ' ETH to:  <a href="http://ropsten.etherscan.io/address/' + r.to + '" target="_blank"> ' + r.to.substr(0, 24) + '...</td>' +
								'<td><a  href="http://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
								'</tr>'
							].join(''));
						} else {
							$("tbody").prepend(['<tr>' +
								'<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
								'<td>got ' + (r.value) / k + ' Eth from: <a href="http://ropsten.etherscan.io/address/' + r.from + '" target="_blank">' + r.from.substr(0, 24) + '...</td>' +
								'<td><a  href="http://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
								'</tr>'
							].join(''));
						}
						break;
					case '0x29eae053':
						$("tbody").prepend(['<tr>' +
							'<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
							'<td> select service </td>' +
							'<td><a  href="http://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
							'</tr>'
						].join(''));
						break;
				}
			}

		})
	}