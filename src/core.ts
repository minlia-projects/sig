import {
    bufferToBytes,
    bytesToBase64,
    toCanonicalJSONBytes
} from '@minlia/belt';

import { ec, curve } from "elliptic";

import {
    Base64String,
    Bech32String,
    Bytes,
    HexString
} from '@minlia/types';

import {
    // decode as bech32Decode,
    encode as bech32Encode,
    toWords as bech32ToWords
} from 'bech32';

import {
    BIP32Interface,
    fromSeed as bip32FromSeed
} from 'bip32';

import { mnemonicToSeedSync as bip39MnemonicToSeed } from 'bip39';

import {
    publicKeyCreate as secp256k1PublicKeyCreate,
    ecdsaSign as secp256k1EcdsaSign,
} from 'secp256k1';


import CryptoJS from "crypto-js";

import {
    COSMOS_PREFIX,
    COSMOS_PATH,
    BROADCAST_MODE_SYNC
} from './constants';

import {
    ripemd160,
    sha256
} from './hash';

import {
    BroadcastMode,
    BroadcastTx,
    KeyPair,
    StdSignature,
    StdSignMsg,
    StdTx,
    Tx,
    SignMeta,
    Wallet,
    KeyStore
} from './types';

import { encodeBinaryByteArray, UVarInt } from './amino';

/**
 * Create a {@link Wallet|`Wallet`} from a known mnemonic.
 * @param   mnemonic - BIP39 mnemonic seed
 * @param   prefix   - Bech32 human readable part, defaulting to {@link COSMOS_PREFIX|`COSMOS_PREFIX`}
 * @param   path     - BIP32 derivation path, defaulting to {@link COSMOS_PATH|`COSMOS_PATH`}
 *
 * @returns a keypair and address derived from the provided mnemonic
 * @throws  will throw if the provided mnemonic is invalid
 */
export function createWalletFromMnemonic(mnemonic: string, prefix: string = COSMOS_PREFIX, path: string = COSMOS_PATH, password?: string): Wallet {
    const masterKey = createMasterKeyFromMnemonic(mnemonic, password);
    return createWalletFromMasterKey(masterKey, prefix, path);
}

/**
 * Derive a BIP32 master key from a mnemonic.
 *
 * @param   mnemonic - BIP39 mnemonic seed
 *
 * @returns BIP32 master key
 * @throws  will throw if the provided mnemonic is invalid
 */
export function createMasterKeyFromMnemonic(mnemonic: string, password?: string): BIP32Interface {
    const seed = bip39MnemonicToSeed(mnemonic, password);
    return bip32FromSeed(seed);
}

/**
 * Create a {@link Wallet|`Wallet`} from a BIP32 master key.
 *
 * @param   masterKey - BIP32 master key
 * @param   prefix    - Bech32 human readable part, defaulting to {@link COSMOS_PREFIX|`COSMOS_PREFIX`}
 * @param   path      - BIP32 derivation path, defaulting to {@link COSMOS_PATH|`COSMOS_PATH`}
 *
 * @returns a keypair and address derived from the provided master key
 */
export function createWalletFromMasterKey(masterKey: BIP32Interface, prefix: string = COSMOS_PREFIX, path: string = COSMOS_PATH): Wallet {
    const { privateKey, publicKey } = createKeyPairFromMasterKey(masterKey, path);
    const address = createAddress(publicKey, prefix);
    return {
        privateKey,
        publicKey,
        // publicKey: bech32Encode('gausspub', bech32ToWords(Buffer.from('eb5ae98721' + publicKey, 'hex'))),
        address
    };
}

/**
 * Derive a keypair from a BIP32 master key.
 *
 * @param   masterKey - BIP32 master key
 * @param   path      - BIP32 derivation path, defaulting to {@link COSMOS_PATH|`COSMOS_PATH`}
 *
 * @returns derived public and private key pair
 * @throws  will throw if a private key cannot be derived
 */
