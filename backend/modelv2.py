import fitz  # PyMuPDF
import re
import json
import os
import cv2


def starter(file_path):
 
    # Determine file type and extract text accordingly
    if file_path.lower().endswith('.pdf'):
        text = extract_pdf_text(file_path)
    elif file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        text = extract_image_text(file_path)
        data = structure_text(text, "image")
      
    else:
        raise ValueError("Unsupported file format")

    if "coe.annauniv.edu" in text or "OFFICE OF THE CONTROLLER OF EXAMINATIONS" in text:
        data = parse_anna_university_data(text)
        college = "anna_university"
    else:
        data = parse_student_data(text)
        college = "grt_iet"

    with open("Credits.json", 'r') as f:
        credit_data = json.load(f)
    
    credit_dict = {entry["SUBJECT_CODE"]: entry["CREDITS"] for entry in credit_data}
    
    # ~ Add credits to each course only if subject code exists
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
    try:
        if not os.path.exists(image_path):
            raise ValueError(f"Image file not found at {image_path}")

        img = cv2.imread(image_path)

        if img is None:
            raise ValueError(f"Failed to load image from {image_path}")

        # Preprocessing
        resized_img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        gray = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

        reader = easyocr.Reader(['en'], gpu=True)

        results = reader.readtext(denoised)
        # Convert OCR results to a single string (similar to PDF text)
        extracted_text = "\n".join([res[1] for res in results])
        
        return extracted_text

    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return ""


def structure_text(text, source="default"):
  
    lines = text.split('\n')
    student_info = {
        "Student_Name": "Unknown",
        "Register_Number": "Unknown",
        "Branch": "Unknown",
        "D.O.B": "Unknown"
    }
    courses = []
    current_sem = ""

  # Default case (including when source is "image")
    for i, line in enumerate(lines):
        line = line.strip()
        # Extract Student Info
        if "NAME OF THE STUDENT" in line and i + 1 < len(lines):
            student_info['Student_Name'] = lines[i + 1].lstrip(':').strip()
            if("REGISTER NO." in lines[i + 1].lstrip(':').strip()):
                student_name_line = line.strip()

                name_parts = student_name_line.split(" : ")
            
                if len(name_parts) > 1:
                    student_info['Student_Name'] = name_parts[1].strip()
                elif i + 1 < len(lines):
                    student_info['Student_Name'] = lines[i + 1].strip()
                
        elif "REGISTER NO." in line:
            match = re.search(r'(\d{12})', line)
            if match:
                student_info['Register_Number'] = match.group(1)
            elif(re.search(r'(\d{12})', lines[i+1])):
                match2 = re.search(r'(\d{12})', lines[i+1])
                
                student_info['Register_Number'] = match2.group(1) 
                
        elif "BRANCH" in line and i + 1 < len(lines):
            student_info['Branch'] = lines[i + 1].strip()
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
            if re.match(r'^[A-Z]{2,4}\d{2,6}$', course_code) and grade in [
                'O', 'A+', 'A', 'B+', 'B', 'C', 'C+', 'RA']:
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
    if(total_credits == 0):
        return "NA"
    final_result =round((calculation_result/total_credits),3)
    
    return (str(format(final_result,".2f")))