// https://wtf.academy/ether-start/WriteContract/

import { ethers } from 'ethers';

// 利用Alchemy的rpc节点连接以太坊网络
const ALCHEMY_GOERLI_URL =
  'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';

const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey =
  '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b';
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
const abiWETH = [
  'function balanceOf(address) public view returns(uint)',
  'function deposit() public payable',
  'function transfer(address, uint) public returns (bool)',
  'function withdraw(uint) public',
];
// WETH合约地址（Goerli测试网）
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'; // WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const address = await wallet.getAddress();
// 读取WETH合约的链上信息（WETH abi）
console.log('\n1. 读取WETH余额');
const balanceWETH = await contractWETH.balanceOf(address);
console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`);

console.log('\n2. 调用desposit()函数，存入0.001 ETH');
// 发起交易
const tx = await contractWETH.deposit({
  value: ethers.parseEther('0.001'),
});
// 等待交易上链
await tx.wait();
console.log(`交易详情：`);
console.log(tx);
const balanceWETH_deposit = await contractWETH.balanceOf(address);
console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);

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
