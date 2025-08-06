import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain.schema.output_parser import StrOutputParser 

from configs.llm_config import create_model
model = create_model()
# template = "List me some products from category {category}."
# prompt_template = ChatPromptTemplate.from_template(template)
messages = [
    ("system""You are an ai assistant that helps the clients buying products of category {category}."),
    ("human","List me three products"),
    ("ai","Here are the products:")
]

print("-----Prompt from Template-----")
prompt_template = ChatPromptTemplate.from_messages(messages)
# prompt = prompt_template.invoke({"category": "Laptops"})

# chain
chain = prompt_template | model | StrOutputParser()

response = chain.invoke({"category": "Laptops"})
print("-----Response-----")
print(response)
# print(prompt)