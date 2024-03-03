import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { ethers } from 'ethers';

dotenv.config();

const mainnetKey = process.env.mainnetKey;
const provider = new ethers.JsonRpcProvider(mainnetKey);

// 1. 创建随机的 wallet 对象
const wallet1 = ethers.Wallet.createRandom();

// 2. 利用私钥和provider创建wallet对象
const privateKey =
  '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b';
const wallet2 = new ethers.Wallet(privateKey, provider);

// 3. 利用助记词创建wallet对象
const wallet3 = ethers.Wallet.fromPhrase(wallet1.mnemonic.phrase);

console.log(`钱包助记词: ${wallet1.mnemonic.phrase}`);
console.log(`钱包私钥: ${wallet1.privateKey}`);
const txCount = await wallet1.getTransactionCount();
console.log(`钱包发送交易次数: ${txCount}`);

// 创建交易请求，参数：to为接收地址，value为ETH数额
const tx = {
  to: address1,
  value: ethers.parseEther('0.001'),
};

//发送交易，获得收据
const receipt = await wallet1.sendTransaction(tx);
await receipt.wait(); // 等待链上确认交易
console.log(receipt); // 打印交易详情
