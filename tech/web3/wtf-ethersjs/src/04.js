import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { ethers } from 'ethers';

dotenv.config();

const mainnetKey = process.env.mainnetKey;
const provider = new ethers.providers.JsonRpcProvider(mainnetKey);

const wallet = ethers.Wallet.createRandom().connect(provider);

console.log(`钱包助记词: ${wallet.mnemonic.phrase}`);
console.log(`钱包私钥: ${wallet.privateKey}`);
const txCount = await wallet.getTransactionCount();
console.log(`钱包发送交易次数: ${txCount}`);

// // 创建交易请求，参数：to为接收地址，value为ETH数额
// const tx = {
//   to: address1,
//   value: ethers.utils.parseEther('0.001'),
// };

// //发送交易，获得收据
// const receipt = await wallet.sendTransaction(tx);
// await receipt.wait(); // 等待链上确认交易
// console.log(receipt); // 打印交易详情