export function createKeyPairFromMasterKey(masterKey: BIP32Interface, path: string = COSMOS_PATH): KeyPair {
    const buffer = masterKey.derivePath(path).privateKey;
    if (!buffer) {
        throw new Error('could not derive private key');
    }

    const privateKey = bufferToBytes(buffer);
    const publicKey = secp256k1PublicKeyCreate(privateKey, true);

    return {
        privateKey: byteToHexString(privateKey),
        publicKey: byteToHexString(publicKey),
    };
}

/**
 * Derive a Bech32 address from a public key.
 *
 * @param   publicKey - public key HexString
 * @param   prefix    - Bech32 human readable part, defaulting to {@link COSMOS_PREFIX|`COSMOS_PREFIX`}
 *
 * @returns Bech32-encoded address
 */
export function createAddress(publicKey: HexString, prefix: string = COSMOS_PREFIX): Bech32String {
    const hash1 = sha256(hexStringToByte(publicKey));
    const hash2 = ripemd160(hash1);
    const words = bech32ToWords(hash2);
    return bech32Encode(prefix, words);
}


/**
 * create keystore
 * @param name 
 * @param password 
 * @param wallet 
 */
export function createKeystore(name: string, password: string, wallet: Wallet): KeyStore {
    const ciphertext = encrypt(JSON.stringify(wallet), password);
    const keystore = {
        name,
        address: wallet.address,
        wallet: ciphertext
    };
    return keystore;
}

/**
 * openKeystore
 * @param keystore 
 * @param password 
 */
export function openKeystore(keystore: KeyStore, password: string): Wallet {
    const decrypted = decrypt(keystore.wallet, password);
    const walletJson = JSON.parse(decrypted);
    return walletJson;
}

/**
 * Sign a transaction.
 *
 * This combines the {@link Tx|`Tx`} and {@link SignMeta|`SignMeta`} into a {@link StdSignMsg|`StdSignMsg`}, signs it,
 * and attaches the signature to the transaction. If the transaction is already signed, the signature will be
 * added to the existing signatures.
 *
 * @param   tx      - transaction (signed or unsigned)
 * @param   meta    - metadata for signing
 * @param   keyPair - public and private key pair (or {@link Wallet|`Wallet`})
 *
 * @returns a signed transaction
 */
export function signTx(tx: Tx | StdTx, meta: SignMeta, keyPair: KeyPair): StdTx {
    const signMsg = createSignMsg(tx, meta);
    const signature = createSignature(signMsg, keyPair);
    const signatures = (('signatures' in tx) && (tx.signatures != null)) ? [...tx.signatures, signature] : [signature];
    return {
        ...tx,
        signatures
    };
}

/**
 * Create a transaction with metadata for signing.
 *
 * @param   tx   - unsigned transaction
 * @param   meta - metadata for signing
 *
 * @returns a transaction with metadata for signing
 */
export function createSignMsg(tx: Tx, meta: SignMeta): StdSignMsg {
    return {
        account_number: meta.account_number,
        chain_id: meta.chain_id,
        fee: tx.fee,
        memo: tx.memo,
        msgs: tx.msg,
        sequence: meta.sequence
    };
}

/**
 * Create a signature from a {@link StdSignMsg|`StdSignMsg`}.
 *
 * @param   signMsg - transaction with metadata for signing
 * @param   keyPair - public and private key pair (or {@link Wallet|`Wallet`})
 *
 * @returns a signature and corresponding public key
 */
export function createSignature(signMsg: StdSignMsg, { privateKey, publicKey }: KeyPair): StdSignature {
    const signatureBytes = createSignatureBytes(signMsg, privateKey);
    return {
        signature: bytesToBase64(signatureBytes),
        pub_key: bytesToBase64(_serializePubKey(new ec('secp256k1').keyFromPublic(hexStringToByte(publicKey)).getPublic()))
    };
}

