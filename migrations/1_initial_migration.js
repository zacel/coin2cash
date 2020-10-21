const Coin2Cash = artifacts.require("Coin2Cash");

module.exports = function (deployer) {
  deployer.deploy(Coin2Cash);
};
