import Web3 from "web3";
import StarNotaryArtifact from "../../build/contracts/StarNotaryV1.json";

const App = {
  web3: null,
  account: null,
  contract: null,

  start: async function () {
    const {
      web3
    } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StarNotaryArtifact.networks[networkId];
      this.contract = new web3.eth.Contract(
        StarNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  setNameFunc: async function () {
    const {
      starName
    } = this.contract.methods;
    const response = await starName().call();
    const owner = document.getElementById('name');
    owner.innerHTML = response;
  },

  // function called to show the starOwner
  starOwnerFunc: async function () {
    const {
      starOwner
    } = this.contract.methods; // to be able to use the functions in your Smart Contract use destructuring to get the function to be call
    const response = await starOwner().call(); // calling the starOwner property from your Smart Contract.
    const owner = document.getElementById("owner"); // Updating Html
    owner.innerHTML = response;
  },

  // function called to claim a Star
  claimStarFunc: async function () {
    const {
      claimStar,
      starOwner
    } = this.contract.methods; // to be able to use the functions in your Smart Contract use destructuring to get the function to be call
    await claimStar().send({
      from: this.account
    }); // Use `send` instead of `call` when you called a function in your Smart Contract
    const response = await starOwner().call();
    App.setStatus("New Star Owner is " + response + ".");
  }
};

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});