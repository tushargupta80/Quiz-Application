# services/quiz_service.py
import datetime
import json
from services.db_service import mongo_service
from config import Config
from bson.objectid import ObjectId # To work with MongoDB's ObjectId

# --- LLM Client Setup ---
# Uncomment and configure the LLM you want to use.
# Remember to install the corresponding library (e.g., pip install openai)
# and set the API key in your .env file.

# Option 1: OpenAI
# from openai import OpenAI
# try:
#     openai_client = OpenAI(api_key=Config.OPENAI_API_KEY)
# except Exception as e:
#     print(f"OpenAI client initialization error: {e}")
#     openai_client = None # Handle case where API key might be missing

# Option 2: Google Gemini
import google.generativeai as genai
try:
    if Config.GOOGLE_API_KEY:
        genai.configure(api_key=Config.GOOGLE_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro') # Or 'gemini-1.5-flash', 'gemini-1.5-pro'
    else:
        gemini_model = None
        print("GOOGLE_API_KEY not found in .env, Gemini model not initialized.")
except Exception as e:
    print(f"Google Gemini client initialization error: {e}")
    gemini_model = None


quizzes_collection = mongo_service.get_collection('quizzes')

def generate_quiz_from_text(text_content, user_id):
    """
    Sends extracted text to an LLM to generate quiz questions.
    Integrates with the chosen LLM API and handles the response.
    """
    if not text_content or len(text_content) < 200: # Require a minimum amount of text
        raise ValueError("Not enough text content to generate a meaningful quiz (minimum 200 characters).")

    print("Preparing text for LLM quiz generation...")

    # For very long texts, LLMs have token limits.
    # Consider sending only the first N characters or using more advanced
    # techniques like RAG (Retrieval Augmented Generation) or text chunking.
    # Here, we limit to 4000 characters to fit common LLM contexts.
    processed_text = text_content[:4000]

    # --- LLM Prompt Engineering ---
    # Crafting an effective prompt is crucial for good quiz quality.
    # Be specific about the format, number of questions, types, etc.
    prompt = f"""
    Based on the following text, generate a quiz consisting of:
    - Exactly 3 Multiple Choice Questions (MCQ) with 4 distinct options each, and one correct answer.
    - Exactly 1 True/False question with a correct answer.
    - Exactly 1 Short Answer question with a concise correct answer.

    Ensure the questions are relevant to the text provided.
    The questions should vary in difficulty (easy to medium).

    Format the entire output as a JSON array of question objects.
    Each question object MUST have the following keys:
    - "question": The question text (string).
    - "type": (string) "mcq", "true_false", or "short_answer".
    - "options": (array of strings, for MCQ only) The four answer choices.
    - "correct_answer": (string) The single correct answer.

    Example JSON structure (do not include markdown ticks in the actual output):
    ```json
    [
        {{
            "question": "What is the capital of France?",
            "type": "mcq",
            "options": ["Berlin", "Madrid", "Paris", "Rome"],
            "correct_answer": "Paris"
        }},
        {{
            "question": "The Earth orbits the Sun. (True/False)",
            "type": "true_false",
            "correct_answer": "True"
        }},
        {{
            "question": "Explain artificial intelligence.",
            "type": "short_answer",
            "correct_answer": "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems."
        }}
    ]
    ```
    Text to generate quiz from:
    ---
    {processed_text}
    ---
    """

    generated_quiz_data = None
    try:
        # --- Call to LLM API ---
        # Uncomment the block for the LLM you are using

        # # Option 1: OpenAI API Call
        # if not openai_client:
        #     raise ValueError("OpenAI client not initialized. Check API key.")
        # chat_completion = openai_client.chat.completions.create(
        #     model="gpt-4o-mini", # Or "gpt-3.5-turbo", "gpt-4", "gpt-4o"
        #     messages=[
        #         {"role": "system", "content": "You are a helpful assistant that generates quizzes in strict JSON format."},
        #         {"role": "user", "content": prompt}
        #     ],
        #     response_format={"type": "json_object"} # Instructs LLM to return valid JSON
        # )
        # raw_llm_response_content = chat_completion.choices[0].message.content
        # print(f"Raw LLM Response: {raw_llm_response_content}") # For debugging
        # generated_quiz_data = json.loads(raw_llm_response_content)

        # Option 2: Google Gemini API Call
        if not gemini_model:
            raise ValueError("Gemini model not initialized. Check API key.")
        response = gemini_model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"} # Instructs LLM to return valid JSON
        )
        raw_llm_response_content = response.text
        print(f"Raw LLM Response: {raw_llm_response_content}") # For debugging
        generated_quiz_data = json.loads(raw_llm_response_content)

        # --- Mock LLM Response for testing without API Key ---
        # REMOVE THIS BLOCK when integrating a real LLM
        mock_llm_response_content = """
        [
            {
                "question": "What is the capital of France?",
                "type": "mcq",
                "options": ["Berlin", "Madrid", "Paris", "Rome"],
                "correct_answer": "Paris"
            },
            {
                "question": "The Earth orbits the Sun. (True/False)",
                "type": "true_false",
                "correct_answer": "True"
            },
            {
                "question": "Explain the concept of AI.",
                "type": "short_answer",
                "correct_answer": "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems."
            },
            {
                "question": "Which gas do plants absorb from the atmosphere for photosynthesis?",
                "type": "mcq",
                "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                "correct_answer": "Carbon Dioxide"
            }
        ]
        """
        generated_quiz_data = json.loads(mock_llm_response_content)
        # --- End Mock LLM Response ---


        # Basic validation of the LLM's output structure
        if not isinstance(generated_quiz_data, list) or not all(isinstance(q, dict) and 'question' in q for q in generated_quiz_data):
            raise ValueError("LLM did not return a valid quiz format (expected list of question objects).")

        if not generated_quiz_data:
            raise ValueError("LLM generated an empty quiz. Please try with more comprehensive text.")

    except json.JSONDecodeError as e:
        print(f"JSON decoding error from LLM response: {e}")
        raise ValueError("LLM response was not valid JSON. Please try again.")
    except Exception as e:
        print(f"LLM API call or processing error: {e}")
        raise ValueError(f"Failed to generate quiz questions. LLM might have an issue: {e}")

    # Prepare the quiz document for MongoDB
    quiz_document = {
        "user_id": ObjectId(user_id), # Store user ID as ObjectId
        "quiz": generated_quiz_data,
        "generated_at": datetime.datetime.now(datetime.timezone.utc),
        "source_text_preview": processed_text[:500] + "..." if len(processed_text) > 500 else processed_text,
        "quiz_title": f"Quiz from {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}" # Default title
    }

    # Save the generated quiz to the 'quizzes' collection
    insert_result = quizzes_collection.insert_one(quiz_document)

    # Return the newly created quiz ID and the quiz data
    return {"quiz_id": str(insert_result.inserted_id), "quiz": generated_quiz_data}