/**
 * Create signature bytes from a {@link StdSignMsg|`StdSignMsg`}.
 *
 * @param   signMsg    - transaction with metadata for signing
 * @param   privateKey - private key bytes
 *
 * @returns signature bytes
 */
export function createSignatureBytes(signMsg: StdSignMsg, privateKey: HexString): Bytes {
    const bytes = toCanonicalJSONBytes(signMsg);
    return sign(bytes, privateKey);
}

/**
 * Sign the sha256 hash of `bytes` with a secp256k1 private key.
 *
 * @param   bytes      - bytes to hash and sign
 * @param   privateKey - private key hexstring
 *
 * @returns signed hash of the bytes
 * @throws  will throw if the provided private key is invalid
 */
export function sign(bytes: Bytes, privateKey: HexString): Bytes {
    const hash = sha256(bytes);
    const { signature } = secp256k1EcdsaSign(hash, hexStringToByte(privateKey));
    return signature;
}



/**
 * Prepare a signed transaction for broadcast.
 *
 * @param   tx   - signed transaction
 * @param   mode - broadcast mode
 *
 * @returns a transaction broadcast
 */
export function createBroadcastTx(tx: StdTx, mode: BroadcastMode = BROADCAST_MODE_SYNC): BroadcastTx {
    return {
        tx,
        mode
    };
}


/**
 * Decrypt message
 * @param transit 
 * @param password 
 */
export function decrypt(transit: string, password: string): string {
    const salt = CryptoJS.enc.Hex.parse(transit.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(transit.substr(32, 32));
    const encrypted = transit.substring(64);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 100
    });
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * encrypt message
 *
 * @param   message   - need encrypt string
 * @param   password - password
 * @returns encrypt string
 */
export function encrypt(message: string, password: string): string {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 100
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(message, key, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    const transit = salt.toString() + iv.toString() + encrypted.toString();
    return transit;
}

/**
 * verify the password
 * @param password 
 */
export function verifyPassword(password: string): void {
    if (!password) {
        throw new Error("Password is required");
    }
    if (password.length < 8) {
        throw new Error("Password length is less than 8 characters");
    }
}

/**
 * byteToHexString
 * @param uint8arr 
 */
export function byteToHexString(uint8arr: Bytes): HexString {
    if (!uint8arr) {
        return '';
    }
    let hexStr = '';
    for (let i = 0; i < uint8arr.length; i++) {
        let hex = (uint8arr[i] & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }

    return hexStr;
}

/**
 * hexStringToByte
 * @param str 
 */
export function hexStringToByte(str: string): Bytes {
    if (!str) {
        return new Uint8Array();
    }

    const a = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}

/**
 * serializes and Compressed to  33-byte 
 * @param publicKey 
 * @return {Base64String}
 */
export function serializesAndCompressedPubkey(publicKey: HexString | Bytes): Base64String{
    if (typeof publicKey == 'string') {
        return bytesToBase64(_serializePubKey(new ec('secp256k1').keyFromPublic(hexStringToByte(publicKey)).getPublic()));
    }
    return bytesToBase64(_serializePubKey(new ec('secp256k1').keyFromPublic(publicKey).getPublic()));
}




/**
 * serializes a public key in a 33-byte compressed format.
 * @param {Elliptic.PublicKey} unencodedPubKey
 * @return {Buffer}
 */
function _serializePubKey(unencodedPubKey: curve.base.BasePoint): Buffer {
    let format = 0x2
    const y = unencodedPubKey.getY()
    const x = unencodedPubKey.getX()
    if (y && y.isOdd()) {
        format |= 0x1
    }
    let pubBz = Buffer.concat([
        UVarInt.encode(format),
        x.toArrayLike(Buffer, "be", 32),
    ])

    // prefixed with length
    pubBz = encodeBinaryByteArray(pubBz)
    // add the amino prefix
    pubBz = Buffer.concat([Buffer.from("EB5AE987", "hex"), pubBz])
    return pubBz
}


