import os
import json
import requests
from dotenv import load_dotenv
from vector import retriever
from conversation_manager import ConversationManager
import time

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")
# Optional headers
HTTP_REFERER = "https://mycondor.vercel.app/"
X_TITLE = "MyApp"

template = """
You are an expert in answering questions about products.

CONVERSATION CONTEXT:
{conversation_summary}

CURRENT CONTEXT:
{current_context}

INSTRUCTIONS:
- Use the conversation history to understand context and references
- When user says "the first one", "that one", "cheaper alternative", use the context above
- Be conversational and remember what was discussed before
- If referring to previous products, mention them by name for clarity

AVAILABLE PRODUCTS:
{products}

User's current question: {question}
"""

def query_openrouter(prompt_text):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": HTTP_REFERER,
        "X-Title": X_TITLE
    }
    
    # Format pour conversation avec historique
    body = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {
                "role": "user",
                "content": prompt_text
            }
        ],
        "temperature": 0.7, 
        "max_tokens": 1000  
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(body))
        
        if response.status_code != 200:
            print("❌ Failed to get a response from OpenRouter:", response.text)
            return None
        
        data = response.json()
        return data["choices"][0]["message"]["content"]
    
    except Exception as e:
        print(f"❌ Error calling OpenRouter API: {e}")
        return None

conversation_manager = ConversationManager()

while True:
    question = input("❓ Question (type 'q' to quit): ")
    if question.lower() == "q":
        break
    
    conversation_manager.add_message("user", question)
    
    enhanced_query = conversation_manager.enhance_query(question)
    if enhanced_query != question:
        print(f"🔍 Enhanced query: {enhanced_query}")
    
    print("🔍 Querying vector store for relevant products...")
    docs = retriever.invoke(enhanced_query)
    print(f"📦 Retrieved {len(docs)} product(s).")
    
    # Mettre à jour le contexte
    conversation_manager.update_context(question, docs)
    
    print("📦 Retrieved products:")
    product_texts = []
    for i, doc in enumerate(docs):
        print(f"  {i+1}. {doc.page_content}\n")
        product_texts.append(doc.page_content)
    
    # Créer le prompt avec contexte
    prompt = template.format(
        conversation_summary=conversation_manager.get_conversation_summary(),
        current_context=conversation_manager.get_current_context_summary(),
        products="\n\n".join(product_texts), 
        question=question
    )
    
    print("💬 Sending to model...")
    response = query_openrouter(prompt)
    
    if response:
        # Ajouter la réponse à l'historique
        conversation_manager.add_message("assistant", response)
        
        print("🧠 Response:")
        print(response)
        print("-" * 50)  # Séparateur pour plus de clarté
    else:
        print("❌ No response received from the model")