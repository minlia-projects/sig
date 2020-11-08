import './setup';
import { bufferToBytes } from '@minlia/belt';
import { fromSeed } from 'bip32';
import * as Sig from '../';

const knownMnemonic = 'rich banner swift brush fury tunnel pause forest dose color luggage length';

const knownSeed = Buffer.from([
    50,
    182,
    171,
    96,
    88,
    98,
    211,
    93,
    116,
    114,
    22,
    181,
    93,
    9,
    59,
    144,
    188,
    240,
    141,
    72,
    221,
    81,
    113,
    195,
    24,
    110,
    0,
    131,
    92,
    111,
    183,
    147,
    69,
    107,
    7,
    11,
    124,
    85,
    27,
    155,
    16,
    172,
    204,
    156,
    120,
    45,
    247,
    103,
    124,
    108,
    186,
    83,
    98,
    159,
    135,
    133,
    109,
    213,
    47,
    238,
    205,
    5,
    206,
    28
]);

const knownMasterKey = fromSeed(knownSeed);

const cosmosAddress = 'cosmos1xkqfeym2enqah7mwww0wyksx8u5qplsnsy8nl7';

const cosmosPrivateKey = "0d6ef19293438c4b32e65f328f16eace816f0a304b84b9d415802b2cd055c66d"

const cosmosPublicKey = "033ca4773574b1a702018356211d38576318f46471b272598f5fb19dc949bf6e79"

const cosmosKeyPair = {
    publicKey:  cosmosPublicKey,
    privateKey: cosmosPrivateKey
};

const customPrefix = 'custom';

const customPath = "m/0'/0/0/0";

const customAddress = 'custom1v2h8z97nqaumf9t8c6fhyal2j6f9s6mugvepc5';

const customPrivateKey = "365958e1e29a5014d4367690825e46f6fcc752ecd6ee7ec455e012199062cadc";

const customPublicKey = "03939fb66aeb8635b4c1bb8ca60ff61ceec96c4d5c7b5502d16bfe9516d344254a";

const tx = {
    'msg':  [
        {
            'type':  'cosmos-sdk/MsgSend',
            'value': {
                'from_address': cosmosAddress,
                'to_address':   cosmosAddress,
                'amount':       [
                    {
                        'denom':  'stake',
                        'amount': '1000000'
                    }
                ]
            }
        }
    ],
    'fee':  {
        'amount': [
            {
                'denom':  'stake',
                'amount': '1'
            }
        ],
        'gas':    '100'
    },
    'memo': 'This is a test.'
};

const signMeta = {
    'account_number': '1',
    'chain_id':       'cosmos',
    'sequence':       '0'
};

const knownSignMsg = {
    'account_number': signMeta['account_number'],
    'chain_id':       signMeta['chain_id'],
    'fee':            tx['fee'],
    'memo':           tx['memo'],
    'msgs':           tx['msg'],
    'sequence':       signMeta['sequence']
};

const knownStdSignature = {
    'signature': 'zbaibf4Dh4wwM0spbZlnUWR9mGN8HwFUqyp29Mf7Ysoa0iVKUZuXrYAfTNP7pmwhMmAgp/3dolIiitQVt9tQIw==',
    'pub_key':   {
        'type':  'tendermint/PubKeySecp256k1',
        'value': 'AzykdzV0sacCAYNWIR04V2MY9GRxsnJZj1+xnclJv255'
    }
};

const knownStdTx = {
    ...tx,
    'signatures': [knownStdSignature]
};

