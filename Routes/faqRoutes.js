const express = require("express");
const axios = require("axios");
const Faq = require("../models/faq");
const { client } = require("../redis.js");
const router = express.Router();

const RAPIDAPI_URL = "https://microsoft-translator-text-api3.p.rapidapi.com/translate";
const RAPIDAPI_KEY = "92420061c4msh87fe14d422ef7cbp1a2287jsn7997b11fe8c1"; 

// Function to fetch translations
const fetchTranslations = async (question, answer) => {
  const translations = { question: {}, answer: {} };
  const languages = ["hi", "bn", "fr"];

  await Promise.all(
    languages.map(async (lang) => {
      try {
        // Make translation requests for both question and answer
        const translatedQuestion = await axios.post(
          RAPIDAPI_URL,
          [{ text: question }],
          {
            params: { to: lang, from: "en", textType: "plain" },
            headers: {
              "X-RapidAPI-Host": "microsoft-translator-text-api3.p.rapidapi.com",
              "X-RapidAPI-Key": RAPIDAPI_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const translatedAnswer = await axios.post(
          RAPIDAPI_URL,
          [{ text: answer }],
          {
            params: { to: lang, from: "en", textType: "plain" },
            headers: {
              "X-RapidAPI-Host": "microsoft-translator-text-api3.p.rapidapi.com",
              "X-RapidAPI-Key": RAPIDAPI_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        translations.question[lang] = translatedQuestion.data[0].translations[0].text;
        translations.answer[lang] = translatedAnswer.data[0].translations[0].text;
      } catch (err) {
        console.error(`Translation error for ${lang}:`, err);
        translations.question[lang] = question;
        translations.answer[lang] = answer;
      }
    })
  );
  return translations;
};

router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Validate request body
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    // Check Redis cache first for translations
    const cacheKey = `faq:${question}:${answer}`;
    const cachedFaq = await client.get(cacheKey);
    if (cachedFaq) {
      console.log('Serving from cache');
      return res.status(200).json({ message: "FAQ fetched from cache", data: JSON.parse(cachedFaq) });
    }

    // Fetch translations if not found in cache
    const translations = await fetchTranslations(question, answer);

    // Save FAQ to the database
    const newFaq = new Faq({ question, answer, translations });
    await newFaq.save();

    // Save FAQ to Redis cache
    await client.set(cacheKey, JSON.stringify(newFaq), 'EX', 3600); // Cache for 1 hour

    res.status(201).json({ message: "FAQ added successfully", data: newFaq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { lang = "en" } = req.query; // Default to English if no language is specified

    // Check Redis cache for FAQs
    const cacheKey = `faqs:${lang}`;
    const cachedFaqs = await client.get(cacheKey);
    if (cachedFaqs) {
      console.log('Serving FAQs from cache');
      return res.status(200).json({ data: JSON.parse(cachedFaqs) });
    }

    // Fetch FAQs from DB if not found in cache
    const faqs = await Faq.find({});
    const response = faqs.map(faq => ({
      question: faq.getTranslatedQuestion(lang),
      answer: faq.getTranslatedAnswer(lang),
    }));

    // Save the fetched FAQs to Redis cache
    await client.set(cacheKey, JSON.stringify(response), 'EX', 3600); // Cache for 1 hour

    res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
