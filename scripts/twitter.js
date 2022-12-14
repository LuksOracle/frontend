//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

// METAMASK FUNCTIONS

//If Metamask is not detected the user will be told to install Metamask.
function detectMetamaskInstalled(){
  try{
     ethereum.isMetaMask
  }
  catch(missingMetamask) {
     alert("Metamask not detected in browser! Install Metamask browser extension, then refresh page!")
  }
}

//Alert user to connect their Metamask address to the site before doing any transactions.
function checkAddressMissingMetamask() {
  if(accounts.length == 0) {
    alert("No address from Metamask found. Click the top button to connect your Metamask account then try again without refreshing the page.")
  }
}

//Function called for getting Metamask accounts on LuksoL16. Used in every button in case the user forgets to click the top button.
function enableMetamaskOnLuksoL16() {
  //Get account details from Metamask wallet.
  getAccount();
  //Check if user is on the LuksoL16 testnet. If not, alert them to change to LuksoL16.
  if(window.ethereum.networkVersion != 2828){
    alert("You are not on the LuksoL16 Testnet! Please switch to LuksoL16 and refresh page.")
    console.log(window.ethereum.networkVersion)
  }
}

// TWITTER FUNCTIONS

function checkTwitterAddressOwner(twitter_ID) {
    //"readStateInTwitterIDAddress"
  contractDefined_JS.methods.twitterIDaddress(twitter_ID).call((err, balance_) => {
    console.log("balance", balance_)
    if(balance_ === undefined){
      document.getElementById("getValueStateSmartContract").value =  "Connect to L16 Testnet to read blockchain data."
    }
    else{
      if (balance_ != 0) {
        document.getElementById("getValueStateSmartContract").value = balance_
      }
      else {
        document.getElementById("getValueStateSmartContract").value = "No Twitter is associated to this account yet."
      }
    }
  })
}

//Get the latest value.
function checkVerifiedTwitter() {

  contractDefined_JS.methods.addressTwitterID(accounts[0]).call((err, balance) => {

    if(balance === undefined){
      document.getElementById("getValueStateSmartContract").value =  "Connect to L16 Testnet to read blockchain data."
    }
    else{
      if (balance != 0) {
        document.getElementById("getValueStateSmartContract").value = "https://twitter.com/i/user/" + balance
        getTwitterDetails(balance)
      }
      else {
        document.getElementById("getValueStateSmartContract").value = "There is no Twitter associated to this account yet."
      }
    }
  })}

//Empty array to be filled once Metamask is called. When the page is opened check for error handling issues.
let accounts = [];
detectMetamaskInstalled()

//Connect to Metamask.
const ethereumButton = document.querySelector('#enableEthereumButton');

ethereumButton.addEventListener('click', () => {
    detectMetamaskInstalled()
    enableMetamaskOnLuksoL16()
});

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  document.getElementById("enableEthereumButton").innerText = accounts[0].substr(0,5) + "..." +  accounts[0].substr(38,4)
  checkVerifiedTwitter()
}

function getTwitterDetails (twitter_id_) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'text';
  xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          res_ = JSON.parse(xhr.responseText)
          username_ = res_["result"]["data"][0]["username"]
          document.getElementById("twitterProfilePicture").value = '@'+username_
        }
        else {
          document.getElementById("twitterProfilePicture").value = 'Username could not be found from Twitter ID. Please refresh the page, or try again later'
        }

      }
  
  xhr.open("POST", 'https://bulurfq8jd.execute-api.us-west-2.amazonaws.com/default/frontend-requests', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
//  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

  post_json = {"data": {"twitter_id":twitter_id_}}
  xhr.send(JSON.stringify(post_json))
}



//Make Metamask the client side Web3 provider. Needed for tracking live events.
const web3 = new Web3(window.ethereum)

