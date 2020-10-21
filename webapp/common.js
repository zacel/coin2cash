async function loadWeb3(callback) {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    try {
      if (typeof web3 !== "undefined") {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
        await window.ethereum.send("eth_requestAccounts");
        userAccount = await web3js.eth.getAccounts();
        userAccount = userAccount[0];
        callback();
      } else {
        alert("install metamask to use this webapp");
        callback();
      }
    } catch(e) {
      alert("You need to use a browser with metamask installed");
    }
  }

  async function loadContract(callback) {
    var contractABI = await $.getJSON("contractABI.json");
    coin2cashContract = new web3js.eth.Contract(
      contractABI.abi,
      contractABI.address,
      {
        from: userAccount, // default from address
        gasPrice: "20000000000", // default gas price in wei, 20 gwei in this case
      }
    );
    callback();
  }

  function getLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
