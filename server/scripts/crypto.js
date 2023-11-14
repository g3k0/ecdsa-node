/**
 * author: Christian Palazzo
 * email: palazzochristian@yahoo.it
 * 
 * This file contains the asymmetric encryption utilities that need to be run
 * outside of the scope of the front end and the back end applications.
 */

/**
 * 1. Public key-private key pair generation
 * 2. A signature is generated from the public key using the private key
 * 3. From the signature I get an address to give to the front end 
 */

/**
 * In order to do this exercise I decided to implement a single API.
 * The answer of the API is as follow: 
 * {
 *  "result": {
 *     privateKey: "value"
 *     publicKey: "value"
 *     signature: "value"  // the user passes this to the back end when he/she does a transaction *
 *     address: "value"    // this is hardcoded in the front end
 *  }
 * }
 * 
 * The back end will:
 *  - checks the validity of the signature
 *  - extract the address from the signature
 *  - checks the wallet if the balance is enough for the transaction
 *  - does the transactions
 */
