const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    question: { type: Object, default: {} }, // Store translated questions
    answer: { type: Object, default: {} }   // Store translated answers
  }
});


FaqSchema.methods.getTranslatedQuestion = function (lang) {
  return this.translations.question[lang] || this.question;
};

FaqSchema.methods.getTranslatedAnswer = function (lang) {
  return this.translations.answer[lang] || this.answer;
};

module.exports = mongoose.model("Faq", FaqSchema);
