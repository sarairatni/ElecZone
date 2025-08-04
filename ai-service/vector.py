from langchain_ollama import OllamaEmbeddings
from langchain_core.documents import Document
from langchain_chroma import Chroma
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Vector DB location
db_location = "./chrome_langchain_db"
add_documents = not os.path.exists(db_location)

# Use mxbai for embeddings
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

if add_documents:
    print("Fetching product data from PostgreSQL...")

    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        print("✅ Connected to PostgreSQL database")

        cursor = connection.cursor()

        cursor.execute("""
            SELECT p."ProductID", p."Name", p."Description", p."Price", p."ImgUrl", c."Name"
            FROM "Product" p
            JOIN "Category" c ON p."CategoryID" = c."CategoryID";
        """)
        rows = cursor.fetchall()

        print(f"✅ Retrieved {len(rows)} products from database")
        if rows:
            print("🧾 Sample product:", rows[0])

        documents = []
        ids = []

        for row in rows:
            product_id, name, description, price, img_url, category_name = row

            content = f"""
            Name: {name}
            Description: {description}
            Price: {price}
            Category: {category_name}
            """

            documents.append(Document(page_content=content.strip()))
            ids.append(str(product_id))

        print(f"🧠 Adding {len(documents)} documents to Chroma...")

        db = Chroma.from_documents(documents, embedding=embeddings, ids=ids, persist_directory=db_location)
        # db.persist()

        cursor.close()
        connection.close()

    except Exception as e:
        print(f"❌ Database connection failed: {e}")

else:
    print("📦 Vector store already exists. Loading...")
    db = Chroma(collection_name="products", persist_directory=db_location, embedding_function=embeddings)

retriever = db.as_retriever(search_kwargs={"k": 100})
__all__ = ["retriever"]
