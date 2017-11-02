var ref_abi = [{
    "constant": true,
    "inputs": [{
        "name": "_player",
        "type": "address"
    }],
    "name": "getAdviser",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_operator",
        "type": "address"
    }, {
        "name": "_adviser",
        "type": "address"
    }],
    "name": "setService",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "adviserOf",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "_player",
        "type": "address"
    }],
    "name": "getOperator",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "operatorOf",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}]
var addressReferral = "0xe195eed0e77b48146aa246dadf987d2504ac88cb";
var operator = "0x9872C6B67335f8704f3FD9A0B1ab1c550233DFD0"

function sendRefAndOperator(callback) {
    var ks = lightwallet.keystore.deserialize(localStorage.getItem('keystore'));
    var openkey = localStorage.getItem('openkey')
    var referal = localStorage.ref;
    var options = {};
    options.to = addressReferral;
    options.gasPrice = "0x9502F9000";
    options.gasLimit = "0x927c0";

    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        if (err) {
            console.log("ERROR_TRANSACTION:", err);
            return false;
        }
        var args = [operator, referal];
        $.ajax({
            url: urlInfura,
            type: "POST",
            async: false,
            dataType: 'json',
            data: JSON.stringify({
                "jsonrpc": '2.0',
                "method": "eth_getTransactionCount",
                "params": [openkey, "latest"],
                "id": 1
            }),
            success: function (d) {
                options.nonce = d.result;
                var registerTx = lightwallet.txutils.functionTx(ref_abi, "setService", args, options);
                var params = "0x" + lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, openkey);
                arParams = [params];
                $.ajax({
                    url: urlInfura,
                    type: "POST",
                    async: false,
                    dataType: 'json',
                    data: JSON.stringify({
                        "jsonrpc": '2.0',
                        "method": "eth_sendRawTransaction",
                        "params": arParams,
                        "id": 1
                    }),
                    success: function (r) {
                        callback(r.result);
                    }
                })
            }
        })
    });
}
