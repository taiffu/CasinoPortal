var platform = {
    referralContract: "0xe195eed0e77b48146aa246dadf987d2504ac88cb",
    tokenContract: "0x95a48dca999c89e4e284930d9b9af973a7481287",
    addressOperator: "0x6506e2D72910050554D0C47500087c485DAA9689",
    node: "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl"
};

var player = {
    ks: lightwallet.keystore.deserialize(localStorage.getItem('keystore')),
    openkey: localStorage.getItem('openkey'),
    referrer: localStorage.getItem('referrer'),
    bet: 0,
    eth: 0
}

var ks = player.ks;

//________________________________________________

function callERC20(callname, adr, callback) {
    switch (callname) {
        case "balanceOf":
            callData = "0x70a08231";
            break;
    }
    $.ajax({
        type: "POST",
        url: platform.node,
        dataType: 'json',
        async: true,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "to": platform.tokenContract,
                "data": callData + pad(adr.substr(2), 64)
            }, "latest"]
        }),
        success: function (d) {
            callback(hexToNum(d.result) / 10 ** 8)
        }
    });
};

function getBalance(address, callback) {
    $.ajax({
        type: "POST",
        url: platform.node,
        dataType: 'json',
        async: true,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": 'eth_getBalance',
            "params": [address, "latest"]
        }),
        success: function (d) {
            callback(d.result / 10 ** 18);
        }
    });
};

function call(callname, address, callback) {
    var callData;
    switch (callname) {
        case "getTotalRollMade":
            callData = "0xdf257ba3";
            break;
    }
    $.ajax({
        type: "POST",
        url: platform.node,
        dataType: 'json',
        async: true,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "to": address,
                "data": callData + pad(numToHex(address.substr(2)), 64),
            }, "latest"]
        }),
        success: function (d) {
            callback(hexToNum(d.result))
        }
    });
};

function getNonce() {
    var nonce;
    $.ajax({
        type: "POST",
        url: platform.node,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_getTransactionCount",
            "params": [player.openkey, "latest"]
        }),
        success: function (d) {
            nonce = d.result;
        }
    })
    return nonce;
}

function sendEth() {
    var options = {};
    options.nonce = getNonce();
    options.to = $("#outetht").val();
    options.gasPrice = "0x737be7600";
    options.gasLimit = "0x927c0";
    options.value = parseFloat($("#amount").val()) * 10 ** 18;
    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        console.log(err);
        var registerTx = lightwallet.txutils.valueTx(options)
        var signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, player.openkey)
        $.ajax({
            type: "POST",
            url: platform.node,
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
                $("#Wresult").html('YOUR TRANSACTION: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + d.result + '">' + d.result + '</a>')
            }
        })
    })
}

function sendBet() {
    var amount = parseFloat($("#amount").val()) * 10 ** 8;
    var to = $("#outetht").val();
    var options = {};
    options.nonce = getNonce();
    options.to = platform.tokenContract;
    options.gasPrice = "0x737be7600"; //web3.toHex('31000000000');
    options.gasLimit = "0x927c0"; //web3.toHex('600000');
    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        console.log(err);
        var args = [to, amount];
        var registerTx = lightwallet.txutils.functionTx(erc20abi, 'transfer', args, options)
        var signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, player.openkey)
        console.log("lightWallet sign:", signedTx)
        $.ajax({
            type: "POST",
            url: platform.node,
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
                $("#Wresult").html('YOUR TRANSACTION: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + d.result + '">' + d.result + '</a>')
            }
        })
    })
}

//________________________________________________