def get_quizzes_by_user(user_id):
    """
    Fetches all quizzes generated by a specific user from the database.
    """
    # Find quizzes for the given user_id, sort by generation date descending
    quizzes_cursor = quizzes_collection.find({"user_id": ObjectId(user_id)}).sort("generated_at", -1)

    quizzes_list = []
    for quiz in quizzes_cursor:
        # Convert ObjectId to string for JSON serialization (frontend compatibility)
        quiz['_id'] = str(quiz['_id'])
        quiz['user_id'] = str(quiz['user_id'])
        # Frontend expects 'id' for QuizListItem
        quiz['id'] = quiz['_id']
        # Ensure title is present for display
        if 'quiz_title' not in quiz:
            quiz['quiz_title'] = f"Quiz from {quiz['generated_at'].strftime('%Y-%m-%d %H:%M')}"

        # Remove the full quiz data if not needed for the list view to save bandwidth
        # We can fetch full quiz data on demand for a single quiz page later.
        # For this MVP, we are sending the full quiz for simplicity

        quizzes_list.append(quiz)

    return quizzes_list

def delete_quiz_by_id(quiz_id, user_id):
    """
    Deletes a quiz by its ID, ensuring the requesting user owns it.
    """
    try:
        # Attempt to convert quiz_id string to ObjectId
        obj_quiz_id = ObjectId(quiz_id)
        obj_user_id = ObjectId(user_id)
    except Exception as e:
        raise ValueError(f"Invalid ID format: {e}")

    # Delete the quiz, ensuring both quiz_id and user_id match
    result = quizzes_collection.delete_one({"_id": obj_quiz_id, "user_id": obj_user_id})

    if result.deleted_count == 0:
        raise ValueError("Quiz not found or you don't have permission to delete it.")