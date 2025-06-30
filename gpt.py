import openai

openai.api_key = "YOUR_OPENAI_API_KEY"  # ✅ Make sure this is set correctly

def generate_ai_response(prompt: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or your model
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

# gpt.py
def generate_ai_response(prompt: str) -> str:
    return f"AI says: You said '{prompt}'"

