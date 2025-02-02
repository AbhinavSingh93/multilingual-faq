Multilingual FAQ 
This is a multilingual FAQ API built using Node.js, Express, MongoDB, and Redis. The API allows users to submit FAQs, translate them into different languages (Hindi, Bengali, and French), and fetch the FAQs with their translations. Redis is used for caching the translated FAQs to improve performance.

Features
Submit FAQs with questions and answers in English.
Fetch translated FAQs in multiple languages (Hindi, Bengali, French).
Cache the FAQs in Redis for better performance and faster response times.
Store FAQs in a MongoDB database.
Table of Contents
Installation
API Usage
Add FAQ
Get FAQs

Installation
Follow these steps to set up the project locally:

Prerequisites
Node.js (v14 or higher)
MongoDB (Local or MongoDB Atlas)
Redis (Local or Redis Cloud service)
Steps
Clone the repository:

git clone https://github.com/AbhinavSingh93/Multilingual-faq.git
Navigate to the project directory:

cd Multilingual-faq
Install the dependencies:


npm install
Create a .env file in the root directory and add the following variables:

MONGO_URI=mongodb://localhost:27017/faq
REDIS_URI=redis://localhost:6379
RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY

you can take all avove from .env file for reference
Run the server:

npm start
The API should now be running on http://localhost:5000.

API Usage
Add FAQ
To add a new FAQ, send a POST request to /api/faqs with the following JSON body:

json
{
  "question": "What is Node.js?",
  "answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."
}
Response:
{
  "message": "FAQ added successfully",
  "data": {
    "_id": "12345",
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    "translations": {
      "question": {
        "hi": "Node.js क्या है?",
        "bn": "Node.js কী?",
        "fr": "Qu'est-ce que Node.js?"
      },
      "answer": {
        "hi": "Node.js एक जावास्क्रिप्ट रनटाइम है जो क्रोम के V8 जावास्क्रिप्ट इंजन पर आधारित है।",
        "bn": "Node.js একটি জাভাস্ক্রিপ্ট রানটাইম যা ক্রোমের V8 জাভাস্ক্রিপ্ট ইঞ্জিনে তৈরি।",
        "fr": "Node.js est un environnement d'exécution JavaScript basé sur le moteur JavaScript V8 de Chrome."
      }
    }
  }
}
Get FAQs
To get all FAQs, send a GET request to /api/faqs with an optional lang query parameter. The default language is English.

Example request:

GET /api/faqs?lang=fr
Response:
json
Copy
Edit
{
  "data": [
    {
      "question": "Qu'est-ce que Node.js?",
      "answer": "Node.js est un environnement d'exécution JavaScript basé sur le moteur JavaScript V8 de Chrome."
    }
  ]
}
Cache Behavior
Translations are cached in Redis for 1 hour to speed up response times.
If a FAQ is already in the cache, it will be served directly from Redis.
