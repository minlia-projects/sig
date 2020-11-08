# Sig

Sig is a signing library for Cosmos, supported in Node.js and browsers.

Sig provides JavaScript functions and TypeScript types for

  - Deriving a wallet (private key, public key, and address) from a mnemonic
  - Deriving an address from a public key
  - Structuring a transaction
  - Signing a transaction
  - Verifying signatures for a transaction
  - Preparing a transaction for broadcast

Sig **does not** provide functions for

  - Generating a mnemonic
  - Storing keys or other secrets
  - Obtaining data from a chain
  - Broadcasting transactions

Sig is designed to work well with other libraries like
  - [`bip39`](https://github.com/bitcoinjs/bip39)
  - [`bip32`](https://github.com/bitcoinjs/bip32)
  - [`@tendermint/amino-js`](https://github.com/cosmos/amino-js)

Sig is experimental and not recommended for use in production yet. Please help us test and improve it!

As always, please be careful to protect any mnemonic phrases, passwords, and private keys.

### Demo

  - [Node.js](https://repl.it/repls/DodgerblueAshamedTest)
  - [Browser](https://jsfiddle.net/pbc6zkeh/)

### Documentation

**https://github.com/minlia-projects/sig/**

### Install

Please note that the NPM package name is `@minlia/sig` rather than `@cosmos/sig`.

#### Yarn
```shell
yarn add @minlia/sig
```

#### NPM
```shell
npm install --save @minlia/sig
```

### Usage

#### Derive a wallet (private key, public key, and address) from a mnemonic

```typescript
import { createWalletFromMnemonic, createKeystore } from '@minlia/sig';

const mnemonic = 'trouble salon husband push melody usage fine ensure blade deal miss twin';
const password = '12345678';
const wallet = createWalletFromMnemonic(mnemonic, password); // BIP39 mnemonic string
const keystore = createKeystore('walletName' , password, wallet);
/*
{
  privateKey: 'ca3c8c6ab2b43c01ba44cee0cfb34f5177626201cfaad1a1017c97eccd9703e5',
  publicKey: '039f2329823003f78bf27129c8b0491b66e871e250b86b90d958971516b9441cd3',
  address: 'cosmos1asm039pzjkkg9ghlvj267p5g3whtxd2t4leg5c'
}
{
  name: 'walletName',
  address: 'cosmos1asm039pzjkkg9ghlvj267p5g3whtxd2t4leg5c',
  wallet: '15b64996865bce9362c75310eae13a5b4c6d41c1b7e59201a2bdd827ae903de705y09a5ac96kLnZnaAqBOA2RAIr2s4YT29/ylHzxiImyH3BUrAtGrHmdosccDiWLRwZGJsgzcxjJ9MTsUsGJ0aZB2absivPm36P4Rkjsf8iV6TGZu9wDzKwlmcv0L18Hikcyi4Dmwc3jdVs2FTRY4lY8qblnul+sAKqMSgWeYMucVfZORinBhLbiPePg69XWLsSxessd+/mTWkRTBOnXtxyv4vDHRPEw7jvkX9pu3Hkub6BPPMM+HBF1uRas6nAPvbjIB/O9d+9L783+KHyYx+zPpfmKE51xTo9RQulZWpU='
}
*/
```




#### Derive a Bech32 address from a public key

```typescript
import { createAddress } from '@minlia/sig';

const address = createAddress(publicKey); // Buffer or Uint8Array
// 'cosmos1asm039pzjkkg9ghlvj267p5g3whtxd2t4leg5c'
```

#### Sign a transaction

```typescript
import { signTx } from '@minlia/sig';
const tx = {
    fee:  {
        amount: [],
        gas:    '200000'
    },
    memo: '',
    msg:  [{
        type:  'cosmos-sdk/MsgSend',
        value: {
            from_address: 'gauss1pxjm78ckn5w8khx30grsvshsd4k6p4qgzaqag6',
            to_address:   'gauss1d7ftf24geqw2p50z643cl7qn5xd69p937gxqdy',
            amount:       [{ amount: '1000000', denom: 'ugauss' }]
        }
    }]
};

const signMeta = {
    account_number: '1',
    chain_id: 'gauss',
    sequence: '0'
};

const stdTx = signTx(tx, signMeta, wallet); // Wallet or privateKey / publicKey pair; see example above
/*
{
    fee:        {
        amount: [{
            amount: '0',
            denom:  ''
        }],
        gas:    '10000'
    },
    memo:       '',
    msg:        [{
        type:  'cosmos-sdk/MsgSend',
        value: {
            from_address: 'cosmos1qperwt9wrnkg5k9e5gzfgjppzpqhyav5j24d66',
            to_address:   'cosmos1yeckxz7tapz34kjwnjxvmxzurerquhtrmxmuxt',
            amount:       [{
                amount: '1',
                denom:  'STAKE'
            }]
        }
    }],
    signatures: [{
        signature: 'GLhQW+t36tjJW83avsBz6e7WUpkJyeAsmkrCJsnk/fkfA4q5nIVVwTF5HPQhFdkhMfAVKPFuvDmigRp+VQCwtg==',
        pub_key:   {
            type:  'tendermint/PubKeySecp256k1',
            value: 'A58jKYIwA/eL8nEpyLBJG2boceJQuGuQ2ViXFRa5RBzT'
        }
    }]
}
*/
```


Please see the [documentation](https://cosmos.github.io/sig/) for the full API.

### Building

```shell
git clone https://github.com/minlia-projects/sig
cd sig
yarn install
yarn setup
yarn test
```

### Contributing

Sig is very new! Questions, feedback, use cases, issues, and code are all very, very welcome.

Thank you for helping us help you help us all. 🎁

### Alternatives

A number of other projects exist that help with signing for Cosmos.

Please check them out and see if they are right for you!

- [`@lunie/cosmos-keys`](https://github.com/luniehq/cosmos-keys)
- [`@cosmostation/cosmosjs`](https://github.com/cosmostation/cosmosjs)
- [`@iov/cosmos`](https://github.com/iov-one/iov-core/tree/1220-cosmos-codec/packages/iov-cosmos)
- [`@everett-protocol/cosmosjs`](https://github.com/everett-protocol/cosmosjs)
- [`js-cosmos-wallet`](https://github.com/okwme/js-cosmos-wallet)
- [`cosmos-client-ts`](https://github.com/lcnem/cosmos-client-ts)
- [`lotion`](https://github.com/nomic-io/lotion)
