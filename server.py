from flask import Flask,\
     Response, request, make_response, jsonify
import os.path
import base64
import pandas as pd
import cv2

videoDirectory = "./videos"
videoName = "test1.mp4"
videoNameNoExt = ".".join(videoName.split('.')[:-1])

frameDirectory = "./frames"

dataDirectory = "./data"

csvPath = dataDirectory + "/" + videoNameNoExt + ".csv"

dataColumns = ["VideoName", "FrameNumber", "X", "Y", "Width", "Height", "Found"]

dataFrame = pd.DataFrame(columns=dataColumns)

if (os.path.exists(csvPath) and os.path.isfile(csvPath)):
    dataFrame = pd.read_csv(csvPath)

vidcap = cv2.VideoCapture(videoDirectory + '/' + videoName)
success,image = vidcap.read()
count = 1

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

app = Flask(__name__)

@app.route('/')
def TestFlaskServer():
    return "BLEH"

@app.route('/image', methods=['GET', 'OPTIONS'])
def getNextImage():
    # print(request.method)
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    global success
    global image
    global vidcap
    global count

    if (success):
        tempimage = image
        for i in range(15):
            success, image = vidcap.read()
            count += 1
            _, encoded = cv2.imencode(".jpg", tempimage)

        hexstr = base64.b64encode(encoded)
        data = {"Image": str(hexstr)[2:-1], "Frame": str(count), "VideoName": videoNameNoExt}
        resp = jsonify(data)
        resp.headers.add("content-type", "Application/JSON")
        resp.headers.add("Access-Control-Allow-Origin", "*")
        resp.headers.add('Access-Control-Allow-Headers', "*")
        resp.headers.add('Access-Control-Allow-Methods', "*")
        return resp
    else:
        return "oops"

@app.route('/submit', methods=['POST', 'OPTIONS'])
def receiveLabel():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    global dataFrame
    # print(request.json['pos1'])
    json = request.json
    print(json['Frame'])
    dataFrame = dataFrame.append({ \
        'VideoName': json['VideoName'],  \
        'FrameNumber': json['Frame'], \
        'X': json['X'], \
        'Y': json['Y'], \
        'Width': json['Width'], \
        'Height': json['Height'], \
        'Found': json['Found'] \
        }, ignore_index=True)
    dataFrame.to_csv(csvPath)
    return _corsify_actual_response(Response("oops"))
