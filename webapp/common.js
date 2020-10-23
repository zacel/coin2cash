var web3js;
var userAccount;
var coin2cashContract;
var coords;

function createTextInput(name, required=false) {
  var con = document.createElement("div");
  var label = document.createElement("label");
  label.innerText = name;
  var br = document.createElement("br");
  var inp = document.createElement("input");
  inp.type = "text";
  inp.required = required;
  inp.id = name;
  inp.name = name;

  con.appendChild(label);
  con.appendChild(br);
  con.appendChild(inp);
  return con;
}

function criticalError(err, type = 0) {
  //type 1 is location error;
  console.log("critical error");
  var page = document.getElementById("contents");
  page.style.display = "none";
  var errorMSG = document.createElement("div");
  errorMSG.id = "errorMSG";
  errorMSG.innerHTML = `<p>A 🚨<span style="color: red">critical error</span>🚨 occured that could ruin your post. Please see the message below for details:</p><br/><p><b>${err}</b></p>`;


  switch (type) {
    case 1:
      var f = document.createElement("form");
      f.id = "manualLocationForm";

      var msg = document.createElement("p");
      msg.innerHTML = `To fix this error you can set your location manually. If you don't know your latitude and longitude these links can help you find it: <br/>
      <ul>
      <li><a href="https://mylocation.org/" target="_blank">My Location</a></li>
        <li><a href="https://www.google.com/maps" target="_blank">Google Maps</a></li>
      </ul>
      `;

      var lat = createTextInput("latitude", true);
      var lon = createTextInput("longitude", true);

      var submit = document.createElement("input");
      submit.type = "submit";
      submit.value = "set location manually";

      f.appendChild(msg);
      f.appendChild(lat);
      f.appendChild(lon);
      f.appendChild(submit);
      f.onsubmit = (e) => {
        e.preventDefault();
        var lat = document.getElementById("latitude").value;
        var lon = document.getElementById("longitude").value;
        coords = {latitude: lat, longitude: lon};
        document.getElementById("errorMSG").remove();
        page.style.display = "block";
      }
      errorMSG.appendChild(f);
      break;
    default:
      break;
  }
  document.getElementsByTagName("body")[0].appendChild(errorMSG);
}

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
      criticalError("install metamask to use this webapp");
      //callback();
    }
  } catch (e) {
    alert("You need to use a browser with metamask installed");
    criticalError("install metamask to use this webapp");
    //callback();
  }
}

async function loadContract(callback) {
  var contractABI = await $.getJSON("contractABI.json");
  coin2cashContract = new web3js.eth.Contract(
    contractABI.abi,
    contractABI.address,
    {
      from: userAccount, // default from address
      gasPrice: "30000000000", // default gas price in wei, 20 gwei in this case
    }
  );
  callback();
}

function getLocation(_handleLocation) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(_handleLocation, (err) => {
      console.log(err);
      criticalError("Unable to determine your geo position", 1);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
    criticalError("Geolocation is not supported by this browser.", 1);
  }
}

function handleLocation(position) {
  console.log("location");
  console.log(position);
  if (position.coords == undefined) {
    var msg =
      "Your location could not be determined with this browser. Please try a different one like firefox, chrome, safari, or edge";
    alert(msg);
    criticalError(msg, 1);
  } else {
    console.log(position); //doesn't work on http connection requires https
    coords = position.coords;
  }
}
