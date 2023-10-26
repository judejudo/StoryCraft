from google.cloud import firestore

db = firestore.Client(project='a2sv-hackathon')
scores_collection = db.collection('scores')

class Score_data_handler():

    def add_score_to_db(self, child_id):
    # Get a reference to the document based on the child_id
        doc_ref = scores_collection.document(child_id)

        # Get the existing data (if any)
        doc = doc_ref.get()
        
        if doc.exists:
            # Update the score in the existing document
            current_score = doc.to_dict()['score']
            new_score = current_score + 3
            doc_ref.update({'score': new_score})
        else:
            # If the document doesn't exist, create a new one
            doc_ref.set({
                'child_id': child_id,
                'score': 3
            })

    def current_score(child_id):
        doc_ref = scores_collection.documents(child_id).get()
        score_value = doc_ref.to_dict()['score']
        return score_value




            

