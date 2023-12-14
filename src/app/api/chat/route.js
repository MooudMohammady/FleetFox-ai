import { readFileSync } from "fs";
import { join } from "path/posix";
// import { translate } from "bing-translate-api";
import translateGoogle from "@saipulanuar/google-translate-api";
import LanguageDetect from "languagedetect";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";

class IntelligentAgent {
  constructor(jsonFile) {
    this.data = this.loadData(jsonFile);
    this.lngDetector = new LanguageDetect();
  }

  loadData(jsonFile) {
    const data = readFileSync(jsonFile, "utf8");
    return JSON.parse(data).intents;
  }

  async translateText(text, targetLanguage = "en") {
    try {
        return (await translateGoogle(text, { to: targetLanguage })).text
        //   return (await translate(text, null, targetLanguage)).translation; //BING
    } catch (error) {
      console.error(error);
    }
  }

  detectLanguage(text) {
    try {
      let lan = this.lngDetector.detect(text, 1)[0][0];
      switch (lan) {
        case "farsi":
          lan = "fa";
          break;
        case "english":
          lan = "en";
          break;
      }
      return lan;
    } catch (error) {
      return "en";
    }
  }

  findSimilarQuestion(question) {
    const questions = this.data.map((intent) => intent.patterns).flat();
    const matches = stringSimilarity.findBestMatch(question, questions);

    // اگر مشابهت بیش از حد مشخصه، یک سوال مشابه برمی‌گردانیم
    if (matches.bestMatch.rating > 0.2) {
      return matches.bestMatch.target;
    }
    return null;
  }

  async answerQuestion(question) {
    const userLanguage = this.detectLanguage(question);

    console.log("Your language is : ", userLanguage);
    const translatedQuestion = userLanguage === 'en' ? question : await this.translateText(question, "en");
    console.log("Your question (EN) : ", translatedQuestion);

    // جستجوی مشابهت در سوالات
    const similarQuestion = this.findSimilarQuestion(translatedQuestion);
    console.log("Your question in my dataset : ", similarQuestion);
    if (similarQuestion) {
      const intent = this.data.find((intent) =>
        intent.patterns.includes(similarQuestion)
      );
      if (intent) {
        const response =
          intent.responses[Math.floor(Math.random() * intent.responses.length)];
        const translatedAnswer = await this.translateText(
          response,
          userLanguage
        );
        return translatedAnswer;
      }
    }

    // جستجو در سوالات با ترجمه انجام شده
    const intent = this.data.find((intent) =>
      intent.patterns.includes(translatedQuestion)
    );
    if (intent) {
      const response =
        intent.responses[Math.floor(Math.random() * intent.responses.length)];
      const translatedAnswer = await this.translateText(response, userLanguage);
      return translatedAnswer;
    }

    return await this.translateText("متاسفانه جوابی پیدا نشد.", userLanguage);
  }
}

export async function POST(req) {
  const { question } = await req.json();
  console.log("-------------\n", question);

  try {
    // TODO: Create an instance of IntelligentAgent and call the answerQuestion method
    const agent = new IntelligentAgent(
      join(__dirname, "..", "src", "data", "intents.json")
    );
    const translatedAnswer = await agent.answerQuestion(question);

    return new NextResponse(
      JSON.stringify({
        answer: translatedAnswer,
      })
    );
  } catch (error) {
    throw error;
  }
}
