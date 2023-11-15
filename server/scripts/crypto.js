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
 * @return {string} - it containts all the needed data or the error message in case of error
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
        
        console.log(JSON.stringify(response));

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
 *  "privateKey":"54f583565fdc40811fd893407fb6038bf6a3ce8898db5b5b212cb61c5e26c729",
 *  "publicKey":"030d0d7775081bcf56528de7717d79bfd87d95f09b2f0d029068538876d27d3bb8",
 *  "signature":"4cd838000bcbe50e702a24480bc1c8ffc4cb89488845062287c6c125f34119fc4fc979f442220139fdea56c95c2abeb12465223413db5581d7561ada70450e29",
 *  "address":"7d79bfd87d95f09b2f0d029068538876d27d3bb8"
 * },
 * {
 *  "privateKey":"12ca50c4e87902ae40741090401d22db9523aadfa9d09896dcde99af63cb02e9",
 *  "publicKey":"024b8bedf477301819c523ec734ee3d47d007020ad0a5ca702b9809ab23c9362d0",
 *  "signature":"8880e5feb6849ff0f43d3ac3524a9be247540eaf402541f257d2a554ad2fb5ee014571c01c6b7212aa16143aeec4f05efda9f00f71b6e88d728e31f9d4b643ab",
 *  "address":"4ee3d47d007020ad0a5ca702b9809ab23c9362d0"
 * },
 * {
 *  "privateKey":"546efc3fa58af783ea2a41210314f40f773a56367ef16fca84e9216d7a5a1c7d",
 *  "publicKey":"026fb47376f2ac2a28536d5f206a9b43a532798333e053f2257d8a8a5d1b3224f1",
 *  "signature":"cac4f372009efd1a102b30845094e3526a71b132f067d6d25f973abab92c6cbd3a8b25e6d1a9c7462ef321f5b6a8805393b9f3f027017e13005cb66c24fd2c3b",
 *  "address":"6a9b43a532798333e053f2257d8a8a5d1b3224f1"
 * }
 */

