import { ethers, randomBytes } from 'ethers'

// 生成随机助记词
const mnemonic = ethers.Mnemonic.entropyToPhrase(randomBytes(32))

// 创建 HD 钱包
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode)

const numWallet = 20
// 派生路径：m / purpose' / coin_type' / account' / change / address_index
// 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
let basePath = "m/44'/60'/0'/0"
let wallets = []
for (let i = 0; i < numWallet; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + '/' + i)
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey)
  console.log(`第${i + 1}个钱包地址： ${walletNew.address}`)
  wallets.push(walletNew)
}

const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log('通过助记词创建钱包：')
console.log(wallet)
// 加密json用的密码，可以更改成别的
const pwd = 'password'
const json = await wallet.encrypt(pwd)
console.log('钱包的加密json：')
console.log(json)

const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd)
console.log('\n4. 从加密json读取钱包：')
console.log(wallet2)
