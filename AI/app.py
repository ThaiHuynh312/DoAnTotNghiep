import re
from flask import Flask, request, jsonify
import spacy

app = Flask(__name__)

nlp = spacy.load("./ner_lop_mon_model")

@app.route('/ner', methods=['POST'])
def ner():
    data = request.get_json()
    text = data.get('text', '').lower() 
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    
    text = re.sub(r'[.,;:?!]', ' ', text)
    text = re.sub(r'\b(xung|quanh)\b', '', text)

    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        if ent.label_ == 'KHAC':
            continue
        entities.append({
            'text': ent.text,
            'label': ent.label_,
            'start_char': ent.start_char,
            'end_char': ent.end_char
        })

    return jsonify({'entities': entities})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
