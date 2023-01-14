import { ethers } from 'ethers';

// 利用Infura的rpc节点连接以太坊网络
const INFURA_ID = '';
// 连接Rinkeby测试网
const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${INFURA_ID}`
);

// 利用私钥和provider创建wallet对象
const privateKey = '';
const wallet = new ethers.Wallet(privateKey, provider);

// ERC20的人类可读abi
const abiERC20 = [
  'constructor(string memory name_, string memory symbol_)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function mint(uint amount) external',
];
// 填入合约字节码，在remix中，你可以在两个地方找到Bytecode
// 1. 编译面板的Bytecode按钮
// 2. 文件面板artifact文件夹下与合约同名的json文件中
// 里面"bytecode"属性下的"object"字段对应的数据就是Bytecode，挺长的，608060起始
// "object": "608060405260646000553480156100...
const bytecodeERC20 = '';

const factoryERC20 = new ethers.ContractFactory(
  abiERC20,
  bytecodeERC20,
  wallet
);

// 1. 利用contractFactory部署ERC20代币合约
console.log('\n1. 利用contractFactory部署ERC20代币合约');
// 部署合约，填入constructor的参数
const contractERC20 = await factoryERC20.deploy('WTF Token', 'WTF');
console.log(`合约地址: ${contractERC20.address}`);
console.log('部署合约的交易详情');
console.log(contractERC20.deployTransaction);
console.log('\n等待合约部署上链');
await contractERC20.deployed();
console.log('合约已上链');

// 打印合约的name()和symbol()，然后调用mint()函数，给自己地址mint 10,000代币
console.log('\n2. 调用mint()函数，给自己地址mint 10,000代币');
console.log(`合约名称: ${await contractERC20.name()}`);
console.log(`合约代号: ${await contractERC20.symbol()}`);
let tx = await contractERC20.mint('10000');
console.log('等待交易上链');
await tx.wait();
console.log(
  `mint后地址中代币余额: ${await contractERC20.balanceOf(wallet.address)}`
);
console.log(`代币总供给: ${await contractERC20.totalSupply()}`);

// 3. 调用transfer()函数，给V神转账1000代币
console.log('\n3. 调用transfer()函数，给V神转账1,000代币');
tx = await contractERC20.transfer('vitalik.eth', '1000');
console.log('等待交易上链');
await tx.wait();
console.log(
  `V神钱包中的代币余额: ${await contractERC20.balanceOf('vitalik.eth')}`
);
