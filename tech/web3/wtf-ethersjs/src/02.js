import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { ethers } from 'ethers';

dotenv.config();

const mainnetKey = process.env.mainnetKey;
const goerliKey = process.env.goerliKey;
// 连接以太坊主网
const providerETH = new ethers.JsonRpcProvider(mainnetKey);
// 连接Goerli测试网
const providerGoerli = new ethers.JsonRpcProvider(goerliKey);

// 1. 查询vitalik在主网和Goerli测试网的ETH余额
console.log('1. 查询vitalik在主网和Goerli测试网的ETH余额');
const balance = await providerETH.getBalance(`vitalik.eth`);
const balanceGoerli = await providerGoerli.getBalance(`vitalik.eth`);
// 将余额输出在 console（主网）
console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
// 输出Goerli测试网ETH余额
console.log(
  `Goerli ETH Balance of vitalik: ${ethers.formatEther(balanceGoerli)} ETH`
);

// 2. 查询provider连接到了哪条链
console.log('\n2. 查询provider连接到了哪条链');
const network = await providerETH.getNetwork();
console.log(network.toJSON());

// 3. 查询区块高度
console.log('\n3. 查询区块高度');
const blockNumber = await providerETH.getBlockNumber();
console.log(`Current block number: ${blockNumber}`);

// 4. 查询 vitalik 钱包历史交易次数
console.log('\n4. 查询 vitalik 钱包历史交易次数');
const txCount = await providerETH.getTransactionCount('vitalik.eth');
console.log(txCount);

// 5. 查询当前建议的gas设置
console.log('\n5. 查询当前建议的gas设置');
const feeData = await providerETH.getFeeData();
console.log(feeData);

// 6. 查询区块信息
console.log('\n6. 查询区块信息');
const block = await providerETH.getBlock(0);
console.log(block);

// 7. 给定合约地址查询合约bytecode，例子用的WETH地址
console.log('\n7. 给定合约地址查询合约bytecode，例子用的WETH地址');
const code = await providerETH.getCode(
  '0xc778417e063141139fce010982780140aa0cd5ab'
);
console.log(code);
