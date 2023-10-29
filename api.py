import openai

openai.api_key = "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"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
    {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
  ]
)

print(completion.choices[0].message)





curl -k https://api.openai.com/v1/chat/completions   -H "Content-Type: application/json"   -H "Authorization: Bearer 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"   -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "miku."
      }
    ]
  }'


curl -k https://13.209.7.147/   -H "Content-Type: application/json"   -H "Authorization: Bearer $OPENAI_API_KEY"   -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."
      },
      {
        "role": "user",
        "content": "Compose a poem that explains the concept of recursion in programming."
      }
    ]
  }'