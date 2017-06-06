	$(document).ready(function () {
	    if (!localStorage.getItem('keystore')) {
	        $('#bg_popup.reg').show().find('h1').html('Please, sign in on the <a href="' + window.location.origin + window.location.search + '">Platform</a>');
	    } else {
            $('#bg_popup.faucet').show()
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
	                console.log(d.result, openkey, addressReferral)
	                if (d.result.substr(-5) == 00000) {
	                    console.log("___send_adviser_And_Operator__")
	                    sendRefAndOperator();
	                } else {
	                    $('#bg_popup').hide();
	                }
	            }
	        })
	    }
	});