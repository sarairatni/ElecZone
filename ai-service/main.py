from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

model = OllamaLLM(model="llama3.2:1b")

template = """
You are an expert in answering questions about products.

Here are the products available: {products}

Here is the question to answer: {question}
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
