import fitz  # PyMuPDF
import re
import json
import os
import math
import pytesseract
from PIL import Image
import cv2
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
def starter(file_path):
 
    # Determine file type and extract text accordingly
    if file_path.lower().endswith('.pdf'):
        text = extract_pdf_text(file_path)
    elif file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        text = extract_image_text(file_path)
    else:
        raise ValueError("Unsupported file format")
    
    # Try to detect if it's Anna University or GRT IET format
    if "Anna University" in text or "OFFICE OF THE CONTROLLER OF EXAMINATIONS" in text:
        data = parse_anna_university_data(text)
        college = "anna_university"
    else:
        data = parse_student_data(text)  # Original GRT IET parser
        college = "grt_iet"
    
    # Load credits from credit.json
    with open("Credits.json", 'r') as f:
        credit_data = json.load(f)
        print(credit_data)
    
    credit_dict = {entry["SUBJECT_CODE"]: entry["CREDITS"] for entry in credit_data}
    
    # Add credits to each course only if subject code exists
    final_courses = []
    for course in data["Courses"]:
        code = course["Course Code"]
        if code in credit_dict:
            final_courses.append({
                "Credits": credit_dict[code],
                "Grade": course["Grade"],
                "Course Name": course.get("Course Name", ""),
                "Course Code": code
            })
    
    final_data = {
        "Courses": final_courses,
        "Student Info": data["Student Info"]
    }
    
    # Calculate CGPA
    final_result = calculate_cgpa(final_data)
    
    # Return comprehensive result
    return {
        "cgpa": final_result,
        "student_info": data["Student Info"],
        "courses": final_courses,
        "total_credits": sum(course["Credits"] for course in final_courses),
        "college": college
    }

def extract_pdf_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_image_text(image_path):
   
    img = cv2.imread(image_path)
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))
    processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    # Apply OCR
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(processed, config=custom_config)
    return text


def parse_student_data(text):
    lines = text.split('\n')

    student_info = {
        "Student_Name": "Unknown",
        "Register_Number": "Unknown",
        "Branch": "Unknown",
        "D.O.B": "Unknown"
    }
    courses = []
    current_sem = ""
    
    for i, line in enumerate(lines):
        line = line.strip()

        # Extract Student Info
        if "Student Name" in line and i + 1 < len(lines):
            student_info['Student_Name'] = lines[i + 1].lstrip(':').strip()
        elif "Register Number" in line:
            match = re.search(r'Register Number\s*[:\-]?\s*(\d{12})', line)
            if match:
                student_info['Register_Number'] = match.group(1)
        elif "Branch" in line and i + 1 < len(lines):
            student_info['Branch'] = lines[i + 1].strip(": ")
        elif "D.O.B" in line:
            match = re.search(r'D\.O\.B\s*[:\-]?\s*(\d{2}-\d{2}-\d{4})', line)
            if match:
                student_info['D.O.B'] = match.group(1)

        # Check for new semester header
        if re.match(r'^\d+\s*SEM', line):
            current_sem = line.strip()

        # Try to match a course entry
        if current_sem and i + 2 < len(lines):
            course_code = lines[i].strip()
            course_name = lines[i + 1].strip()
            grade = lines[i + 2].strip()

            if re.match(r'^[A-Z]{2,4}\d{1,6}$', course_code) and grade in ['O', 'A+', 'A', 'B+', 'B','C','C+', 'RA']:
                courses.append({
                    "Semester": current_sem,
                    "Course Code": course_code,
                    "Course Name": course_name,
                    "Grade": grade
                })

    return {
        "Student Info": student_info,
        "Courses": courses
    }


def parse_anna_university_data(text):
    lines = text.split('\n')

    student_info = {
        "Student_Name": "Unknown",
        "Register_Number": "Unknown",
        "Branch": "Unknown",
        "D.O.B": "Unknown"
    }
    courses = []
    current_sem = ""
    
    for i, line in enumerate(lines):
        line = line.strip()

        # Extract Student Info
        if "Student Name" in line and i + 1 < len(lines):
            student_info['Student_Name'] = lines[i + 1].lstrip(':').strip()
        elif "Register Number" in line:
            match = re.search(r'Register Number\s*[:\-]?\s*(\d{12})', line)
            if match:
                student_info['Register_Number'] = match.group(1)
        elif "Branch" in line and i + 1 < len(lines):
            student_info['Branch'] = lines[i + 1].strip(": ")
        elif "D.O.B" in line:
            match = re.search(r'D\.O\.B\s*[:\-]?\s*(\d{2}-\d{2}-\d{4})', line)
            if match:
                student_info['D.O.B'] = match.group(1)

        # Check for new semester header
        if re.match(r'^\d+\s*SEM', line):
            current_sem = line.strip()

        # Try to match a course entry
        if current_sem and i + 2 < len(lines):
            course_code = lines[i].strip()
            course_name = lines[i + 1].strip()
            grade = lines[i + 2].strip()

            if re.match(r'^[A-Z]{2,4}\d{1,6}$', course_code) and grade in ['O', 'A+', 'A', 'B+', 'B','C','C+', 'RA']:
                courses.append({
                    "Semester": current_sem,
                    "Course Code": course_code,
                    "Course Name": course_name,
                    "Grade": grade
                })

    return {
        "Student Info": student_info,
        "Courses": courses
    }

def calculate_cgpa(final_data):

    calculation = {"O":10, "A+":9, "A":8, "B+":7, "B":6, "C+":5, "C":4, "RA":0}
    calculation_result=0
    total_credits = 0
    for i in range(len(final_data["Courses"])):
        temp_grade_holder = final_data["Courses"][i]["Grade"]
        temp_credit_holder = final_data["Courses"][i]["Credits"] 
        total_credits += temp_credit_holder
        calculation_result += calculation[temp_grade_holder] * temp_credit_holder
    
    final_result =round((calculation_result/total_credits),3)
    
    return (str(format(final_result,".2f")))