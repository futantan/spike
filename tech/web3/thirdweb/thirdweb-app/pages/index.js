import {
  useContract,
  useNFTs,
  useMintNFT,
  ThirdwebNftMedia,
  Web3Button,
} from "@thirdweb-dev/react";

const contractAddress = "0x6c122d5D038803161613cbFf9Cd228F2E74216C3"
export default function Home() {
  const { contract } = useContract(contractAddress);
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);
  const { mutate: mintNFT, isLoading: isMintingNFT } = useMintNFT(contract);

  return (
    <div>
      <h2>My NFTs</h2>
      {isReadingNfts ? (
        <p>Loading...</p>
      ) : (
        <div>
          {nfts.map((nft) => (
            <ThirdwebNftMedia
              key={nft.tokenId}
              metadata={nft.metadata}
              height={200}
            />
          ))}
        </div>
      )}

      <Web3Button
        contractAddress={contractAddress}
        action={(contract) =>
          contract.erc721.mint({
            name: "Hello world!",
            image:
              // You can use a file or URL here!
              "ipfs://QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png",
          })
        }
      >
        Mint NFT
      </Web3Button>
    </div>
  );
}
