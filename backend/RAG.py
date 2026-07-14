import os
import json
from config import GOOGLE_API_KEY
from GPA_Compute import calculate_cgpa, calculate_total_credits
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.output_parsers import JsonOutputParser

if not GOOGLE_API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY environment variable is not set in config."
    )

llm_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0.0,
    google_api_key=GOOGLE_API_KEY,
)

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=GOOGLE_API_KEY,
)

# Load Credits data for direct exact lookup and fallback indexing
backend_dir = os.path.dirname(os.path.abspath(__file__))
credits_paths = [
    os.path.join(backend_dir, 'Credits.json'),
    os.path.join(backend_dir, 'Resource', 'Credits.json'),
]
credits_data = None
for cp in credits_paths:
    if os.path.exists(cp):
        with open(cp, 'r') as f:
            credits_data = json.load(f)
        break

if credits_data is None:
    raise FileNotFoundError("Credits.json not found in backend or backend/Resource directories.")

credits_lookup = {entry['SUBJECT_CODE']: entry['CREDITS'] for entry in credits_data}


# Monkey-patch to handle Gemini embedding API rate limits (RESOURCE_EXHAUSTED)
original_embed_documents = embedding_model.embed_documents
def rate_limited_embed_documents(texts):
    import time
    retries = 5
    delay = 10
    for i in range(retries):
        try:
            return original_embed_documents(texts)
        except Exception as e:
            if "RESOURCE_EXHAUSTED" in str(e) or "429" in str(e):
                print(f"Rate limit hit. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay += 10
            else:
                raise e
    raise RuntimeError("Failed to embed documents after multiple retries due to rate limits.")
object.__setattr__(embedding_model, 'embed_documents', rate_limited_embed_documents)


# ==========================
# Load FAISS Index
# ==========================

INDEX_PATH = os.path.join(backend_dir, "faiss_index")

if os.path.exists(INDEX_PATH):
    vector_db = FAISS.load_local(
        INDEX_PATH,
        embedding_model,
        allow_dangerous_deserialization=True,
    )
else:
    raise FileNotFoundError(
        f"FAISS index not found at '{INDEX_PATH}'. Please run 'python Embedded.py' first "
        "to generate the vector database index."
    )

retriever = vector_db.as_retriever(
    search_kwargs={"k": 6}
)

# ==========================
# Prompts & Chains
# ==========================


# First AI Call: Extract raw course code/grade and student information
extract_prompt = ChatPromptTemplate.from_messages(
    [
        HumanMessagePromptTemplate.from_template(
            """You are an expert transcript data extractor.
            
Analyze the user's transcript text and extract:
1. Student Information:
   - Student_Name (Name of the student)
   - Register_Number (12-digit registration/register number)
   - Branch (e.g. Computer Science and Engineering, etc.)
   - D.O.B (Date of birth if present, otherwise "Unknown")
2. College classification: Set to "anna_university" if the text contains Anna University keywords or headers, otherwise set to "grt_iet".
3. Courses details: Extract EVERY course that has a valid alphabetical grade (O, A+, A, B+, B, C+, C, RA). Skip COMPLETED or other status grades.
   For each course, extract:
   - SUBJECT_CODE (alphanumeric code like CS3401, CCS346, etc.)
   - SUBJECT_GRADE (the letter grade like O, A+, A, etc.)

Return ONLY a valid JSON object matching the format below. Do not include any markdown or explanation.

JSON Format:
{{
    "student_info": {{
        "Student_Name": "NAME",
        "Register_Number": "REG_NUMBER",
        "Branch": "BRANCH",
        "D.O.B": "DOB_OR_UNKNOWN"
    }},
    "college": "anna_university_or_grt_iet",
    "answer": [
        {{
            "SUBJECT_CODE": "SUBJECT_CODE_1",
            "SUBJECT_GRADE": "GRADE_1"
        }},
        {{
            "SUBJECT_CODE": "SUBJECT_CODE_2",
            "SUBJECT_GRADE": "GRADE_2"
        }}
    ]
}}

Input Transcript:
{user_input}"""
        )
    ]
)

extract_chain = (
    extract_prompt
    | llm_model
    | JsonOutputParser()
)

# ==========================
# Pipeline
# ==========================

def run_pipeline(user_input: str):
    # 1. First AI call: Extract info and raw courses
    extracted = extract_chain.invoke({"user_input": user_input})
    
    student_info = extracted.get("student_info", {
        "Student_Name": "Unknown",
        "Register_Number": "Unknown",
        "Branch": "Unknown",
        "D.O.B": "Unknown"
    })
    college = extracted.get("college", "grt_iet")
    raw_subjects = extracted.get("answer", [])
    
    # 2. Retrieve credits (direct exact lookup, fallback to retriever)
    final_courses = []
    
    for subject in raw_subjects:
        code = subject.get("SUBJECT_CODE")
        grade = subject.get("SUBJECT_GRADE")
        if not code or not grade:
            continue
            
        normalized_grade = str(grade).strip().upper()
        
        # Look up credit
        credit = 0.0
        if code in credits_lookup:
            credit = float(credits_lookup[code])
        else:
            docs = retriever.invoke(code)
            if docs:
                credit = float(docs[0].metadata.get("credits", 0.0))
                code = docs[0].metadata.get("subject_code", code)
        
        final_courses.append({
            "Credits": credit,
            "Grade": normalized_grade,
            "Course Name": "",  
            "Course Code": code
        })
    print(final_courses)

    # 3. Calculate CGPA using math in Python
    cgpa = calculate_cgpa({"Courses": final_courses})
    total_credits = calculate_total_credits(final_courses)
        
    return {
        "cgpa": cgpa,
        "student_info": student_info,
        "courses": final_courses,
        "total_credits": int(total_credits),
        "college": college
    }
