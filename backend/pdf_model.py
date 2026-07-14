import fitz  # PyMuPDF
import re
import json
from GPA_Compute import calculate_cgpa, calculate_total_credits

def pdf_starter(file_path):
    
    text = extract_pdf_text(file_path)
    data = parse_student_data(text)
    college = "grt_iet"

    with open("Resource/Credits.json", 'r') as f:
        credit_data = json.load(f)
    
  
    credit_dict = {entry["SUBJECT_CODE"]: float(entry["CREDITS"]) for entry in credit_data}
   
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
    
    final_result = calculate_cgpa(final_data)
    return {
        "cgpa": final_result,
        "student_info": data["Student Info"],
        "courses": final_courses,
        "total_credits": calculate_total_credits(final_courses),
        "college": college
    }

def extract_pdf_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
   
    return text

def structure_text(text, source="default"):
  
    lines = text.split('\n')
    student_info = {
        "Student_Name": "Unknown",
        "Register_Number": "Unknown",
        "Branch": "Unknown",
        "D.O.B": "Unknown"
    }
    courses = []
    current_sem = None
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
        if re.match(r'^\d+\s*SEM', line) and current_sem is None:
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
    current_sem = None
    
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
                
                
        sem_match = re.match(r'^\d+\s*SEM', line)
                    
        # Check for new semester header
        if sem_match and current_sem is None:
            current_sem = line.strip()
   
        if(sem_match):
            matched_string = sem_match.group(0) 


        # Try to match a course entry
            if(current_sem == matched_string):
            
                if current_sem and i + 2 < len(lines):
                    course_code = lines[i+1].strip()
                    course_name = lines[i + 2].strip()
                    print(course_code)
                    grade = lines[i + 3].strip()
                    if re.match(r'^[A-Z]{2,4}\d{1,6}$', course_code) and grade in ['O', 'A+', 'A', 'B+', 'B','C','C+', 'RA']:
                        courses.append({
                            "Semester": current_sem,
                            "Course Code": course_code,
                            "Course Name": course_name,
                            "Grade": grade
                        })
                        print("Successful 👏🏻")
                
        

    return {
        "Student Info": student_info,
        "Courses": courses
    }

