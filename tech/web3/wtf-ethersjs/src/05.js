// https://wtf.academy/ether-start/WriteContract/

import { ethers } from 'ethers';

// 利用Infura的rpc节点连接以太坊网络
const INFURA_ID = '';
// 连接Rinkeby测试网
const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${INFURA_ID}`
);

// 利用私钥和provider创建wallet对象
const privateKey = 'xxxxxxxxx';
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
const abiWETH = [
  'function balanceOf(address) public view returns(uint)',
  'function deposit() public payable',
  'function transfer(address, uint) public returns (bool)',
  'function withdraw(uint) public',
];
// WETH合约地址（Rinkeby测试网）
const addressWETH = '0xc778417e063141139fce010982780140aa0cd5ab'; // WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);

const address = await wallet.getAddress();
// 读取WETH合约的链上信息（WETH abi）
console.log('\n1. 读取WETH余额');
const balanceWETH = await contractWETH.balanceOf(address);
console.log(`存款前WETH持仓: ${ethers.utils.formatEther(balanceWETH)}\n`);

console.log('\n2. 调用desposit()函数，存入0.001 ETH');
// 发起交易
const tx = await contractWETH.deposit({
  value: ethers.utils.parseEther('0.001'),
});
// 等待交易上链
await tx.wait();
console.log(`交易详情：`);
console.log(tx);
const balanceWETH_deposit = await contractWETH.balanceOf(address);
console.log(
  `存款后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`
);

console.log('\n3. 调用transfer()函数，给vitalik转账0.001 WETH');
// 发起交易
const tx2 = await contractWETH.transfer(
  'vitalik.eth',
  ethers.utils.parseEther('0.001')
);
// 等待交易上链
await tx2.wait();
const balanceWETH_transfer = await contractWETH.balanceOf(address);
console.log(
  `转账后WETH持仓: ${ethers.utils.formatEther(balanceWETH_transfer)}\n`
);
