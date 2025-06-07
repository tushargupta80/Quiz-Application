# services/pdf_service.py
import PyPDF2
# import pdfminer.high_level as pdfminer_hl # For pdfminer.six
# import fitz # For PyMuPDF (formerly MuPDF)
import io

def extract_text_from_pdf(pdf_file_stream):
    """
    Extracts text from a PDF file stream using PyPDF2.
    This method is generally good for native (text-based) PDFs.
    For scanned PDFs, PDFs with complex layouts, or images,
    consider using pdfminer.six, PyMuPDF, or an OCR solution.

    Args:
        pdf_file_stream: A file-like object (e.g., io.BytesIO) containing the PDF data.

    Returns:
        str: The extracted text content from the PDF.

    Raises:
        ValueError: If text extraction fails or the PDF seems to be an image-only document.
    """
    text = ""
    try:
        # PyPDF2 expects a binary stream
        reader = PyPDF2.PdfReader(pdf_file_stream)
        if reader.is_encrypted:
            try:
                reader.decrypt("") # Attempt decryption with empty password
            except Exception as e:
                raise ValueError(f"Encrypted PDF could not be decrypted: {e}")

        if not reader.pages:
            raise ValueError("No pages found in PDF.")

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if not text.strip(): # Check if extracted text is empty or just whitespace
            raise ValueError("No readable text found. It might be a scanned PDF or contain only images.")

    except Exception as e:
        print(f"PyPDF2 Text Extraction Error: {e}")
        raise ValueError(f"Failed to extract text from PDF: {e}. It might be a scanned document or corrupted.")

    return text.strip() # Remove leading/trailing whitespace

# --- Alternative PDF Parsers (Uncomment and integrate if needed) ---

# def extract_text_from_pdf_pdfminer(pdf_file_stream):
#     """
#     Extracts text from a PDF file stream using pdfminer.six.
#     Often handles complex layouts better than PyPDF2.
#     """
#     text_content = ""
#     try:
#         # pdfminer.six.high_level.extract_text can take a file-like object directly
#         text_content = pdfminer_hl.extract_text(pdf_file_stream)
#     except Exception as e:
#         print(f"Pdfminer.six Text Extraction Error: {e}")
#         raise ValueError(f"Failed to extract text from PDF using pdfminer.six: {e}")
#     return text_content.strip()

# def extract_text_from_pdf_pymupdf(pdf_file_stream):
#     """
#     Extracts text from a PDF file stream using PyMuPDF (fitz).
#     Very powerful for text extraction, often good for various PDF types.
#     """
#     text = ""
#     try:
#         # PyMuPDF expects bytes or a file path. Read stream content.
#         doc = fitz.open(stream=pdf_file_stream.read(), filetype="pdf")
#         for page_num in range(doc.page_count):
#             page = doc.load_page(page_num)
#             text += page.get_text()
#         doc.close()
#     except Exception as e:
#         print(f"PyMuPDF Text Extraction Error: {e}")
#         raise ValueError(f"Failed to extract text from PDF using PyMuPDF: {e}")
#     return text.strip()