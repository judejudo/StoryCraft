## 📖📖StoryCraft
This is an application that helps children improve their literacy, imagination and creativity at an early age. It does this by generating custom and personalized stories tailored to their age and understanding level

**Table of Contents**
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation Instructions](#installation-instructions)
4. [Usage Guide](#usage-guide)
5. [ScreenShots](#screenshots)
6. [Acknowledgements](#acknowledgements)
   
    
## Introduction
In this section, you can provide a brief introduction about your project. This could include information such as what problem it solves or why it was created.
In this section, you can provide a brief introduction about your project. This could include information such as what problem it solves or who its intended audience is
This project provides a solution to ...

## ✨Features
The features of this project include:
- Login and register page
- Generate a story
- Bookmark a story
- Look up a word in the story
- Do a quiz
- See what stories others are creating
- Share stories
- Check out the leaderboard to see your progress
  
## Installation Instructions
To install this project, follow these steps:
1. Clone the repository from GitHub onto your local machine https://github.com/AsavaAsava/StoryCraft.git
3. Open the cloned directory with Visual Studio Code or any other code editor you prefer.
4. Run ```npm install``` command inside the root folder to install all dependencies required by the application.
5. Make sure that Node.js and npm are installed on your computer before running the above commands. You can download them from https://nodejs
6. You'll need an OpenAI account with access to GPT-3, and a Replicate (replicate.com) account.
7. Replace `<your_openai_api_key>` in `.env` file with your own API key.
```
export OPENAI_API_KEY=XXX
```
9. Replace `<your_replicate_token>` in `.env` file with your own token.
```
export REPLICATE_API_TOKEN=XXX
```
11. To use the program, run it using Node.js on your local environment.
## Usage Guide
Run flask in the git bash terminal
```
flask run
```
This will start the flask web server and you can access the application
## 📸 ScreenShots
| <img src="StoryCraft-UI/readme/st1.jpg" width="300" height="500">  | <img src="StoryCraft-UI/readme/st2.jpg" width="300" height="500">  |
| <img src="StoryCraft-UI/readme/st3.jpg" width="300" height="500">  | <img src="StoryCraft-UI/readme/st4.jpg" width="300" height="500">  |
## Acknowledgements
This project uses the following AI models:

- OpenAI API
- Stable Diffusion 
- GPT-3 by Anthropic
- ElevenLabs

Thank you to the teams at OpenAI, Stability AI, ElevenLabs and Anthropic for developing these powerful AI models and making them accessible.
