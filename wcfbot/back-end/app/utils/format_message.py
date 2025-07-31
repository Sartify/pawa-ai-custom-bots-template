from app.api.models.user_request import UserRequest
import os
from typing import List, Optional
from fastapi import File, UploadFile
from app.utils.files_extraction import send_files_to_extraction_server
import yaml
from dotenv import load_dotenv
load_dotenv(override=True)

MEMORY_PATH = "app/engine/memory.json"

async def msg_to_pawa_chat(
    text: UserRequest,
    files: Optional[List[UploadFile]] = None,
    is_streaming: bool = False
) -> dict:
    """
    Converts a UserRequest message to the format required by the Pawa AI chat API.
    
    Args:
        text (UserRequest): The user request containing the message.
        files (Optional[List[UploadFile]]): Optional list of files to extract content from.
        is_streaming (bool): Whether the request is for streaming or not.
        
    Returns:
        dict: The formatted message ready for the Pawa AI chat API.
    """
    
    extraction_result_ = None
    if files:
        extraction_result_ = await send_files_to_extraction_server(files)
    
    user_message = text.message
    if extraction_result_ is not None:
        extraction_data_=extraction_result_['data']
        if extraction_data_:
            document_contexts = []
            for doc in extraction_data_:
                filename = doc.get("filename")
                content = doc.get("content", "").strip()
            
                if filename and content:
                    document_contexts.append(f"---\nFilename: {filename}\nContent:\n{content}\n")

            if document_contexts:
                prepended_info = (
                    "Nimepakia nyaraka zifuatazo ambazo unaweza kutumia kujibu swali:\n\n"
                    + "\n".join(document_contexts)
                    + "\nTafadhali tumia taarifa hizi kujibu swali lifuatalo:\n\n"
                )
                user_message = prepended_info + user_message
    
    if os.getenv("IS_MEMORY_ENABLED", "True").lower() == "true":
        if os.path.exists(MEMORY_PATH):
            with open(MEMORY_PATH, "r") as file:
                memory_data = yaml.safe_load(file) or []
    

    return {
        "model": os.getenv("CHAT_MODEL", "pawa-v1-ember-20240924"),
        "messages": [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": os.getenv(
                            "PAWA_SYSTEM_PROMPT",
                            "You are a helpful assistant that answers questions asked in Swahili."
                        ).replace("\\n", "\n")
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_message
                    }
                ]
            }
        ],
    **({
        "knowledgeBase": {
            "kbReferenceId": os.getenv("KB_REFERENCE_ID"),
            **({"isMust": os.getenv("IS_MUST_USE_KB").lower() == "true"} 
               if os.getenv("IS_MUST_USE_KB") is not None else {})
        }
    } if os.getenv("KB_REFERENCE_ID") is not None else {}),
        "memoryChat": memory_data if os.getenv("IS_MEMORY_ENABLED", "True").lower() == "true" else [],
        "stream": is_streaming,
        "temperature": float(os.getenv("TEMPERATURE", 0.1)),
        "top_p": float(os.getenv("TOP_P", 0.95)),
        "tool_choice": os.getenv("TOOL_CHOICE", "auto"),
        "max_tokens": int(os.getenv("MAX_TOKENS", 4096)),
        "frequency_penalty": float(os.getenv("FREQUENCY_PENALTY", 0.3)),
        "presence_penalty": float(os.getenv("PRESENCE_PENALTY", 0.3)),
        "seed": int(os.getenv("SEED", 2024))
    }
    
#     KB_REFERENCE_ID = "kb-1238b2e7-3873-4ea3-8077-497f66f9583b"
# IS_MUST_USE_KB = True
    


#     {
#   "model": "pawa-v1-ember-20240924",
#   "messages": [
#     {
#       "role": "system",
#       "content": [
#         {
#           "type": "text",
#           "text": "You are a helpful assistant that answers questions asked "
#         }
#       ]
#     },
#     {
#       "role": "user",
#       "content": [
#         {
#           "type": "text",
#           "text": "What is the current president of Tanzania?"
#         },
#         {
#           "type": "image_url",
#           "image_url": {
#             "url": "https://example.com/image.png"
#           }
#         }
#       ]
#     }
#   ],
#   "tools": [
#     {
#       "type": "function",
#       "function": {
#         "name": "convert_usd_to_tsh",
#         "description": "Converts an amount in USD to Tanzanian Shillings.",
#         "strict": true,
#         "parameters": {
#           "type": "object",
#           "properties": {
#             "amount_usd": {
#               "description": "Amount in USD",
#               "type": "number"
#             }
#           },
#           "required": [
#             "amount_usd"
#           ],
#           "additionalProperties": false
#         }
#       }
#     },
#     {
#       "type": "pawa_tool",
#       "pawa_tool": "web_search_tool"
#     }
#   ],
#   "capabilities": {
#     "name": "reasoning",
#     "effort": "medium"
#   },
#   "knowledgeBase": {
#     "kbReferenceId": "3fdfdff43543fdfdf44434fsfdf",
#     "isMust": true
#   },
#   "memoryChat": [
#     {
#       "role": "user",
#       "content": [
#         {
#           "type": "text",
#           "text": "Habari yako?"
#         }
#       ]
#     },
#     {
#       "role": "assistant",
#       "content": [
#         {
#           "type": "text",
#           "text": "Nzuri sana, asante. Wewe je?"
#         }
#       ]
#     }
#   ],
#   "temperature": 0.1,
#   "top_p": 0.95,
#   "tool_choice": "auto",
#   "max_tokens": 4096,
#   "frequency_penalty": 0.3,
#   "presence_penalty": 0.3,
#   "seed": 2024,
#   "stream": false
# }
    
    