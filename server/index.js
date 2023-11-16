const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp256k1 = require('ethereum-cryptography/secp256k1').secp256k1;
const utils = require('ethereum-cryptography/utils');
const ecdsaRecover = require('ethereum-cryptography/secp256k1-compat').ecdsaRecover;
const compat = require('ethereum-cryptography/secp256k1-compat');

app.use(cors());
app.use(express.json());

/**
 * NOTE: I should split this file into multiple files and write more atomic functions
 * but I preferred to keep everything here to to make it easier for the reviewer to read
 */

const balances = {

  // recovery id is 1 for all of the 3 signatures. No way to serialize the recovery id during signature serialization.

  // signature: affe0224765d6b694635409b854129cbba79b5422ecad67442086f35074a7b967e3b806f473970be1f8c606b11e61b0de8406ebbcbc913e3e568056cebaedd6c
  // public key hash: a5ff311973c06e539b5323a92d2a93b90b5057c3d8ef1be2c24fb9ca72b0352f
  "7e5df95bc49d6b8d67de022453558ba593d5dfa4": 100,
  
  // signature: 9979dcc918e0b712899bd3780db3c90145dbbeb2f4c213617edaecdbdb98866d3982f81836088749a64602e11fcc5afc35e1f644aa75628edb663ea9709343e5
  // public key hash: 3e03d7ebd29dd5ad76b9946601d6170b31a5c710f1b670551af8a6b8b22e2647
  "0f5574a60058d00ce484a7b19f9acc76a6e67452": 50,
  
  // signature: 6fe01fff851fc7f736e2723abd05a4ac9eefa1fa5d6a77daa87066a775a636ba09699e9cfcb7ec77fd4aae797a5dc70379f980c8ea42b4920f8475742cc65bbd
  // public key hash: b08d57826ea25bc2852d1fb52c1e703ad567d50ae58e37a298c0343dbc4d1177
  "0b76da09d0f20e7d83ab29003ec0925bf99d69b7": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, publicKeyHash, signature } = req.body;

  // for the fist, it's good to add some server side validation of the data...
  if (!signature || typeof signature !== 'string') {
    res.status(400).send({ message: "The signature is missing or has an invalid format: please provide a string signature" });
  }

  if (!publicKeyHash || typeof publicKeyHash !== 'string') {
    res.status(400).send({ message: "The publichKeyHash is missing or has an invalid format: please provide a string publicKeyHash" });
  }

  if (!recipient || typeof signature !== 'string') {
    res.status(400).send({ message: "The recipient is missing or has an invalid format: please provide a string recipient" });
  }

  if (!amount || typeof amount !== 'number') {
    res.status(400).send({ message: "The amount is missing or has an invalid format: please provide a valid number amount" });
  }

  // ...then, let's check the signature and retrieve the sender public key...
  let publicKey;

  try {
    publicKey = (secp256k1.Signature.fromCompact(signature)).addRecoveryBit(1).recoverPublicKey(publicKeyHash).toHex();
  } catch (e) {
    console.error(e.message)
    res.status(400).send({ message: "The signature seems to be invalid. Trasaction rejected" });
  }

  // ...next, let's to retrieve the address...
  let address;

  try {
   

  } catch(e) {
    console.error(e.message)
    res.status(500).send({ message: "Internal server error. Trasaction rejected" });
  }
  
  // ...and check that the sender is not asking a transaction to his/her own address...

  // ...now I check that the funds are enough for the transaction...

  // ...and finally I complete the transaction.

  /*setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }*/
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
