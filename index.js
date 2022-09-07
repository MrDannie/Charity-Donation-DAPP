import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
  console.log("HEREr");
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

// FUND FUCTION
async function fund() {
  console.log("Funding with ethAmount");
  const ethAmount = "0.1";

  if (typeof window.ethereum !== "undefined") {
    // to send a trasaction we need:
    // Provider / connection to the blockchain
    // signer / wallet / someone with some gas
    // COntract we are intrating with (ABI and Address)

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // GET THE CON TRACT
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("DONE!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}
