import os
import json
import google.generativeai as genai
from datetime import date

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel("gemini-2.0-flash-lite")

prompt = (
    "Write a short, informative health and wellness article (200-300 words). "
    "Include a catchy title and a brief summary. "
    "Return only valid JSON with exactly these keys: title, summary, content, date. "
    "Do not include any markdown formatting or code fences."
)

response = model.generate_content(prompt)
raw = response.text.strip()

# Strip markdown code fences if present
if raw.startswith("```"):
    raw = raw.split("```")[1]
    if raw.startswith("json"):
        raw = raw[4:]
    raw = raw.strip()

article = json.loads(raw)
article["date"] = str(date.today())

# Load existing posts and prepend the new one
posts_file = "posts.json"
try:
    with open(posts_file, "r") as f:
        posts = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    posts = []

posts.insert(0, article)

with open(posts_file, "w") as f:
    json.dump(posts, f, indent=2)

print(f"Generated article: {article['title']}")
