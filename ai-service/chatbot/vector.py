import os
import psycopg2
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

# Load environment variables
load_dotenv()

DB_NAME = os.getenv("dbname")
DB_USER = os.getenv("user")
DB_PASSWORD = os.getenv("password")
DB_HOST = os.getenv("host")
DB_PORT = os.getenv("port")

CHROMA_DIR = "vectorstore"

# Embedding model
embedding_function = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Fetch products from PostgreSQL
def get_product_data():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    cur.execute("""
        SELECT p."ProductID", p."Name", p."Description", p."Price", p."ImgUrl", c."Name"
        FROM "Product" p
        JOIN "Category" c ON p."CategoryID" = c."CategoryID";
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    documents = []
    for row in rows:
        product_id, name, description, price, img_url, category = row
        text = f"Nom: {name}\nCatégorie: {category}\nDescription: {description}\nPrix: {price}€"
        metadata = {
            "product_id": product_id,
            "name": name,
            "description": description,
            "price": price,
            "img_url": img_url,
            "category": category
        }
        documents.append(Document(page_content=text, metadata=metadata))
    return documents

# Create or load Chroma vector store
def get_vector_store():
    if os.path.exists(CHROMA_DIR) and os.path.isdir(CHROMA_DIR):
        print("📦 Vector store already exists. Loading...")
        db = Chroma(
            persist_directory=CHROMA_DIR,
            embedding_function=embedding_function,
        )
    else:
        print("📦 Creating new vector store from PostgreSQL...")
        docs = get_product_data()
        db = Chroma.from_documents(
            documents=docs,
            embedding=embedding_function,
            persist_directory=CHROMA_DIR
        )
        db.persist()
        print("✅ Vector store created and saved.")
    return db

# Query using retriever with score threshold
def query_products(
    query: str,
    k: int = 5,
    threshold: float = 0.1,
    search_type: str = "similarity_score_threshold"  
):
    db = get_vector_store()
    retriever = db.as_retriever(
        search_type=search_type,
        search_kwargs={"k": k, "score_threshold": threshold}
    )
    relevant_docs = retriever.invoke(query)
    return relevant_docs

# Example usage
if __name__ == "__main__":
    question = "Je cherche des tv"
    results = query_products(question)

    print("📦 Produits pertinents :")
    if not results:
        print("❌ Aucun produit pertinent trouvé.")
    for doc in results:
        meta = doc.metadata
        print(f"- {meta['name']} ({meta['category']}) - {meta['price']}€")
        print(f"  Description : {meta['description'][:100]}...")
        print(f"  Image URL   : {meta['img_url']}\n")
        

