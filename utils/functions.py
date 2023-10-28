
import gpt3, prompts, stable_diffusion
import json

def get_data_from_request(request):
    """Get data from the request and return it as a dictionary"""
    
    data = request.get_json()
    uid = data.get('uid', "")
    name = data.get('name', "")
    age = data.get('age', "")
    choices = data.get('choices', {})

    language = choices[0].get('language', "")
    favorite_animal = choices[0].get('favorite_animal', "")
    exciting_place = choices[0].get('exciting_place', "")
    special_interest = choices[0].get('special_interest', "")
    superhero = choices[0].get('superhero', "")
    mood = choices[0].get('mood', "")
    return uid, name, age, language, favorite_animal, exciting_place, special_interest, superhero, mood


def generate_new_story(uid, name, age, language, favorite_animal, exciting_place, special_interest, superhero, mood):
    """Generate a new story using GPT-3"""
    
    plot = f"Short story of at least 5 paragraphs for a person named {name} who is {age} whose favorite animal is {favorite_animal}. They love to visit {exciting_place} and enjoy {special_interest}.  {superhero} appear. {mood}. Write the story in {language} "
    story = ""

    if len(plot) == 0:
        try:
            plot_prompt = prompts.plot()
            plot = gpt3.generate_with_prompt(plot_prompt, 0.8)
        except Exception as e:
                print(e)
            #Create story prompt and Prompt GPT-3 to generate the story
    for _ in range(10):
        if len(story.split(". ")) < 20:
            try:
                story_prompt = prompts.story_expansion(story)
                story = gpt3.generate_with_prompt(story_prompt, 0.6)
            except Exception as e:
                    print(e)

        # Combine the story with images
    img_list = []
    parts = story.split("\n\n")
    parts = [part for part in parts if len(part) > 0]
    story_with_images = ""
    #Get image links from stable diffusion, Add them between the story parts
    for i, part in enumerate(parts):
        if "replicate.com" not in part:
            story_with_images += part + "\n\n"
        else:
            image_url = part
            story_with_images += image_url + "\n\n"

        if "replicate.com" not in story:
            try:
                image_prompt = prompts.illustration(f"{plot}\n\n{'' if i == 0 else parts[i - 1]}\n\n{part}")
                image_url = stable_diffusion.generate_image(image_prompt)
                img_list.append(image_url)
                story_with_images += image_url + "\n\n"
            except Exception as e:
                    print(e)
                    
    return [story,story_with_images,parts,img_list,uid,superhero,special_interest] 

def get_questions(story):
    """Generate questions from the story using GPT-3"""
    
    answer_format = '{"questions": [{"question": "What is the name of the curious child in the story?","options":["Emily", "Lily", "Mia", "Noah"],"answer": "Lily"}]}'
    questions = json.loads(gpt3.generate_with_prompt(f"Generate questions in the format {answer_format} from the following story: \n {story} ",0.7))
    return(questions)

def get_cover_art(character,setting):
    try:
        cover_art_prompt = prompts.cover_image(character,setting)
        cover_art = stable_diffusion.generate_image(cover_art_prompt)
        return cover_art
    except Exception as e:
        print(e)
        
 
def get_plot(story):
    """Generate a plot using GPT-3"""
    plot = ""
    try:
        plot_prompt = prompts.generate_plot(story)
        plot = gpt3.generate_with_prompt(plot_prompt, 0.8)
    except Exception as e:
            print(e)
    return plot       
        
def expand_story(original_story: str, additions: str):
    """Generate a new story using GPT-3"""
    plot = get_plot(original_story) #Change this to generate a plot
    story = ""

    for _ in range(10):
        if len(story.split(". ")) < 20:
            try:
                story_prompt = prompts.continue_story(original_story,additions)
                story = gpt3.generate_with_prompt(story_prompt, 0.6)
            except Exception as e:
                    print(e)

        # Combine the story with images
    img_list = []
    parts = story.split("\n\n")
    parts = [part for part in parts if len(part) > 0]
    story_with_images = ""
    #Get image links from stable diffusion, Add them between the story parts
    for i, part in enumerate(parts):
        if "replicate.com" not in part:
            story_with_images += part + "\n\n"
        else:
            image_url = part
            story_with_images += image_url + "\n\n"

        if "replicate.com" not in story:
            try:
                image_prompt = prompts.illustration(f"{plot}\n\n{'' if i == 0 else parts[i - 1]}\n\n{part}")
                image_url = stable_diffusion.generate_image(image_prompt)
                img_list.append(image_url)
                story_with_images += image_url + "\n\n"
            except Exception as e:
                    print(e)
                    
    return [story,story_with_images,parts,img_list] 