import replicate
import random


# Load image model
model = replicate.models.get("stability-ai/stable-diffusion")
version = model.versions.get("db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf")


def generate_image(prompt: str) -> str:
    """
    Generate an image and get image link.

    Args:
        prompt for image

    Returns:
        image link

    Raises:
        Failed to generate image
    """
    image_url = None

    for _ in range(5):

        try:
            image_url = model.predict(
                prompt=prompt,
                width=768,
                height=512,
                negative_prompt="",
                num_outputs=1,
                num_inference_steps=50,
                guidance_scale=7.5,
                scheduler="K_EULER",
                seed=random.randint(0,100),
            )[0]
           
            if image_url is not None:
                return image_url
        except Exception as e:
            print(e)
            pass

    raise RuntimeError("Failed to generate image")
