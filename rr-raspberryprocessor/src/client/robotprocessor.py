import asyncio
import aiohttp
import time
import socketio
import requests
import serial

loop = asyncio.get_event_loop()
sio = socketio.AsyncClient()
start_timer = None
isArduinoConnected = False
if (not isArduinoConnected):
    try:
        arduino = serial.Serial(port='COM4', baudrate=115200, timeout=.1)
        isArduinoConnected = True
        print ('Connected to Arduino on COM4')
    except serial.serialutil.SerialException:
        print ('Arduino not connected on COM4')

if (not isArduinoConnected):
    try:
        arduino = serial.Serial(port='/dev/ttyACM0', baudrate=115200, timeout=.1)
        isArduinoConnected = True
        print ('Connected to Arduino on /dev/ttyACM0')
    except serial.serialutil.SerialException:
        print ('Arduino not connected on Raspberry /dev/ttyACM0')


def registerRobot():
    i = 2
    isRegistered = False
    addressStr = '192.168.86.24:8765'
    while i < 10 and not isRegistered:
        print('initiating2')
        r = requests.post('http://192.168.86.116:3000/rest/registerrobot' + '/' + addressStr)
        if r.status_code == 200 or r.status_code == 201:
            print(r.status_code, 'Success')
            isRegistered = True
        print(r)
        print(r.content)
        time.sleep(2)   
        i+=1

def write_read(x):
    try: arduino 
    except:
        print('Cant write to arduino serial is not initialized')
    else:
        arduino.write(bytes(x, 'utf-8'))
    
async def send_registration():
    global start_timer
    start_timer = time.time()
    await sio.emit('join_robot')

@sio.event
async def connect():
    print('connected to server')
    await send_registration()

@sio.event
async def testing_connection():
    print('this is for testing a message')   

@sio.event
async def robot_move(direction):
    print('this is for robot_move ', direction)
    write_read(direction)     
    

async def start_server():
#    write_read('s')
#    time.sleep(0.05)
#    data = arduino.readline()
#    print(data)

    isConnected = False
    
    while not isConnected: 
        try:
            await sio.connect('http://192.168.86.116:3000')
            isConnected = True
        #except BaseException as err:
        except socketio.exceptions.ConnectionError as err:            
            print('error connecting to 192.168.86.116:3000')   
            time.sleep(3)

    registerRobot()
    await sio.wait()

if __name__ == '__main__':
    loop.run_until_complete(start_server())

#async def main():
#    start_server()

#loop = asyncio.get_event_loop()
#loop.run_until_complete(main())
