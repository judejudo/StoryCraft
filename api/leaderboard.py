from google.cloud import firestore

db = firestore.Client(project='a2sv-hackathon')
scores_collection = db.collection('scores')


# Create a new user document in the "users" collection
users_ref = db.collection("users")

class Leaderboard():

    def leaderboard():
        leaderboard_query = scores_collection.order_by('score', direction=firestore.Query.DESCENDING).stream()
        rank = 1
        for doc in leaderboard_query:
            position = print(f" {rank}. User ID: {doc.id}, Score: {doc.to_dict()['score']}")
            rank += 1
        return position