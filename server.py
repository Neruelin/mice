from flask import Flask, Response
import cv2

vidcap = cv2.VideoCapture("./test6.avi")
success,image = vidcap.read()

app = Flask(__name__)

@app.route('/')
def TestFlaskServer():
    return "BLEH"

@app.route('/image')
def getNextImage():

    global success
    global image
    global vidcap

    if (success):
        tempimage = image
        success, image = vidcap.read()
        _, encoded = cv2.imencode(".jpg", tempimage)
        resp = Response(encoded.tostring())
        resp.headers["content-type"] = "image/jpeg"
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
    else:
        return "oops"
        