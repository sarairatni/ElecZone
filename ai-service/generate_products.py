import psycopg2
from dotenv import load_dotenv
import os
from faker import Faker
import random

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Initialize Faker
fake = Faker(['fr_FR', 'en_US'])  # Mix français et anglais

# Définir les catégories avec des termes spécifiques pour la génération
CATEGORIES = {
    1: {
        'name': 'Téléphones',
        'prefixes': ['Smart', 'Pro', 'Ultra', 'Max', 'Plus', 'Elite', 'Prime'],
        'suffixes': ['Phone', 'Mobile', 'Cell', 'Device', 'Smartphone'],
        'tech_words': ['5G', 'AI', 'Quantum', 'Nano', 'Turbo', 'Infinity']
    },
    2: {
        'name': 'Réfrigérateur',
        'prefixes': ['Cool', 'Fresh', 'Ice', 'Frost', 'Chill', 'Arctic', 'Zero'],
        'suffixes': ['Fridge', 'Cooler', 'Refrigerator', 'Fresh', 'Box'],
        'tech_words': ['Eco', 'Smart', 'Digital', 'Auto', 'Multi', 'Twin']
    },
    3: {
        'name': 'Laptops',
        'prefixes': ['Book', 'Pad', 'Pro', 'Air', 'Ultra', 'Slim', 'Power'],
        'suffixes': ['Book', 'Pad', 'Top', 'Machine', 'Station', 'Elite'],
        'tech_words': ['Core', 'Turbo', 'Quantum', 'Speed', 'Performance', 'Gaming']
    },
    4: {
        'name': 'Cameras',
        'prefixes': ['Focus', 'Snap', 'Shot', 'Lens', 'Vision', 'Photo', 'Image'],
        'suffixes': ['Cam', 'Shot', 'Focus', 'Lens', 'Vision', 'Pro'],
        'tech_words': ['HD', '4K', '8K', 'Pro', 'Ultra', 'Zoom', 'Digital']
    },
    5: {
        'name': 'Cuisinière',
        'prefixes': ['Cook', 'Chef', 'Master', 'Gourmet', 'Kitchen', 'Culinary'],
        'suffixes': ['Cook', 'Chef', 'Master', 'Pro', 'Elite', 'Station'],
        'tech_words': ['Induction', 'Gas', 'Electric', 'Smart', 'Auto', 'Digital']
    },
    6: {
        'name': 'Air Conditioners',
        'prefixes': ['Cool', 'Air', 'Climate', 'Comfort', 'Fresh', 'Breeze'],
        'suffixes': ['Air', 'Cool', 'Climate', 'Comfort', 'System', 'Unit'],
        'tech_words': ['Inverter', 'Eco', 'Smart', 'Silent', 'Turbo', 'Auto']
    },
    8: {
        'name': 'TVs',
        'prefixes': ['Vision', 'View', 'Screen', 'Display', 'Smart', 'Ultra'],
        'suffixes': ['TV', 'Vision', 'Display', 'Screen', 'View', 'Entertainment'],
        'tech_words': ['4K', '8K', 'OLED', 'QLED', 'HDR', 'Smart', 'Ultra']
    }
}

def generate_faker_product_name(category_id):
    """Génère un nom de produit entièrement avec Faker"""
    category_info = CATEGORIES[category_id]
    
    # Différentes façons de générer un nom
    generation_methods = [
        # Méthode 1: Marque + Préfixe + Suffixe
        lambda: f"{fake.company().split()[0]} {random.choice(category_info['prefixes'])}{random.choice(category_info['suffixes'])}",
        
        # Méthode 2: Marque + Tech Word + Modèle
        lambda: f"{fake.company().split()[0]} {random.choice(category_info['tech_words'])} {fake.word().capitalize()}",
        
        # Méthode 3: Préfixe + Tech Word + Nombre
        lambda: f"{random.choice(category_info['prefixes'])}{random.choice(category_info['tech_words'])} {random.randint(100, 9999)}",
        
        # Méthode 4: Marque + Préfixe + Tech Word
        lambda: f"{fake.last_name()} {random.choice(category_info['prefixes'])} {random.choice(category_info['tech_words'])}",
        
        # Méthode 5: Tech Word + Marque + Suffixe
        lambda: f"{random.choice(category_info['tech_words'])} {fake.company().split()[0]} {random.choice(category_info['suffixes'])}",
        
        # Méthode 6: Couleur + Préfixe + Suffixe
        lambda: f"{fake.color_name().capitalize()} {random.choice(category_info['prefixes'])}{random.choice(category_info['suffixes'])}",
        
        # Méthode 7: Année + Marque + Modèle
        lambda: f"{random.randint(2020, 2024)} {fake.last_name()} {random.choice(category_info['prefixes'])} {random.choice(category_info['tech_words'])}"
    ]
    
    # Choisir une méthode aléatoire
    chosen_method = random.choice(generation_methods)
    name = chosen_method()
    
    # Nettoyer le nom (enlever les caractères spéciaux, limiter la longueur)
    name = ''.join(char for char in name if char.isalnum() or char.isspace())
    name = ' '.join(name.split())  # Normaliser les espaces
    
    return name[:50]  # Limiter à 50 caractères

