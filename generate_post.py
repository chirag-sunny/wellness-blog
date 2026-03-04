import os
import json
import openai
from datetime import date

client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": (
                "Write a short, informative health and wellness article "
                "(200-300 words). Include a catchy title and a brief summary. "
                "Return JSON with keys: title, summary, content, date."
            )
        }
    ],
    response_format={"type": "json_object"}
)

article = json.loads(response.choices[0].message.content)
article["date"] = str(date.today())

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