//Now build the contract with Web3.
const contractAddress_JS = '0xeBFC916C62B4dBcC29450D437136446fccfB658f'
//'0x5f1E6f5981B52EA3563f03c69d579AC2F55e7c7F' //'0x5b1a5a842eB0ac44C0bC831a1233d0ac3b321eA3'
const contractABI_JS = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[],"name":"tweetRequestEvent","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"bytes32","name":"compressedAddressUint96","type":"bytes32"}],"name":"fulfillTweetAddressCompare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"twitter_id_Request","type":"uint96"}],"name":"requestTweetAddressCompare","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"_twitter_id","type":"uint96"}],"name":"resolveToTwitterID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressTwitterID","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"","type":"uint96"}],"name":"twitterIDaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
//[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[],"name":"tweetRequestEvent","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"bytes32","name":"compressedAddressUint96","type":"bytes32"}],"name":"fulfillTweetAddressCompare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"twitter_id_Request","type":"uint96"}],"name":"requestTweetAddressCompare","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"_twitter_id","type":"uint96"}],"name":"resolveToTwitterID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressTwitterID","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"","type":"uint96"}],"name":"twitterIDaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
// [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"ChainlinkRequested","type":"event"},{"anonymous":false,"inputs":[],"name":"tweetRequestEvent","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressTwitterID","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_requestId","type":"bytes32"},{"internalType":"uint256","name":"_addressFromTweetMatches","type":"uint256"}],"name":"fulfillTweetAddressCompare","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"twitter_id_Request","type":"uint96"}],"name":"requestTweetAddressCompare","outputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint96","name":"_twitter_id","type":"uint96"}],"name":"resolveToTwitterID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tempRequestAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tempTwitter_id","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint96","name":"","type":"uint96"}],"name":"twitterIDaddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

const chainlinkInterfaceERC20_ADDRESS = '0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268'
const chainlinkInterfaceERC20_ABI =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const chainlinkInterfaceERC20_CONTRACT = new web3.eth.Contract(chainlinkInterfaceERC20_ABI, chainlinkInterfaceERC20_ADDRESS)


//TWITTER LINK BALANCE
chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
  if (!contractLINKbalanceResult){detectMetamaskInstalled(); enableMetamaskOnLuksoL16()}
  else if ((contractLINKbalanceResult/(10**18)) == 0){document.getElementById("getFaucetLinkBalanceEmpty").innerHTML = "The TNS contract is empty, please send LINK to 0xeBFC916C62B4dBcC29450D437136446fccfB658f"}
  else {document.getElementById("getFaucetLinkBalance").innerHTML = "Twitter LINK Balance: " + contractLINKbalanceResult/(10**18) + " LINK"}
});


// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeStateInContractEvent = document.querySelector('.changeStateInContractEvent');

changeStateInContractEvent.addEventListener('click', () => {

  checkAddressMissingMetamask()

  var twitter_ID = document.getElementById("setValueSmartContract").value.toString();

  chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
    if(contractLINKbalanceResult >= "1000000000000000000"){
      ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: accounts[0],
              to: contractAddress_JS,
              data: contractDefined_JS.methods.requestTweetAddressCompare(twitter_ID).encodeABI()
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }else{
      alert("Twitter Name Space contract needs 1 or more LINK to do a request! Send LINK to Twitter Name Space address on L16 here: " + contractAddress_JS)
    }
  });

});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const readStateInTwitterIDAddressEvent = document.querySelector('.readStateInTwitterIDAddressEvent');

readStateInTwitterIDAddressEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  var twitter_ID = document.getElementById("setValueSmartContract").value.toString();
  checkTwitterAddressOwner(twitter_ID);
  getTwitterDetails(twitter_ID)
});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeResolverInContractEvent = document.querySelector('.changeResolverInContractEvent');

changeResolverInContractEvent.addEventListener('click', () => {
  checkAddressMissingMetamask()
  var twitter_ID = document.getElementById("setValueSmartContract").value.toString();

  contractDefined_JS.methods.twitterIDaddress(twitter_ID).call((err, balance_) => {
    if(accounts[0].toLowerCase() == balance_.toLowerCase()) {
      ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: accounts[0],
              to: contractAddress_JS,
              data: contractDefined_JS.methods.resolveToTwitterID(twitter_ID).encodeABI()
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
    else{
      alert("You do not have the twitter_id pointing at your Metamask wallet address yet! Register yout twitter_id first!")
    }
  })


});

//Get the latest event. Once the event i  s triggered, website will update value.
// contractDefined_JS.events.faucetWithdraw({
//      fromBlock: 'latest'
//  }, function(error, eventResult){})
//  .on('data', function(eventResult){
//    console.log(eventResult)
//    //Call the get function to get the most accurate present state for the value.
//   checkVerifiedTwitter()
//   //LINK BALANCE
//   chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
//     document.getElementById("getFaucetLinkBalance").innerHTML = contractLINKbalanceResult/(10**18) + " LINK"
//   });
//    })
//  .on('changed', function(eventResult){
//      // remove event from local database
//  })
//  .on('error', console.error);
