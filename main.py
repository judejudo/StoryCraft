import urllib.parse
import codecs


import streamlit as st

from utils import prompts, gpt3, stable_diffusion


st.set_page_config(page_title="StoryCraft", page_icon="story-book.png")

# Don't show certain things
hide_menu_style = """
<style>
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
</style>
"""
st.markdown(hide_menu_style, unsafe_allow_html=True)

# Load params if relevant
params = st.experimental_get_query_params()
st.experimental_set_query_params()

st.title("StoryCraft")
st.write("Generate Wonderful Stories with pictures for children! Presented for AS2V Hackathon.")

name = st.text_input("What's your name?")
age = st.text_input("How old are you?")

# Define multiple-choice questions
questions = [
    "What language would you like your story to be in?",
    "What's your favorite animal?",
    "What's the most exciting place you've been to? How about we find a story set in a similar place?",
    "Do you have a special talent or hobby? Let's find a story about a character who shares that interest!",
    "Is there a superhero you admire? Let's explore stories featuring heroes like them.",
    "How do you feel today? Let's choose a story that matches your mood or helps you feel better.",
]

# Define options for each question
options = [
    ["English 🇺🇸", "Spanish 🇪🇸", "French 🇫🇷", "Chinese 🇨🇳", "Hindi 🇮🇳"],
    ["Lion 🦁", "Elephant 🐘", "Penguin 🐧", "Dolphin 🐬", "Giraffe 🦒"],
    ["The beach 🏖️", "The zoo 🦁🐒", "The park 🌳", "Grandma's house 👵🏠", "The mountains ⛰️"],
    ["Drawing 🎨", "Dancing 💃", "Playing soccer ⚽", "Singing 🎤", "Building with blocks 🧱"],
    ["Spider-Man 🕷️", "Wonder Woman 🌟", "Batman 🦇", "Elsa from Frozen ❄️", "Iron Man 🦾"],
    ["Happy 😃", "Sad 😢", "Excited 🤩", "Calm 😌", "Curious 🤔"],
]

# Create placeholders for selected answers
selected_answers = []

# Display and record answers for each question
for i, question in enumerate(questions):
    answer = st.radio(question, options[i])
    selected_answers.append(answer)

# Combine selected answers to create a story prompt
language, favorite_animal, exciting_place, special_interest, superhero, mood = selected_answers

plot = f"Short story of at least 5 paragraphs for a person named {name} who is {age} whose favorite animal is {favorite_animal}. They love to visit {exciting_place} and enjoy {special_interest}.  {superhero} appear. {mood}. Write the story in {language} "

# # Generate plot or allow user to prompt
# type_ = st.selectbox(
#     "Random or Prompted?",
#     ("Prompted", "Random"),
#     index=(1 if "type" in params and params["type"][0] == "Random" else 0),
# )

# # # Read plot from text field if Prompted
# # plot = codecs.decode(params["prompt"][0], "rot13") if ("prompt" in params and "type" in params and params["type"][0] == "Prompted") else ""
# # if type_ == "Prompted":
# #     plot = st.text_area("Prompt", value=plot)

# Prevent auto generate
if not st.button("Generate") and "story" not in params:
    st.stop()

with st.spinner("Writing..."):

    # Only generate if story is not in URL params
    story = codecs.decode(params["story"][0], "rot13") if "story" in params else ""
    if story == "":

        # Generate plot if empty
        if len(plot) == 0:
            try:
                plot_prompt = prompts.plot()
                plot = gpt3.generate_with_prompt(plot_prompt, 0.8)
            except Exception as e:
                print(e)
                st.warning("Failed to generate story.")
                st.stop()

        # Generate story from plot
        story = plot
        for _ in range(10):
            if len(story.split(". ")) < 20:
                try:
                    story_prompt = prompts.story_expansion(story)
                    story = gpt3.generate_with_prompt(story_prompt, 0.6)
                except Exception as e:
                    print(e)

            break

    # Render story
    parts = story.split("\n\n")
    parts = [part for part in parts if len(part) > 0]

    story_with_images = ""

    for i, part in enumerate(parts):

        # Need to account for when the story is embedded in URL
        if "replicate.com" not in part:
            st.write(part)
            story_with_images += part + "\n\n"
        else:
            image_url = part
            story_with_images += image_url + "\n\n"
            st.image(image_url, use_column_width=True)

        if "replicate.com" not in story:
            try:
                image_prompt = prompts.illustration(f"{plot}\n\n{'' if i == 0 else parts[i - 1]}\n\n{part}")
                image_url = stable_diffusion.generate_image(image_prompt)
                story_with_images += image_url + "\n\n"
                st.image(image_url, use_column_width=True)
            except Exception as e:
                print(e)


st.write("")

download = st.button("Download Story")
if download:
    download_html = """
    <script>
    window.print(); 
    </script>
    """
    st.markdown(download_html, unsafe_allow_html=True)

