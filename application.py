from flask import Flask, render_template, request, jsonify
from transformers import ViltProcessor, ViltForQuestionAnswering
from PIL import Image
import io
import torch

app = Flask(__name__)

# Load the model and processor once when the app starts
processor = ViltProcessor.from_pretrained("dandelin/vilt-b32-finetuned-vqa")
model = ViltForQuestionAnswering.from_pretrained("dandelin/vilt-b32-finetuned-vqa")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/ask', methods=['POST'])
def ask_question():
    file = request.files['image']
    question = request.form['question']

    if file and question:
        image = Image.open(io.BytesIO(file.read()))
        encoding = processor(image, question, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**encoding)
            logits = outputs.logits
            idx = logits.argmax(-1).item()
            answer = model.config.id2label[idx]
        return jsonify({'answer': answer})
    return jsonify({'error': 'Invalid input'})


if __name__ == "__main__":
    app.run(debug=True)
