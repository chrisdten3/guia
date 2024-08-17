import streamlit as st

# Title of the app
st.title("Bweno")

# Prompt for user input
prompt = st.text_input("Enter your text prompt:")

# Button to generate output
if st.button("Generate Output"):
    if prompt:
        # Example output generation (this can be replaced with actual logic)
        output = f"Generated output for the prompt: {prompt}"
        st.write(output)
    else:
        st.write("Please enter a prompt.")

