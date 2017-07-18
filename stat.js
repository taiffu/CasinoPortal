var result;
var address = "0xb49f173fec783bc3e538cfd322fb8b1d515c229c";

function getContractBalance(addressContract) {
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": 'eth_getBalance',
            "params": [addressContract, "latest"]
        }),
        success: function (d) {
            result = (d.result / 1000000000000000000).toFixed(5);
        }
    });
    return result;
};

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

function toFixed(value, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(value * precision) / precision;
};

function call(callname, address) {
    var result;
    var callData;
    switch (callname) {
        case "totalRollsByUser":
            callData = "0x9288cebc";
            break;
        case "getShowRnd":
            callData = "0xdb571498";
            break;
        case "getTotalRollMade":
            callData = "0xdf257ba3";
            break;
        case "getTotalEthSended":
            callData = "0x46f76648";
            break;
        case "getTotalEthPaid":
            callData = "0xf6353590";
            break;
        case "getStateByAddress":
            callData = "0x08199931"
            break;
    }
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "from": openkey,
                "to": address,
                "data": callData + pad(numToHex(address.substr(2)), 64),
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
};

function numToHex(num) {
    return num.toString(16);
};

function hexToNum(str) {
    return parseInt(str, 16);
};

function total() {
    $.ajax({
        type: "POST",
        url: urlInfura,
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "id": 0,
            "jsonrpc": '2.0',
            "method": "eth_call",
            "params": [{
                "from": openkey,
                "to": address,
                "data": "0xdf257ba3"
            }, "latest"]
        }),
        success: function (d) {
            result = hexToNum(d.result);
        }
    });
    return result;
}

function getStatistics(game, network) {
    var bankroll = callERC20("balanceOf", address)
    $('#bankroll').html(bankroll.toFixed(3) + " BET");
    $("#total").html(total());
};
getStatistics("Dice", "testnet");