const knownBytes = new Uint8Array([
    123,
    34,
    97,
    99,
    99,
    111,
    117,
    110,
    116,
    95,
    110,
    117,
    109,
    98,
    101,
    114,
    34,
    58,
    34,
    49,
    34,
    44,
    34,
    99,
    104,
    97,
    105,
    110,
    95,
    105,
    100,
    34,
    58,
    34,
    99,
    111,
    115,
    109,
    111,
    115,
    34,
    44,
    34,
    102,
    101,
    101,
    34,
    58,
    123,
    34,
    97,
    109,
    111,
    117,
    110,
    116,
    34,
    58,
    91,
    123,
    34,
    97,
    109,
    111,
    117,
    110,
    116,
    34,
    58,
    34,
    49,
    34,
    44,
    34,
    100,
    101,
    110,
    111,
    109,
    34,
    58,
    34,
    115,
    116,
    97,
    107,
    101,
    34,
    125,
    93,
    44,
    34,
    103,
    97,
    115,
    34,
    58,
    34,
    49,
    48,
    48,
    34,
    125,
    44,
    34,
    109,
    101,
    109,
    111,
    34,
    58,
    34,
    84,
    104,
    105,
    115,
    32,
    105,
    115,
    32,
    97,
    32,
    116,
    101,
    115,
    116,
    46,
    34,
    44,
    34,
    109,
    115,
    103,
    115,
    34,
    58,
    91,
    123,
    34,
    116,
    121,
    112,
    101,
    34,
    58,
    34,
    99,
    111,
    115,
    109,
    111,
    115,
    45,
    115,
    100,
    107,
    47,
    77,
    115,
    103,
    83,
    101,
    110,
    100,
    34,
    44,
    34,
    118,
    97,
    108,
    117,
    101,
    34,
    58,
    123,
    34,
    97,
    109,
    111,
    117,
    110,
    116,
    34,
    58,
    91,
    123,
    34,
    97,
    109,
    111,
    117,
    110,
    116,
    34,
    58,
    34,
    49,
    48,
    48,
    48,
    48,
    48,
    48,
    34,
    44,
    34,
    100,
    101,
    110,
    111,
    109,
    34,
    58,
    34,
    115,
    116,
    97,
    107,
    101,
    34,
    125,
    93,
    44,
    34,
    102,
    114,
    111,
    109,
    95,
    97,
    100,
    100,
    114,
    101,
    115,
    115,
    34,
    58,
    34,
    99,
    111,
    115,
    109,
    111,
    115,
    49,
    120,
    107,
    113,
    102,
    101,
    121,
    109,
    50,
    101,
    110,
    113,
    97,
    104,
    55,
    109,
    119,
    119,
    119,
    48,
    119,
    121,
    107,
    115,
    120,
    56,
    117,
    53,
    113,
    112,
    108,
    115,
    110,
    115,
    121,
    56,
    110,
    108,
    55,
    34,
    44,
    34,
    116,
    111,
    95,
    97,
    100,
    100,
    114,
    101,
    115,
    115,
    34,
    58,
    34,
    99,
    111,
    115,
    109,
    111,
    115,
    49,
    120,
    107,
    113,
    102,
    101,
    121,
    109,
    50,
    101,
    110,
    113,
    97,
    104,
    55,
    109,
    119,
    119,
    119,
    48,
    119,
    121,
    107,
    115,
    120,
    56,
    117,
    53,
    113,
    112,
    108,
    115,
    110,
    115,
    121,
    56,
    110,
    108,
    55,
    34,
    125,
    125,
    93,
    44,
    34,
    115,
    101,
    113,
    117,
    101,
    110,
    99,
    101,
    34,
    58,
    34,
    48,
    34,
    125
]);

const knownSignature = new Uint8Array([
    205,
    182,
    162,
    109,
    254,
    3,
    135,
    140,
    48,
    51,
    75,
    41,
    109,
    153,
    103,
    81,
    100,
    125,
    152,
    99,
    124,
    31,
    1,
    84,
    171,
    42,
    118,
    244,
    199,
    251,
    98,
    202,
    26,
    210,
    37,
    74,
    81,
    155,
    151,
    173,
    128,
    31,
    76,
    211,
    251,
    166,
    108,
    33,
    50,
    96,
    32,
    167,
    253,
    221,
    162,
    82,
    34,
    138,
    212,
    21,
    183,
    219,
    80,
    35
]);

