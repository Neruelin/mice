#----------Imports and Initialization-------#
import cv2
print(cv2.__version__)

#Import and Read Video
vidcap = cv2.VideoCapture("./test6.avi")
success,image = vidcap.read()

#Begin logic
count = 0
print(success)
while (success):
  cv2.imwrite("./frames/frame" + str(count) + ".jpg", image)
  print("Created: frame" + str(count) + ".jpg")
  success, image = vidcap.read()
  count += 1