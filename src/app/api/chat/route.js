import { readFileSync } from "fs";
import { join } from "path/posix";
// import { translate } from "bing-translate-api";
import translateGoogle from "@saipulanuar/google-translate-api";
import LanguageDetect from "languagedetect";
import { NextResponse } from "next/server";
import stringSimilarity from "string-similarity";
import javaScriptIntents from "@/data/javascript";

class IntelligentAgent {
  constructor(jsonFile) {
    this.data = this.loadData(jsonFile);
    this.lngDetector = new LanguageDetect();
  }

  loadData(files) {
    const allData = [];
    for (const file of files) {
      let data;

      // بررسی نوع فایل (JSON یا JS)
      if (typeof file === "string") {
        const jsonData = readFileSync(file, "utf8");
        data = JSON.parse(jsonData).intents;
      } else {
        data = file;
      }

      allData.push(...data);
    }
    return allData;
  }

  async translateText(text, targetLanguage = "en") {
    try {
      // نشانگان برای بخش‌هایی که نمی‌خواهیم ترجمه شوند
      const noTranslateStart = "{notranslate}";
      const noTranslateEnd = "{/notranslate}";

      // پیدا کردن ابتدا و انتهای بخش‌های noTranslate
      const startIndex = text.indexOf(noTranslateStart);
      const endIndex = text.indexOf(noTranslateEnd);

      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        // جدا کردن بخش ترجمه‌نشده
        const translatablePart = text.substring(0, startIndex);
        const nonTranslatablePart = text.substring(
          startIndex + noTranslateStart.length,
          endIndex
        );
        const remainingText = text.substring(endIndex + noTranslateEnd.length);

        // انجام ترجمه برای بخش ترجمه‌شده
        const translatedTranslatablePart = (
          await translateGoogle(translatablePart, { to: targetLanguage })
        ).text;

        // ادغام بخش‌های ترجمه‌شده و ترجمه‌نشده
        const translatedText =
          translatedTranslatablePart +
          nonTranslatablePart +
          (await this.translateText(remainingText, targetLanguage));

        return translatedText;
      } else {
        // اگر نشانگان noTranslate پیدا نشد، متن را به طور کلی ترجمه کنید
        return (await translateGoogle(text, { to: targetLanguage })).text;
        //   return (await translate(text, null, targetLanguage)).translation; //BING
      }
    } catch (error) {
      console.error(error);
    }
  }

  detectLanguage(text) {
    try {
      let lan = this.lngDetector.detect(text, 1)[0][0];
      let languageList = this.lngDetector.detect(text, 10);
      for (let i = 0; i < languageList.length; i++) {
        const [language, value] = languageList[i];

        if (language === "english" && value > 0.15) {
          lan = "en";
          break; // اگر شرط برقرار باشد، حلقه را قطع می‌کنیم
        }
      }
      switch (lan) {
        case "farsi":
          lan = "fa";
          break;
        case "english":
          lan = "en";
          break;
        case "norwegian":
          lan = "en";
          break;
      }
      return lan;
    } catch (error) {
      console.error(error);
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
    const translatedQuestion =
      userLanguage === "en"
        ? question
        : await this.translateText(question, "en");
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
    const agent = new IntelligentAgent([
      join(__dirname, "..", "src", "data", "intents.json"),
      javaScriptIntents,
    ]);
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
