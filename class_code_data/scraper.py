import pdfplumber
import re
import pandas as pd

# Path to your PDF file
pdf_path = "codes_unfiltered.pdf"  # Change this to your actual PDF file

# Regex pattern to match class codes (e.g., CSE12, MATH19A, PHYS5A)
pattern = r'\b[A-Z]{2,5}\s?\d+[A-Z]?\b'

# Set to store unique class codes
all_class_codes = set()

# Open and extract text from PDF
with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            matches = re.findall(pattern, text)  # Find class codes
            all_class_codes.update(matches)
        print(f"Processed page {i+1}/{len(pdf.pages)}")  # Progress tracking

# Convert to DataFrame
df = pd.DataFrame(sorted(all_class_codes), columns=["Class Codes"])

# ✅ Display extracted class codes
print(df)

# ✅ Save to CSV (optional)
df.to_csv("extracted_class_codes.csv", index=False)
print("✅ Class codes saved to 'extracted_class_codes.csv'")

# ✅ Save to Excel (optional)
df.to_excel("extracted_class_codes.xlsx", index=False)
print("✅ Class codes saved to 'extracted_class_codes.xlsx'")