def generate_faker_description():
    """Génère une description entièrement avec Faker"""
    
    # Composants de description
    opening_phrases = [
        fake.catch_phrase(),
        f"Découvrez {fake.bs()}",
        f"Innovation {fake.word()}",
        f"Technologie {fake.word()} avancée"
    ]
    
    features = [
        f"✓ {fake.bs()}",
        f"✓ Design {fake.color_name()}",  
        f"✓ Garantie {random.choice(['1 an', '2 ans', '3 ans', '5 ans'])}",
        f"✓ {fake.catch_phrase()}",
        f"✓ Efficacité énergétique {random.choice(['A+', 'A++', 'A+++'])}",
        f"✓ {fake.company()} certified",
        f"✓ Livraison {fake.city()}"
    ]
    
    closing_phrases = [
        fake.sentence(),
        f"Parfait pour {fake.bs()}",
        f"Idéal pour {fake.job().lower()}",
        "Satisfaction garantie ou remboursé"
    ]
    
    # Construire la description
    description_parts = [
        random.choice(opening_phrases),
        " • ".join(random.sample(features, 3)),
        random.choice(closing_phrases)
    ]
    
    return " | ".join(description_parts)

def generate_image_url():
    """Génère une URL d'image aléatoire"""
    width = random.choice([400, 500, 600])
    height = random.choice([300, 400, 500])
    category = random.choice(['tech', 'electronics', 'gadgets', 'devices'])
    return f"https://picsum.photos/{width}/{height}?random={random.randint(1, 1000)}&category={category}"

def generate_faker_product_for_category(category_id):
    """Génère un produit entièrement avec Faker pour une catégorie donnée"""
    
    # Nom généré avec Faker
    name = generate_faker_product_name(category_id)
    
    # Prix selon la catégorie
    price_ranges = {
        1: (200, 1500),    # Téléphones
        2: (800, 3000),    # Réfrigérateur
        3: (600, 3500),    # Laptops
        4: (300, 4000),    # Cameras
        5: (400, 2500),    # Cuisinière
        6: (500, 2000),    # Air Conditioners
        8: (400, 2500)     # TVs
    }
    
    min_price, max_price = price_ranges.get(category_id, (100, 1000))
    price = round(random.uniform(min_price, max_price), 2)
    
    # Description générée avec Faker
    description = generate_faker_description()
    
    return {
        'name': name,
        'description': description[:500],  # Limiter la longueur
        'price': price,
        'img_url': generate_image_url(),
        'category_id': category_id
    }

def insert_products_to_db(products):
    """Insère les produits dans la base de données"""
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        print("✅ Connexion à la base de données réussie!")
        
        cursor = connection.cursor()
        
        # Préparer la requête d'insertion
        insert_query = """
        INSERT INTO "Product" ("Name", "Description", "Price", "ImgUrl", "CategoryID")
        VALUES (%s, %s, %s, %s, %s)
        RETURNING "ProductID";
        """
        
        inserted_products = []
        
        for i, product in enumerate(products, 1):
            try:
                cursor.execute(insert_query, (
                    product['name'],
                    product['description'],
                    product['price'],
                    product['img_url'],
                    product['category_id']
                ))
                
                product_id = cursor.fetchone()[0]
                inserted_products.append({**product, 'product_id': product_id})
                
                print(f"✅ Produit {i}/30 inséré: {product['name']} (ID: {product_id}) - {product['price']}€")
                
            except Exception as e:
                print(f"❌ Erreur lors de l'insertion du produit {i}: {e}")
                connection.rollback()
                continue
        
        # Confirmer toutes les insertions
        connection.commit()
        
        print(f"\n🎉 {len(inserted_products)} produits ont été insérés avec succès!")
        
        # Afficher un résumé par catégorie
        print("\n📊 Résumé par catégorie:")
        for cat_id in CATEGORIES.keys():
            products_in_cat = [p for p in inserted_products if p['category_id'] == cat_id]
            count = len(products_in_cat)
            if count > 0:
                avg_price = sum(p['price'] for p in products_in_cat) / count
                print(f"  • {CATEGORIES[cat_id]['name']}: {count} produits (Prix moyen: {avg_price:.2f}€)")
        
        # Fermer la connexion
        cursor.close()
        connection.close()
        print("\n🔒 Connexion fermée.")
        
        return inserted_products
        
    except Exception as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        return []

def main():
    """Fonction principale"""
    print("🚀 Génération de 30 produits avec Faker UNIQUEMENT...")
    print("=" * 50)
    
    products = []
    
    # Distribuer les 30 produits sur les 7 catégories de manière équilibrée
    products_per_category = 30 // len(CATEGORIES)  # 4 produits par catégorie
    remaining_products = 30 % len(CATEGORIES)      # 2 produits supplémentaires
    
    for category_id in CATEGORIES.keys():
        # Ajouter le nombre de base de produits pour cette catégorie
        for _ in range(products_per_category):
            product = generate_faker_product_for_category(category_id)
            products.append(product)
        
        # Ajouter un produit supplémentaire pour les premières catégories
        if remaining_products > 0:
            product = generate_faker_product_for_category(category_id)
            products.append(product)
            remaining_products -= 1
    
    # Mélanger les produits pour un ordre aléatoire
    random.shuffle(products)
    
    print(f"📦 {len(products)} produits générés avec Faker!")
    print("\n💾 Insertion dans la base de données...")
    
    # Afficher quelques exemples avant insertion
    print("\n📋 Exemples de noms générés par Faker:")
    for i, product in enumerate(random.sample(products, min(5, len(products))), 1):
        cat_name = CATEGORIES[product['category_id']]['name']
        print(f"  {i}. {product['name']} - {product['price']}€ ({cat_name})")
    
    # Insérer les produits dans la base de données
    inserted_products = insert_products_to_db(products)
    
    if inserted_products:
        print("\n🏆 Génération terminée avec succès!")
    else:
        print("\n❌ Aucun produit n'a pu être inséré.")

if __name__ == "__main__":
    main()