from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

model = OllamaLLM(model="llama3.2:1b")

template = """
You are an expert in answering questions about products.

ONLY use the following product information to answer the question. Do NOT invent products or details unless you dont have the information but mention that it is because of lack of info.

Here are the available products:
{products}

User's question:
{question}
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

while True:
    question = input("❓ Question (type 'q' to quit): ")
    if question.lower() == "q":
        break

    print("🔍 Querying vector store for relevant products...")
    docs = retriever.invoke(question)

    print("📦 Retrieved products:")
    for i, doc in enumerate(docs):
        print(f"  {i+1}. {doc.page_content[:100]}...")  # Show a preview

    print("💬 Sending to model...")
    response = chain.invoke({"products": [doc.page_content for doc in docs], "question": question})

    print("🧠 Response:")
    print(response)
