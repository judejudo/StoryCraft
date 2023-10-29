from google.cloud import firestore

def store_story(story_response):
    print("hello there")
    db = firestore.Client(project='a2sv-hackathon')

    stories_ref = db.collection('stories')
    stories_ref.add(story_response)