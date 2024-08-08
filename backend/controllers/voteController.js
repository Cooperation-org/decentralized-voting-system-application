const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();

const { v4: uuidv4 } = require("uuid");

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

// If we weren't able to grab it, we should throw a new error
if (!myAccountId || !myPrivateKey) {
    throw new Error(
        "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
    );
}
//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

//Set the default maximum transaction fee (in Hbar)
client.setDefaultMaxTransactionFee(new Hbar(100));

//Set the maximum payment for queries (in Hbar)
client.setDefaultMaxQueryPayment(new Hbar(50));

console.log("Client setup complete.");

// Integrate Hedera Core Functionalities here

let votes = [""]; // In-memory storage for testing

const createVote = async (req, res) => {
    const { description, options } = req.body;

    if (!description || !options || options.length === 0) {
        return res
            .status(400)
            .send({ error: "Description and options are required" });
    }

    const vote = {
        id: uuidv4(),
        description,
        options,
        votes: {},
    };

    votes.push(vote);

    res.status(201).send({ message: "Vote created", vote });
};

const getVotes = async (req, res) => {
    res.status(200).send({ votes });
};

const submitVote = async (req, res) => {
    const { id } = req.params;
    const { option } = req.body;

    const vote = votes.find((v) => v.id === id);

    if (!vote) {
        return res.status(404).send({ error: "Vote not found" });
    }

    if (!vote.options.includes(option)) {
        return res.status(400).send({ error: "Invalid vote option" });
    }

    if (!vote.votes[option]) {
        vote.votes[option] = 0;
    }

    vote.votes[option] += 1;

    res.status(200).send({ message: "Vote submitted", vote });
};

module.exports = { createVote, getVotes, submitVote };
