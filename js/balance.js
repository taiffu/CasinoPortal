	$(document).ready(function () {
		if (!localStorage.getItem('keystore')) {
			$('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="' + window.location.origin + window.location.search + '">Platform</a>');
		} else {
			getTxList(10);
			console.log("!!!!!!!!!!!!!!")
			//$('#bg_popup.faucet').show()
			animateTimer(60);
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
						console.log("___send_adviser_And_Operator__")
						sendRefAndOperator();
					} else {
						setTimeout(function(){$('#bg_popup.faucet').hide()},20000);
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
			console.log("exit")
			clearInterval(t);
			 $('#bg_popup').hide();
		}
		}, 1000)
	}

	function getTxList(count){
		$.get("http://ropsten.etherscan.io/api?module=account&action=txlist&address=" + openkey + "&startblock=0&endblock=latest&", function (d){
			for(var n = 0; n < Math.min(d.result.length,count); n++){
				var r = d.result[n];
				    $("tbody").prepend([
						'<tr>'
						+'<td><a target="_blank" href="https://ropsten.etherscan.io/tx/'+r.hash+'">'+r.hash.substr(0,16)+'</a></td>'
						+'<td><a target="_blank" href="https://ropsten.etherscan.io/address/'+r.from+'">'+r.from.substr(0,16)+'</a></td>'
						+'<td><a target="_blank" href="https://ropsten.etherscan.io/address/'+r.to+'">'+r.to.substr(0,16)+'</a></td>'
						+'<td>'+(r.value)/1000000000000000000+' ETH</td>'
  						].join(''));
				console.log(d.result[n])
			}
		})
	}

	