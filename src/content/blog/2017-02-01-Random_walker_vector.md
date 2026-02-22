---
title: 'Random walker with vector object (Lévy flight)'
date: 2017-02-01
tags: ['projects']
description: 'Random walker implementation using vector objects and Lévy flight'
demo: 'random-walker-2'
---

Hey everyone! After yesterday attempt to code random walker, I thought it would be a good idea to implement almost same thing but with vector object. As far as I know it's common practice to use vectors to describe coordinates and speed of objects - and it turns to be a good idea in this little do-it-after-came-back-from-work project. Previous version of random walker is [here](/projects/2017/01/31/Simple_Random_walker/)

Take a look at it first, some explanation below:

<!-- Demo: Random Walker with Vector (will be added in Phase 4) -->

Code for vector object is pretty simple - it describes coordinates on canvas:

```javascript
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
```

I also needed some sort of random vector with set length - to describe next step of walker:

```javascript
function randomNumber(min, max) {
  if (min > 0) return (max - min) * Math.random();
  else return (max - min) * Math.random() + min;
}
function randomSign() {
  let test = Math.round(Math.random() * 2);
  if (test == 1) return -1;
  else return 1;
}
Vector.prototype.random = function (length) {
  x = randomNumber(-length, length);
  y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2)) * randomSign();
  return new Vector(x, y);
};
```

After that, I only needed to put start of line on previous point (initial vector), than plus random vector to it and draw a line. Super simple.
Full code - on my [GitHub](https://github.com/IgorKonovalov/Little_projects/tree/master/Random_walker)
