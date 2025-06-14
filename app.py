import streamlit as st
import requests
import os
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

# Load environment variables from .env file
load_dotenv()

st.set_page_config(page_title="Text-to-Image Generator (Gemini)", page_icon="🖼️")

st.title("🖼️ Free Text-to-Image Generator (Stable Diffusion XL)")

prompt = st.text_input("Enter your image prompt:", "", key="sdxl_prompt")

if st.button("Generate", key="sdxl_generate") and prompt:
    with st.spinner("Generating image..."):
        api_url = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
        headers = {
            "Authorization": f"Bearer {os.getenv('HF_API_KEY')}"
        }
        payload = {"inputs": prompt}
        response = requests.post(api_url, headers=headers, json=payload)
        if response.status_code == 200:
            image = Image.open(BytesIO(response.content))
            st.image(image, caption=prompt)
        else:
            st.error(f"Error: {response.text}")

st.caption("Powered by Hugging Face Stable Diffusion XL")