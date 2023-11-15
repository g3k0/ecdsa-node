const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {

  // signature: 4cd838000bcbe50e702a24480bc1c8ffc4cb89488845062287c6c125f34119fc4fc979f442220139fdea56c95c2abeb12465223413db5581d7561ada70450e29
  "7d79bfd87d95f09b2f0d029068538876d27d3bb8": 100,
  
  // signature: 8880e5feb6849ff0f43d3ac3524a9be247540eaf402541f257d2a554ad2fb5ee014571c01c6b7212aa16143aeec4f05efda9f00f71b6e88d728e31f9d4b643ab
  "4ee3d47d007020ad0a5ca702b9809ab23c9362d0": 50,
  
  // signature: cac4f372009efd1a102b30845094e3526a71b132f067d6d25f973abab92c6cbd3a8b25e6d1a9c7462ef321f5b6a8805393b9f3f027017e13005cb66c24fd2c3b
  "6a9b43a532798333e053f2257d8a8a5d1b3224f1": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
