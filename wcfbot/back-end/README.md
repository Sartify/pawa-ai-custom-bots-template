## Project Setup Guide

### Follow the steps below to get started with this project.


#### 1. Clone the Repository
git clone https://github.com/Sartify/pawa-ai-custom-bots-template.git
cd pawa-ai-custom-bots-template

#### 2. Create and Activate a Virtual Environment
For Linux/macOS:
python3 -m venv venv
source venv/bin/activate

For Windows:
python -m venv venv
venv\Scripts\activate


#### 3. Navigate to the Backend Directory
cd wcfbot then click enter

THEN: cd back-end

#### 4. Install Dependencies

pip install -r requirements.txt

#### 5. Generate the Key
Inside the backend directory, run the generate_kb.py script to generate a kbReferenceId:

python generate_kb.py

This script will output a key ID, copy the kbReferenceId then configure to .env file

#### 6.Configure the Environment
    1. Open the .env file (create it if it doesn't exist).

    2. Add the generated key ID to the file in the appropriate variable, for example:
        RAG_KEY=kbReferenceId