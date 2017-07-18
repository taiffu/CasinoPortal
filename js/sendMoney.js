if(localStorage.getItem('keystore') != null){
var ks = lightwallet.keystore.deserialize(localStorage.getItem('keystore'));
}

function sendMoney() {
    if ($("select#typeSend").val() == "eth") {
        sendEth();
    } else if ($("select#typeSend").val() == "bet") {
        sendBet();
    }
}

function getNonce() {
    var nonce;
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_getTransactionCount",
            "params": [openkey, "latest"]
        }),
        success: function (d) {
            nonce = d.result;
        }
    })
    return nonce;
}

function sendEth() {

    var amount = parseFloat($("#amount").val()) * 1000000000000000000;
    var to = $("#outetht").val();
    var options = {};
    options.nonce = getNonce();
    options.to = to;
    options.gasPrice = "0x737be7600";
    options.gasLimit = "0x927c0";
    options.value = amount;
    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        console.log(err);
        var registerTx = lightwallet.txutils.valueTx(options)
        var signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, openkey)
        console.log("lightWallet sign:", signedTx)
        $.ajax({
            type: "POST",
            url: urlInfura,
            dataType: 'json',
            async: false,
            data: JSON.stringify({
                "id": 0,
                "jsonrpc": '2.0',
                "method": "eth_sendRawTransaction",
                "params": ["0x" + signedTx]
            }),
            success: function (d) {
                console.log("The transaction was signed:", d.result);
                 $("#Wresult").html('YOUR TRANSACTION: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + d.result + '">'+d.result+'</a>')
            }
        })
    })
}

function sendBet() {
    var amount = parseFloat($("#amount").val()) * 100000000;
    var to = $("#outetht").val();
    var options = {};
    options.nonce = getNonce();
    options.to = erc20address;
    options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
    options.gasLimit = "0x927c0"; //web3.toHex('600000');
    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        console.log(err);
        var args = [to, amount];
        var registerTx = lightwallet.txutils.functionTx(erc20abi, 'transfer', args, options)
        var signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, openkey)
        console.log("lightWallet sign:", signedTx)
        $.ajax({
            type: "POST",
            url: urlInfura,
            dataType: 'json',
            async: false,
            data: JSON.stringify({
                "id": 0,
                "jsonrpc": '2.0',
                "method": "eth_sendRawTransaction",
                "params": ["0x" + signedTx]
            }),
            success: function (d) {
                console.log("The transaction was signed:", d.result);
                $("#Wresult").html('YOUR TRANSACTION: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + d.result + '">'+d.result+'</a>')
            }
        })
    })
}