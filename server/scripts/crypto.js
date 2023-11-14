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
 *        publicKey: <string>
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
 * @return {object} - the result json containing all the needed data
 */
const main = function() {

    const response = {
        result: false,
        data: {
            privateKey: '',
            publicKey: '',
            signature: '',
            address: ''
        }
    }

    try {
        // I generate a random private key
        const privateKey = createPrivateKeySync()
        const privateKeyString = utils.toHex(privateKey).toString();

        // I obtain the public key from the previous random private key
        const publicKey = secp256k1.getPublicKey(privateKey)
        const publicKeyString = utils.toHex(publicKey).toString();

        // I obtain the address from the public key, taking the last 20 bytes
        // the address is set in the React front end component
        const last20ByteUint8Array = publicKey.slice(-20)
        const addressString = utils.toHex(last20ByteUint8Array).toString();

        // I create the signature starting from the public key 
        // This signature is needed by the user to ask for a transaction
        const publicKeyHash = keccak256(publicKey);
        const signature = secp256k1.sign(publicKeyHash, privateKey);
        const signatureString = signature.toCompactHex().toString();


        response.result = true;
        response.data.privateKey = privateKeyString;
        response.data.publicKey = publicKeyString;
        response.data.address = addressString;
        response.data.signature = signatureString;
        return console.log(JSON.stringify(response));
    } catch (e) {
        response.error = `There was an error running the script: ${e.message}`;
        return console.log(JSON.stringify(response));
    }
    
}

module.exports.main = main()

