require('@nomiclabs/hardhat-waffle'); // import the waffle plugin

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: '0.8.4',
	paths: {
		artifacts: './src/artifacts', // Where the compilation artifacts will live
		sources: './src/contracts' // Where the smart contract source code will found
	},
	networks: {
		// define the networks where hardhat will deploy
		hardhat: {
      // https://hardhat.org/hardhat-network/docs/metamask-issue
			chainId: 1337 // To be able to work with metamask in localhost
		},
		goerli: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.ALCHEMY_PRIVATE_KEY]
    }
	}
};
