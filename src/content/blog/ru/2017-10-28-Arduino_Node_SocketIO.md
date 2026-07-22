---
title: 'Подключение Arduino к веб-странице через Node.js и Socket.IO'
date: 2017-10-28
tags: ['projects']
description: 'Руководство по подключению Arduino к веб-странице через Node.js и Socket.IO'
---

Arduino — классная штука: люди делают с ним самые разные интересные вещи, от роботов до синтезаторов. Так вышло, что знакомый дал мне один поиграться. После экспериментов и поисков в Google я связал Arduino с веб-страницей. Это оказалось совсем несложно, и ниже — небольшое руководство, как это сделать. Надеюсь, оно вам пригодится и вы соберёте на его основе что-то большее.

Исходный код можно скачать [здесь](https://github.com/IgorKonovalov/Arduino_to_Node).

В этом руководстве вы научитесь передавать данные с потенциометра на Arduino через последовательный порт на Node-сервер, а затем на веб-страницу через Socket.IO — так страница будет знать об изменениях потенциометра и реагировать на них.

Начнём с настройки Arduino. Я использую nano, но это не принципиально. Вот моя схема подключения:

![arduino wiring](/images/Arduino_node/arduino-socketio.png)

Код для Arduino предельно прост:

```java
int sensorPin = A0; // potentiometer is connected to analog pin 0
int sensorValue;

void setup()
{
  Serial.begin(9600); // opens serial port, sets data rate to 9600 bps
}

void loop()
{
  sensorValue = analogRead(sensorPin); // we read values from pin
  Serial.println(sensorValue); // and send it to serial port
}
```

Теперь можно подключить Arduino к компьютеру по USB, и он будет постоянно отправлять данные в последовательный порт. Запустим Node-сервер, чтобы их слушать. Понадобятся node и npm (на момент написания я использую node 8.7).

Создайте новую папку и инициализируйте её:

```bash
mkdir Arduino-Node-SockeIO && cd Arduino-Node-SockeIO && npm init -y
```

Понадобятся всего три пакета: Express — для простой настройки сервера, SerialPort — для прослушивания порта и Socket.IO — для связи Node-сервера с веб-страницей. Установим их:

```bash
npm i -S express serialport socket.io
```

Создайте файл server.js в корне проекта и добавьте эти строки:

```javascript
const http = require('http');
const express = require('express');
const app = express();

const Server = http.createServer(app);
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
});

Server.listen(port, () => {
  console.log(`Express server started on ${port}`);
});
```

Добавьте start-скрипт в package.json:

```javascript
...
"scripts": {
  "start": "node server.js"
}
...
```

Теперь при запуске

```bash
npm run start
```

в терминале должно появиться «Express server started on 3000». А если открыть в браузере localhost:3000, вы увидите:

![localhost](/images/Arduino_node/localhost.png)

Отлично! Добавим интеграцию с socket.io.
Создайте в корне папку _public_ и добавьте туда файл index.html со следующим кодом:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Arduino-Node-SocketIO</title>
  </head>
  <body>
    <style>
      body {
        transition: all 0.1s;
        /* transition for smoothness */
      }
    </style>
    <script src="/socket.io/socket.io.js"></script>
    <script src="index.js"></script>
  </body>
</html>
```

Добавьте index.js в ту же папку:

```javascript
const socket = io.connect('http://localhost:3000');

socket.on('connected', () => {
  console.log('Socket Connected');
});
socket.on('disconnect', () => {
  console.log('Socket Disconnected');
});
socket.on('click', () => console.log('server registered click event'));

document.addEventListener(
  'click',
  (e) => socket.emit('click', { x: e.clientX, y: e.clientY }),
  // we listening for client click events
  // and sending this data to server
);
```

Добавьте следующий код в server.js (корневая папка):

```javascript
// remove lines:
app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
});

// and add lines:
const io = require('socket.io').listen(Server); // we creating socket object

app.use(express.static(__dirname + '/public'));
// we serving files from "public" directory

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('connected');
  socket.on('click', ({ id, x, y }) => {
    console.log(`socket with id ${id} just clicked on { ${x}, ${y} }`);
    // print to console event from web page
    socket.emit('click'); // and let page knows it
  });
});
```

Сначала проверим: если перезапустить сервер и перейти на localhost:3000, в терминале должно появиться «a user connected», а в консоли браузера — «Socket Connected». Кликните в любом месте страницы — в терминале появятся координаты клика, а в консоли браузера — «server registered click event».

Сокеты поначалу немного сбивают с толку, но идея очень простая: мы слушаем и отправляем события как со стороны сервера, так и со стороны браузера. В коде выше мы запускаем сервер со слушателем «io» — после подключения пользователя отправляем событие «connected», которое уже слушает клиент сокета, и так далее. Сами сокеты — очень обширная тема, а сейчас хотелось бы сосредоточиться на части с Arduino. Напишите в комментариях, если хотите более подробное руководство по сокетам.

Теперь соединим всё вместе.

Часть с Arduino мы уже настроили и подключили по USB к компьютеру. Осталось слушать последовательный порт.
Используем библиотеку SerialPort.

server.js:

```javascript
// delete these lines:
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('connected');
  socket.on('click', ({ id, x, y }) => {
    console.log(`socket with id ${id} just clicked on { ${x}, ${y} }`);
    socket.emit('click');
  });
});

// add these lines:
const serialport = require('serialport');
const sp_readline = serialport.parsers.Readline; // we use readline parser

const sPort = new serialport('__your port here__', {
  // you'll need to check for a port name first and use yours
  baudRate: 9600,
});
const parser = new sp_readline();

sPort.on('open', () => {
  console.log('Serial Port Opened');
  let lastValue;
  io.on('connection', (socket) => {
    socket.emit('connected');
    parser.on('data', (data) => {
      let lastValue;
      // we use additional variable to avoid constant
      // sending data to connected socket
      if (lastValue !== data) {
        socket.emit('data', data);
      }
      lastValue = data;
    });
  });
});
```

index.js

```javascript
// remove these lines
socket.on('click', () => console.log('server recieved a click event'));

document.addEventListener('click', (e) =>
  socket.emit('click', { id: socket.id, x: e.clientX, y: e.clientY }),
);

// add these lines
socket.on('data', (data) => {
  document.body.setAttribute(
    'style',
    `background-color: hsl(${Math.round(data / 3)}, 100%, 50%)`,
  );
});
```

Теперь мы создаём новый слушатель serialPort, который слушает данные с конкретного порта. Порт, к которому подключён Arduino, нужно определить вручную — способов много, например команда «serialport-list» в терминале, если установить пакет serialport глобально.

Когда мы подключены к порту и к сокету, отправляем событие «connected», чтобы сообщить браузеру, что всё в порядке, и начинаем разбирать данные из последовательного порта. Как только эти данные отличаются от предыдущих (чтобы не отправлять их каждые 100 мс), мы отправляем событие data.
Получив событие на стороне браузера, мы просто задаём атрибут background для одного из 1024 / 3 возможных вариантов.

И теперь, если всё работает как задумано, при изменении значения потенциометра на Arduino будет меняться фон страницы. С этим можно придумать множество вариантов применения.

Спасибо за чтение!
Смотрите [исходный код к руководству](https://github.com/IgorKonovalov/Arduino_to_Node).
