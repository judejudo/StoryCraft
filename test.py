import openai


def generate_with_prompt(prompt: str, temperature: float) -> str:
    """
    Generate text given input prompt.
    
    Args:
        prompt: Input prompt
        temperature: Temperature of generation

    Returns:
        output

    Raises:
        RuntimeError: Failed to generate
    """
    # Generate story
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=prompt,
        temperature=temperature,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    output = response["choices"][0].text

    # Content filtered story
    response = openai.Completion.create(
        engine="content-filter-alpha",
        prompt="<|endoftext|>" + output + "\n--\nLabel:",
        temperature=0,
        max_tokens=1,
        top_p=0,
        logprobs=10,
    )
    output_label = response["choices"][0].text

    # Regenerate story if failed content filter or story too short
    if int(output_label) < 2:
        return output

    raise RuntimeError("Failed to generate")

story="Once upon a time, in a small coastal town nestled between rolling hills and a sparkling sea, there lived a curious child named Lily. Lily had heard many tales about the beach from her grandparents but had never seen it for herself. One sunny morning, with a backpack filled with excitement and a heart brimming with curiosity, she set off on an adventure to the beach.As she approached the shore, the distant sound of waves crashing against the rocks grew louder, filling her ears with a soothing melody. The salty breeze tousled her hair and the golden sand welcomed her tiny feet. Wide-eyed and full of wonder, Lily gazed at the vast expanse of the ocean stretching out before her, its endless blue merging with the sky in the distance.Lily spent her day exploring the wonders of the beach. She built sandcastles adorned with seashells and colored pebbles, imagining them as grand palaces from far-off lands. With each wave that kissed the shore, her castles stood tall and then crumbled away, teaching her the beauty of impermanence.As the day progressed, Lily ventured further, her toes sinking into the wet sand as she collected seashells of all shapes and sizes. Each shell whispered a story of the sea, and Lily listened intently, her imagination painting vivid pictures of underwater worlds filled with colorful fish and swaying coral.In the afternoon, Lily watched as expert surfers rode the waves with grace and skill, their silhouettes against the setting sun like shadows dancing on the water. Inspired, she decided to try her hand at surfing, albeit on a smaller scale. With a bright boogie board in tow, she paddled out into the shallow waters, giggling with delight as the gentle waves carried her back to the shore.As the sun dipped below the horizon, casting a warm orange glow across the sky, Lily sat on the beach, her fingers entwined with cool, damp sand. She marveled at the beauty of the world around her, feeling a deep sense of peace and belonging. The beach, with its endless wonders and calming presence, had become a magical place in Lily's heart.With a contented sigh, she bid farewell to the beach, promising to return again one day. As she walked back home, her pockets filled with seashells and her heart filled with memories, Lily knew that the beach would always hold a special corner in her childhood adventures, a place where dreams touched the sand and where the song of the sea echoed in her soul."
print(generate_with_prompt(f"Give me random alternative  ways to continue with the story provided below such as superheroes appearing: \n {story}", 0.7))
