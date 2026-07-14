def calculate_cgpa(final_data):
    """
    Calculates the CGPA based on a dictionary containing a list of courses.
    Each course should have 'Grade' and 'Credits'.
    """
    calculation = {"O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C+": 5, "C": 4, "RA": 0}
    calculation_result = 0
    total_credits = 0
    courses = final_data.get("Courses", [])
    
    for course in courses:
        grade = course.get("Grade")
        credits = course.get("Credits", 0.0)
        if grade in calculation:
            total_credits += credits
            calculation_result += calculation[grade] * credits
            
    if total_credits == 0:
        return "NA"
        
    final_result = round((calculation_result / total_credits), 3)
    return str(format(final_result, ".2f"))


def calculate_total_credits(courses):
    """
    Calculates the sum of credits for a list of courses.
    """
    return sum(course.get("Credits", 0.0) for course in courses)
