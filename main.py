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

# Define multiple-choice questions
questions = [
    "What's your favorite animal?",
    "What's the most exciting place you've been to? How about we find a story set in a similar place?",
    "Do you have a special talent or hobby? Let's find a story about a character who shares that interest!",
    "Is there a superhero you admire? Let's explore stories featuring heroes like them.",
    "How do you feel today? Let's choose a story that matches your mood or helps you feel better.",
]

# Define options for each question
options = [
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
favorite_animal, exciting_place, special_interest, superhero, mood = selected_answers

plot = f"Once upon a time, there was a person named {name} whose favorite animal was {favorite_animal}. They had the opportunity to visit {exciting_place} and had a fantastic adventure there. In their free time, they enjoyed {special_interest}, which was their special talent. One day, they met a hero similar to {superhero}, who inspired them. Today, they woke up feeling {mood}. Write a short story based that would be of interest to them."

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

# story_url = f"https://onceuponaitime.com?type={type_}&prompt={urllib.parse.quote_plus(codecs.encode(plot, 'rot13'))}&story={urllib.parse.quote_plus(codecs.encode(story_with_images, 'rot13'))}"

st.write("")
