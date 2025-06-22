const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = '7286404366:AAEiWQEoWGahbNqEfW0ov4xMU7Lr7I06viU';  // Replace with your bot token
const OPENAI_KEY = 'Wwbxfy9KZ0oxGRdIl7wEHMXoy7lcJZN4MwUezhxc';          // Replace with your OpenAI key
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

app.use(bodyParser.json());

app.post(`/webhook/${TELEGRAM_TOKEN}`, async (req, res) => {
  console.log('Received message:', req.body);

  const message = req.body.message;
  const chatId = message.chat.id;
  const userText = message.text;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userText }],
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const reply = response.data.choices[0].message.content;

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err.response?.data || err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
s