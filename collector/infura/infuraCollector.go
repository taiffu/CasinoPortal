package main

import (
	"fmt"

	infura "github.com/INFURA/go-libs/jsonrpc_client"
)

func main() {

	infuraClient := infura.EthereumClient{URL: "https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl"}
	fmt.Println(infuraClient)

}

func request() {
	//  req:=.infura.JSONRPCRequest{
	// 	 JSONRPC:"jsonrpc:2.0",

	//  };
}