describe('core', () => {
    describe('createWalletFromMnemonic', () => {
        it('with default prefix, and path', () => {
            const wallet = Sig.createWalletFromMnemonic(knownMnemonic);
            expect(wallet.address).toBe(cosmosAddress);
            expect(wallet.privateKey).toBe(cosmosPrivateKey);
            expect(wallet.publicKey).toBe(cosmosPublicKey);
        });

        it('with custom prefix and custom path', () => {
            const wallet = Sig.createWalletFromMnemonic(knownMnemonic, customPrefix, customPath);
            expect(wallet.address).toBe(customAddress);
            expect(wallet.privateKey).toBe(customPrivateKey);
            expect(wallet.publicKey).toBe(customPublicKey);
        });
    });

    describe('createMasterKeyFromMnemonic', () => {
        it('with known mnemonic', () => {
            const masterKey = Sig.createMasterKeyFromMnemonic(knownMnemonic);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(bufferToBytes(masterKey.privateKey!)).toBeBytes(bufferToBytes(knownMasterKey.privateKey!));
            expect(bufferToBytes(masterKey.publicKey)).toBeBytes(bufferToBytes(knownMasterKey.publicKey));
        });
    });

    describe('createWalletFromMasterKey', () => {
        it('with default prefix and path', () => {
            const wallet = Sig.createWalletFromMasterKey(knownMasterKey);
            expect(wallet.address).toBe(cosmosAddress);
            expect(wallet.privateKey).toBe(cosmosPrivateKey);
            expect(wallet.publicKey).toBe(cosmosPublicKey);
        });

        it('with custom prefix and path', () => {
            const wallet = Sig.createWalletFromMasterKey(knownMasterKey, customPrefix, customPath);
            expect(wallet.address).toBe(customAddress);
            expect(wallet.privateKey).toBe(customPrivateKey);
            expect(wallet.publicKey).toBe(customPublicKey);
        });
    });

    describe('createKeyPairFromMasterKey', () => {
        it('with default path', () => {
            const keyPair = Sig.createKeyPairFromMasterKey(knownMasterKey);
            expect(keyPair.privateKey).toBe(cosmosPrivateKey);
            expect(keyPair.publicKey).toBe(cosmosPublicKey);
        });

        it('with custom path', () => {
            const keyPair = Sig.createKeyPairFromMasterKey(knownMasterKey, customPath);
            expect(keyPair.privateKey).toBe(customPrivateKey);
            expect(keyPair.publicKey).toBe(customPublicKey);
        });
    });

    describe('createAddress', () => {
        it('with default prefix', () => {
            const address = Sig.createAddress(cosmosPublicKey);
            expect(address).toBe(cosmosAddress);
        });

        it('with custom prefix', () => {
            const address = Sig.createAddress(customPublicKey, customPrefix);
            expect(address).toBe(customAddress);
        });
    });

    describe('signTx', () => {
        it('with tx, signMeta, and keyPair', () => {
            const stdTx = Sig.signTx(tx, signMeta, cosmosKeyPair);
            expect(stdTx).toEqual(knownStdTx);
        });

        it.skip('with stdTx, signMeta, and keyPair', () => {

        });
    });

    describe('createSignMsg', () => {
        it('with tx and signMeta', () => {
            const signMsg = Sig.createSignMsg(tx, signMeta);
            expect(signMsg).toEqual(knownSignMsg);
        });
    });

    describe('createSignature', () => {
        it('with signMsg and keyPair', () => {
            const stdSignature = Sig.createSignature(knownSignMsg, cosmosKeyPair);
            expect(stdSignature).toEqual(knownStdSignature);
        });
    });

    describe('createSignatureBytes', () => {
        it('with signMsg and privateKey', () => {
            const signature = Sig.createSignatureBytes(knownSignMsg, cosmosPrivateKey);
            expect(signature).toBeBytes(knownSignature);
        });
    });

    describe('sign', () => {
        it('with bytes and privateKey', () => {
            const signature = Sig.sign(knownBytes, cosmosPrivateKey);
            expect(signature).toBeBytes(knownSignature);
        });
    });
});
