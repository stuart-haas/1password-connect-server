require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const { OnePasswordConnect } = require('@1password/connect');

const op = OnePasswordConnect({
    serverURL: 'http://localhost:8080',
    token: process.env.OP_ACCESS_TOKEN,
    keepAlive: true,
});

const getSecret = async (title) => {
    try {
        const item = await op.getItemByTitle(process.env.OP_VAULT_ID, title);
        return item.fields[0].value;
    } catch(error) {
        console.log(error);
    }
}

app.use(cors());
app.use(express.json());

app.post('/api/secret', validateSignature, async (req, res, next) => {
    const secret = await getSecret('Webhook Secret');
    res.json({ secret });
});

app.listen(3000, () => {
    console.log(`App listening on port ${port}`);
});