function getTxList(count) {

    var timeOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    var k = 10 ** 18
    $.get("https://ropsten.etherscan.io/api?module=account&action=txlist&address=" + player.openkey + "&startblock=0&endblock=latest&", function (d) {
        for (var n = d.result.length - 1; n > Math.max(0, (d.result.length - count)); n--) {
            var r = d.result[n];
            if (r.isError != "0") {
                continue;
            }
            switch (r.input.substr(0, 10)) {
                case '0x095ea7b3':
                    $("tbody").append(['<tr>' +
                        '<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
                        '<td> approve </td>' +
                        '<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
                        '</tr>'
                    ].join(''));
                    break;
                case '0x29eae053':
                    $("tbody").append(['<tr>' +
                        '<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
                        '<td> select service </td>' +
                        '<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
                        '</tr>'
                    ].join(''));
                    break;
                case '0x34a4f35a':
                    $("tbody").append(['<tr>' +
                        '<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
                        '<td> open channel </td>' +
                        '<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
                        '</tr>'
                    ].join(''));
                    break;
                case '0x2e6eafa6':
                    $("tbody").append(['<tr>' +
                        '<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
                        '<td> close channel </td>' +
                        '<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
                        '</tr>'
                    ].join(''));
                    break;
                case '0x':
                    if (r.from == player.openkey) {
                        $("tbody").append(['<tr>' +
                            '<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
                            '<td>send ' + (r.value) / k + ' ETH to:  <a href="https://ropsten.etherscan.io/address/' + r.to + '" target="_blank"> ' + r.to.substr(0, 24) + '...</td>' +
                            '<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
                            '</tr>'
                        ].join(''));
                    } else {
                        $("tbody").append(['<tr>' +
                            '<td>' + new Date(parseFloat(r.timeStamp) * 1000).toLocaleString("en-US", timeOptions) + '</td>' +
                            '<td>got ' + (r.value) / k + ' Eth from: <a href="https://ropsten.etherscan.io/address/' + r.from + '" target="_blank">' + r.from.substr(0, 24) + '...</td>' +
                            '<td><a  href="https://ropsten.etherscan.io/tx/' + r.hash + '" target="_blank">' + r.hash.substr(0, 32) + '... </td>' +
                            '</tr>'
                        ].join(''));
                    }
                    break;
            }
        }

    })
}

function faucet(address) {
    $.ajax({
        url: "https://platform.dao.casino/faucet?to=" + address,
        success: function (result) {
            console.log("bet: ", result[0].result, " eth: ", result[1].result)
        },
        error: function () {
            console.log("faucet error")
        },
    });
}

function getStatistics(address) {
    callERC20("balanceOf", address, function (result) {
        console.log(result);
        $('#bankroll').html(result.toFixed(3) + " BET");
    })
    call("getTotalRollMade", address, function (result) {
        $("#total").html(result);
    })
};

function sendRefAndOperator(callback) {
    var referal = localStorage.ref;
    var options = {};
    options.nonce = getNonce();
    options.to = platform.referralContract;
    options.gasPrice = "0x9502F9000";
    options.gasLimit = "0x927c0";

    ks.keyFromPassword("1234", function (err, pwDerivedKey) {
        if (err) {
            console.log("ERROR_TRANSACTION:", err);
            return false;
        }
        var args = [operator, referal];

        var registerTx = lightwallet.txutils.functionTx(ref_abi, "setService", args, options);
        var params = "0x" + lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, player.openkey);
        arParams = [params];
        $.ajax({
            url: platform.node,
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
    });
}

//_____________________Utils_____________________

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
};

function numToHex(num) {
    return num.toString(16);
};

function hexToNum(str) {
    return parseInt(str, 16);
};

//________________________________________________

setInterval(function () {
    if (!localStorage.getItem("isreg")) {
        return;
    }
    getBalance(player.openkey, function (balance) {
        player.eth = balance;
        $("#balETH").html(balance.toFixed(3) + " ETH");
    })
    callERC20('balanceOf', player.openkey, function (balance) {
        player.bet = balance;
        $("#balance , #balBET").html(balance + " BET");
    })
}, 2000)

//_________________ABI____________________________

var erc20abi = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
    }, {
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transferFrom",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
        "name": "",
        "type": "uint8"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "standard",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
    }, {
        "name": "_value",
        "type": "uint256"
    }, {
        "name": "_extraData",
        "type": "bytes"
    }],
    "name": "approveAndCall",
    "outputs": [{
        "name": "success",
        "type": "bool"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }, {
        "name": "",
        "type": "address"
    }],
    "name": "allowance",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "inputs": [],
    "payable": false,
    "type": "constructor"
}, {
    "payable": false,
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "from",
        "type": "address"
    }, {
        "indexed": true,
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "value",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}]

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