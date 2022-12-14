
// METAMASK

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

// Function called for getting Metamask accounts on LuksoL16.
// Used in every button in case the user forgets to click the top button.
function enableMetamaskOnLuksoL16() {
  // Get account details from Metamask wallet.
  getAccount();
  // Check if user is on the LuksoL16 testnet. If not, alert them to change to LuksoL16.
  if(window.ethereum.networkVersion != 2828){
    alert("You are not on the LuksoL16 Testnet! Please switch to LuksoL16 and refresh page.")
    console.log(window.ethereum.networkVersion)
  }
}

//Get the latest value.
function checkLastDateWithdrawn() {
  contractDefined_JS.methods.userPreviousWithdrawTime(accounts[0]).call((err, balance) => {

    if(balance === undefined){
      document.getElementById("getValueStateSmartContract").innerHTML =  "Install Metamask and select LuksoL16 Testnet to have a Web3 provider to read blockchain data."
    }

    else{
      console.log(BigInt(Date.now()) )
      console.log(BigInt((BigInt(balance)+43200n)*1000n)  )
      if ( BigInt(Date.now()) > BigInt((BigInt(balance)+43200n)*1000n) ) {
        document.getElementById("getValueStateSmartContract").innerHTML = "You can withdraw from the faucet now."
      }
      else {
        balance = new Date(balance*1000).toLocaleString()
        document.getElementById("getValueStateSmartContract").innerHTML =  balance
      }
    }
  })
}

// return the last time the person withdrew from our faucet
async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  document.getElementById("enableEthereumButton").innerText = accounts[0].substr(0,5) + "..." +  accounts[0].substr(38,4)
  checkLastDateWithdrawn()
}

// ON LOAD

//Metamask sending trasactions:
//https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters

//Empty array to be filled once Metamask is called.
let accounts = [];
document.getElementById("enableEthereumButton").innerHTML;
document.getElementById("getValueStateSmartContract").innerHTML =  "Please connect wallet first to check withdrawal time."

//When the page is opened check for error handling issues.
detectMetamaskInstalled()

//Connect to Metamask.
const ethereumButton = document.querySelector('#enableEthereumButton');
ethereumButton.addEventListener('click', () => {
    detectMetamaskInstalled()
    enableMetamaskOnLuksoL16()
});

//Make Metamask the client side Web3 provider. Needed for tracking live events.
const web3 = new Web3(window.ethereum)

//Now build the contracts with Web3.

// REQUEST LINK FROM FAUCET
const contractAddress_JS = '0xe33EE68Fc5477Ea95F4897b67d3E763b7F74FC52'
const contractABI_JS = [{"anonymous":false,"inputs":[],"name":"faucetWithdraw","type":"event"},{"inputs":[],"name":"withdrawDirect","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"relayCaller","type":"address"}],"name":"withdrawRelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"relayAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPreviousWithdrawTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const contractDefined_JS = new web3.eth.Contract(contractABI_JS, contractAddress_JS)

// CHAINLINK FAUCET BALANCE
const chainlinkInterfaceERC20_ADDRESS = '0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268'
const chainlinkInterfaceERC20_ABI =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const chainlinkInterfaceERC20_CONTRACT = new web3.eth.Contract(chainlinkInterfaceERC20_ABI, chainlinkInterfaceERC20_ADDRESS)

// FUNCTIONS TO RETRIEVE SMART CONTRACT DATA

//LINK BALANCE
chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
  if ((contractLINKbalanceResult/(10**18)) == 0){document.getElementById("getFaucetLinkBalance").innerHTML = "The faucet is empty!"}
  else {document.getElementById("getFaucetLinkBalance").innerHTML = contractLINKbalanceResult/(10**18) + " LINK"}
});

// MODIFY CONTRACT STATE WITH SET FUNCTION WITH PREDEFINED DATA FROM WEB3.JS
const changeStateInContractEvent = document.querySelector('.changeStateInContractEvent');
changeStateInContractEvent.addEventListener('click', () => {

  checkAddressMissingMetamask()

  contractDefined_JS.methods.userPreviousWithdrawTime(accounts[0]).call((err, balance) => {
    if( BigInt(Date.now()) > BigInt((BigInt(balance)+43200n)*1000n) ) {
      chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
        if(contractLINKbalanceResult >= "20000000000000000000"){
          ethereum
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: accounts[0],
                  to: contractAddress_JS,
                  data: contractDefined_JS.methods.withdrawDirect().encodeABI()
                },
              ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
        }else{
          alert("NEED AT LEAST 20 LINK IN THE FAUCET! DONATE TO FAUCET ADDRESS ON L16: " + contractAddress_JS)
        }
      });
    }else{
      alert("NEED TO WAIT THE FULL 12 HOURS AFTER YOUR LAST FAUCET WITHDRAW! SECONDS LEFT: " + BigInt((BigInt((BigInt(balance)+43200n)*1000n) -BigInt(Date.now()))/1000n) )
    }

  })

});

//Get the latest event. Once the event is triggered, website will update value.
contractDefined_JS.events.faucetWithdraw({
     fromBlock: 'latest'
 }, function(error, eventResult){})
 .on('data', function(eventResult){
   console.log(eventResult)
   //Call the get function to get the most accurate present state for the value.
  checkLastDateWithdrawn()
  //LINK BALANCE
  chainlinkInterfaceERC20_CONTRACT.methods.balanceOf(contractAddress_JS).call((err, contractLINKbalanceResult) => {
    if ((contractLINKbalanceResult/(10**18)) == 0){document.getElementById("getFaucetLinkBalance").innerHTML = "The faucet is empty!"}
    else {document.getElementById("getFaucetLinkBalance").innerHTML = contractLINKbalanceResult/(10**18) + " LINK"}
  });
   })
 .on('changed', function(eventResult){
     // remove event from local database
 })
 .on('error', console.error);

async function addLinkToken() {
  const tokenAddress = '0xbFB26279a9D28CeC1F781808Da89eFbBfE2c4268';
  const tokenSymbol = 'LINK';
  const tokenDecimals = 18;
  const tokenImage = 'https://uc69eb2fca8c87c26b80bbb07240.previews.dropboxusercontent.com/p/thumb/ABow0KydHkmwIPY6xWLGwMaMI4kA-DKA1roFtbp7Z6PAlR6D7b7e-__z4LTd1mXwGAdiisZU_6r3il9T56DvtpQvuedzfnaUhHHmyZCCovLocxREToG-jG1506uph216lkkQUfw_qLtQaZZ3Vx7AIVUzYbXqb4dl6APue4xoTg3QbvZucVOYkysB-JrKYoJG3JvPwmYtJxe4evNkbDBdOeBo17SThdVkVd1-3YbJP2zilodyb-3Dq6ME2R5oFg1VtZyFUP3fhNmvL5mRk5QIPSt17KKhlEdltB3gMxO0kgN22vQtPXXQBZ07Ezz0aYBH0XCuf2rNXS7g5zSS6iE8M7VeGKrwdEHkED_3Q8BzBenyPqkS4lrTNt-P5B4onTJInAsX--0oiV0_iD7hmjycxC2SvTeHCYWY2Lefp1wuO6b1Zg/p.png';

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
  
    if (wasAdded) {
      console.log('LINK has been added to your MetaMask Wallet!');
    } else {
      console.log('Something went wrong...');
    }
  } catch (error) {
    console.log(error);
  }
}
