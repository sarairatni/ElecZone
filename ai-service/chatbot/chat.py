from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from configs.llm_config import create_model, get_system_message
from vector import query_products  

def docs_to_context(docs):
    """Format relevant documents into readable context."""
    context = ""
    for doc in docs:
        meta = doc.metadata
        context += f"- {meta['name']} ({meta['category']}) - {meta['price']}€\n"
        context += f"  Description: {meta['description'][:150]}...\n"
    return context.strip()

def main():
    model = create_model()
    chat_history = []

    system_message = SystemMessage(content=get_system_message())
    chat_history.append(system_message)

    print("Chat started! Type 'exit' to quit.")
    print("-" * 40)

    while True:
        question = input("You: ")
        if question.lower() == "exit":
            break

        # ✅ Query vector store for relevant products
        relevant_docs = query_products(
        query=question,
        k=5,
        threshold=0.2,
        search_type="similarity_score_threshold"  # or just "similarity"
    )
        context_text = docs_to_context(relevant_docs)

        # ✅ Inject context before user's question
        if context_text:
            context_intro = "Here are some related products:\n"
            chat_history.append(HumanMessage(content=context_intro + context_text))

        # Then add actual user question
        chat_history.append(HumanMessage(content=question))

        try:
            result = model.invoke(chat_history)
            response = result.content
            chat_history.append(AIMessage(content=response))
            print(f"AI: {response}")

        except Exception as e:
            print(f"Error: {e}")
            chat_history.pop()

    print("\n---- Message History ----")
    for i, message in enumerate(chat_history):
        msg_type = type(message).__name__
        print(f"{i+1}. {msg_type}: {message.content[:100]}...")

if __name__ == "__main__":
    main()
