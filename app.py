import cv2
import numpy as np
from PIL import Image
import torch
from torchvision import transforms
from flask import Flask, request, jsonify, render_template, send_file
import io
import base64

app = Flask(__name__)

# Load model saat aplikasi dimulai
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.hub.load('pytorch/vision:v0.10.0', 'deeplabv3_resnet101', pretrained=True)
model.eval()
model = model.to(device)

# Warna dalam format BGR
COLOR_MAP = {
    'blue': (255, 0, 0),
    'red': (0, 0, 255),
    'white': (255, 255, 255),
    'green': (0, 255, 0),
    'lightblue': (255, 255, 0),
    'yellow': (0, 255, 255),
    'orange': (0, 165, 255)
}

def change_background(image, new_color=(255, 255, 255), threshold=0.1):
    original_height, original_width = image.shape[:2]
    pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB)).convert("RGB")

    preprocess = transforms.Compose([
        transforms.Resize((520, 520)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    input_tensor = preprocess(pil_img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)['out'][0]
    output = torch.nn.functional.softmax(output, dim=0).cpu().numpy()

    mask = (output[0] < threshold).astype(np.uint8) * 255
    mask = cv2.resize(mask, (original_width, original_height))
    
    # Operasi morfologi
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.erode(mask, kernel, iterations=1)
    mask = cv2.dilate(mask, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=3)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)

    mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    new_background = np.full_like(image, new_color)
    
    foreground = cv2.bitwise_and(image, mask_3ch)
    background = cv2.bitwise_and(new_background, cv2.bitwise_not(mask_3ch))
    result = cv2.add(foreground, background)
    
    return result

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
        
    file = request.files['image']
    color_name = request.form.get('color', 'white')
    new_color = COLOR_MAP.get(color_name, (255, 255, 255))
    
    # Baca gambar
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Proses gambar
    result_img = change_background(img, new_color)
    
    # Konversi ke base64 untuk preview
    _, img_encoded = cv2.imencode('.jpg', result_img)
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')
    
    # Simpan sementara untuk download
    _, buffer = cv2.imencode('.jpg', result_img)
    io_buf = io.BytesIO(buffer)
    
    return jsonify({
        'image': img_base64,
        'download_url': f'/download?color={color_name}'
    })

@app.route('/download')
def download_image():
    # Pada implementasi nyata, gunakan session atau temporary storage
    return send_file('path/to/temp.jpg', as_attachment=True, download_name='paspor.jpg')

if __name__ == '__main__':
    app.run(debug=True)