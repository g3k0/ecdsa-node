/**
 * author: Christian Palazzo
 * email: palazzochristian@yahoo.it
 * date: 2023-11-14
 * 
 * This file contains the asymmetric encryption utilities that need to be run
 * outside of the scope of the front end and the back end applications.
 */

const createPrivateKeySync = require('ethereum-cryptography/secp256k1-compat').createPrivateKeySync;
const secp256k1 = require('ethereum-cryptography/secp256k1').secp256k1;
const keccak256 = require('ethereum-cryptography/keccak').keccak256;
const utils = require('ethereum-cryptography/utils');


/**
 * 1. Public key-private key pair generation
 * 2. A signature is generated from the public key using the private key
 * 3. From the signature I recover the public key and the wallet address to give to the front end 
 */

/**
 * In order to do this exercise I decided to implement a single API.
 * The answer of the API is as follow: 
 * {    
 *     "success": <boolean>
 *     "data": {
 *        privateKey: <string>
 *        publicKeyHash: <string> // the user passes this to the back end when he/she does a transaction
 *        signature: <string>  // the user passes this to the back end when he/she does a transaction
 *        address: <string>    // this is hardcoded in the front end
 *      }
 * }
 * 
 * The back end will:
 *  - checks the validity of the signature
 *  - extracts the address from the signature
 *  - checks if the balance of the wallet is enough for the transaction
 *  - performs the transactions / returns the appropriate error
 */

/**
 * @return {string} - it containts all the needed data or the error message in case of error
 */
const main = function() {

    const response = {
        result: false,
        data: {
            privateKey: '',
            publicKeyHash: '',
            signature: '',
            address: '',
            recoveryId: ''
        }
    }

    try {
        // I generate a random private key
        const privateKey = createPrivateKeySync()
        const privateKeyString = utils.toHex(privateKey).toString();

        // I obtain the public key from the previous random private key
        const publicKey = secp256k1.getPublicKey(privateKey)

        // I obtain the address from the public key, taking the last 20 bytes
        // the address is set in the React front end component
        const last20ByteUint8Array = publicKey.slice(-20)
        const addressString = utils.toHex(last20ByteUint8Array).toString();

        // I create the signature starting from the public key 
        // This signature is needed by the user to ask for a transaction, togheter with the public key hash
        const publicKeyHash = keccak256(publicKey);
        const publicKeyHashString = utils.toHex(publicKeyHash).toString()

        const signature = secp256k1.sign(publicKeyHash, privateKey);
        const recoveryId = signature.recovery
        const signatureString = signature.toCompactHex();
        
        response.result = true;
        response.data.privateKey = privateKeyString;
        response.data.publicKeyHash = publicKeyHashString;
        response.data.address = addressString;
        response.data.signature = signatureString;
        // unfortunately I must pass the recovery id also, since is not serialized
        // see https://github.com/paulmillr/noble-curves
        response.data.recoveryId = recoveryId

        console.log(JSON.stringify(response))

        return response
    } catch (e) {
        response.error = `There was an error running the script: ${e.message}`;
        console.log(JSON.stringify(response));

        return response
    }
    
}

module.exports.main = main()

/**
 * set of data created for the application:
 * 
 * {
 *  "privateKey":"b94ce5504ccb565908c766d969119557a347089b1bc2b75fe9feaac44cc7a446",
 *  "publicKeyHash":"a5ff311973c06e539b5323a92d2a93b90b5057c3d8ef1be2c24fb9ca72b0352f",
 *  "signature":"affe0224765d6b694635409b854129cbba79b5422ecad67442086f35074a7b967e3b806f473970be1f8c606b11e61b0de8406ebbcbc913e3e568056cebaedd6c",
 *  "address":"7e5df95bc49d6b8d67de022453558ba593d5dfa4",
 *  "recoveryId":1
 * }
 * 
 * {
 *  "privateKey":"18792766f89806c5f98b059a445065efa35f1d99fa26303e28b3bf7f9d7efc37",
 *  "publicKeyHash":"3e03d7ebd29dd5ad76b9946601d6170b31a5c710f1b670551af8a6b8b22e2647",
 *  "signature":"9979dcc918e0b712899bd3780db3c90145dbbeb2f4c213617edaecdbdb98866d3982f81836088749a64602e11fcc5afc35e1f644aa75628edb663ea9709343e5",
 *  "address":"0f5574a60058d00ce484a7b19f9acc76a6e67452",
 *  "recoveryId":1
 * }
 * 
 * {
 *  "privateKey":"cc688329b2712eaa5dbaef19e08c7f1134cd281a0c86fba8039f2ac49dd26901",
 *  "publicKeyHash":"b08d57826ea25bc2852d1fb52c1e703ad567d50ae58e37a298c0343dbc4d1177",
 *  "signature":"6fe01fff851fc7f736e2723abd05a4ac9eefa1fa5d6a77daa87066a775a636ba09699e9cfcb7ec77fd4aae797a5dc70379f980c8ea42b4920f8475742cc65bbd",
 *  "address":"0b76da09d0f20e7d83ab29003ec0925bf99d69b7",
 *  "recoveryId":1
 * }
 */

