import time
import textwrap
import google.generativeai as genai

GOOGLE_API_KEY=open('key.txt').read().strip()
genai.configure(api_key=GOOGLE_API_KEY)

text_embedding_model = 'models/embedding-001'

def make_prompt(query, relevant_passage):
  request = genai.embed_content(
      model=text_embedding_model,
      content=query,
      task_type="retrieval_query"
  )
  escaped = relevant_passage.replace("'", "").replace('"', "").replace("\n", " ")
  prompt = textwrap.dedent("""You are a helpful and informative bot that answers questions using text from the reference passage included below. \
  Be sure to respond in a complete sentence, being comprehensive, including all relevant background information. \
  However, you are talking to a non-technical audience, so be sure to break down complicated concepts and \
  strike a friendly and converstional tone. \
  If the passage is irrelevant to the answer, you may ignore it.
  QUESTION: '{query}'
  PASSAGE: '{relevant_passage}'

    ANSWER:
  """).format(query=query, relevant_passage=escaped)

  return prompt

def get_answer(query, passage):
    #choose available gemini models
    # for m in genai.list_models():
    #   if 'generateContent' in m.supported_generation_methods:
    #     print(m.name)
    model = genai.GenerativeModel('models/gemini-1.5-flash')
    prompt = make_prompt(query, passage)
    print(prompt)

    time.sleep(2)
    answer = model.generate_content(prompt)

    return answer.text