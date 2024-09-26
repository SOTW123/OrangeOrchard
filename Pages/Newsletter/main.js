import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function fetchArticles() {
  const prompt =
    "AT LEAST 20 ARTICLES with 100 words each content: Generate a simple json array of articles about an orange orchard, each with 'title' and 'content' fields. No explanation, just syntactically correct JSON code.";
  try {
    const result = await model.generateContent(prompt);
    const res = result.response
      .text()
      .replace(/^```json\s*/g, "")
      .replace(/```$/g, "")
      .trim();
    const articles = JSON.parse(res);
    displayArticles(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
}

function displayArticles(articles) {
  const articlesContainer = document.getElementById("articles-container");
  articles.forEach((article) => {
    const articleDiv = document.createElement("div");
    articleDiv.className = "article";

    const titleDiv = document.createElement("div");
    titleDiv.className = "title";
    titleDiv.innerText = article.title;
    titleDiv.onclick = () => toggleContent(titleDiv);

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    contentDiv.innerHTML = `<p>${article.content}</p>`;

    articleDiv.appendChild(titleDiv);
    articleDiv.appendChild(contentDiv);
    articlesContainer.appendChild(articleDiv);
  });
}

function toggleContent(element) {
  const content = element.nextElementSibling;
  content.classList.toggle("show");
}

// Call fetchArticles() to load articles from Gemini on page load
fetchArticles();

document.addEventListener("keydown", (event) => {
  if (event.code == "Escape") {
    window.location.href = "/";
  }
});
