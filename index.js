// SqmLab.com
// Author: sqmscm@sqmlab.com
// (c)2017 Copyright
"use strict"
var log = console.log.bind(console);
var canvas = document.getElementById('background');
var context = canvas.getContext('2d');
var objects = [];
var radius = canvas.width / 640;
var pointShape = function(pointsArray, pointsPerEdge, setRotate, setRotateCentreX, setRotateCentreY) {
    var o = {
        points: pointsArray || [],
        dotPerEdge: pointsPerEdge || 0,
        rotate: setRotate || 0,
        rotateCentreX: setRotateCentreX || 0,
        rotateCentreY: setRotateCentreY || 0,
        noAnimation: false,
    }
    o.move = function() {
        return;
    }
    return o;
}
var obj = function(setx, sety, setcolor) {
    var o = {
        x: setx,
        y: sety,
        r: radius,
        color: setcolor,
    };
    return o;
}
const renderAll = function() {
    if (objects.length == 0)
        return;
    drawBackground('#333333');
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].rotate != 0) {
            context.save();
            context.translate(objects[i].rotateCentreX, objects[i].rotateCentreY);
            context.rotate(objects[i].rotate * Math.PI / 180);
            context.translate(-objects[i].rotateCentreX, -objects[i].rotateCentreY);
        }
        for (var j = 0; j < objects[i].points.length; j++) {
            context.fillStyle = objects[i].points[j].color;
            context.beginPath();
            context.arc(objects[i].points[j].x, objects[i].points[j].y, objects[i].points[j].r, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
        if (objects[i].rotate != 0) {
            context.restore();
        }
    }
}
const transform = function(elements, targets) {
    if (targets.length == 0)
        return;
    var counter = [];
    var current = [];
    var done = [];
    var timeCounter = 0;
    for (var i = 0; i < targets.length; i++) {
        current.push(0);
        counter.push(0);
        done.push(false);
    }
    for (var i = 0; i < elements.length; i++) {
        objects.push(elements[i]);
    }
    const render = function(targets) {
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i][current[i]];
            elements[i].rotate = target.rotate;
            elements[i].rotateCentreX = target.rotateCentreX;
            elements[i].rotateCentreY = target.rotateCentreY;
            counter[i] = 0;
            for (var j = 0; j < elements[i].points.length; j++) {
                if (target.noAnimation) {
                    elements[i].points[j].x = target.points[j].x;
                    elements[i].points[j].y = target.points[j].y;
                } else {
                    elements[i].points[j].x -= (elements[i].points[j].x - target.points[j].x) / 15;
                    elements[i].points[j].y -= (elements[i].points[j].y - target.points[j].y) / 15;
                }
                if (Math.abs(elements[i].points[j].x - target.points[j].x) < 1 && Math.abs(elements[i].points[j].y - target.points[j].y) < 5) {
                    counter[i]++;
                }
                // target.move(done[i]);
            }
            if (counter[i] == elements[i].points.length) {
                done[i] = true;
                var k = true;
                for (var j = 0; j < done.length; j++) {
                    if (!done[j])
                        k = false;
                }
                if (k) {
                    target.move(true);
                    if (timeCounter++ > (target.duration || 90)) {
                        for (var j = 0; j < current.length; j++) {
                            if (current[j] < targets[j].length - 1) {
                                current[j]++;
                            } else current[j] = 0;
                        }
                        for (var j = 0; j < done.length; j++) {
                            done[j] = false;
                        }
                        timeCounter = 0;
                    }
                }
            }
        }
        setTimeout(function() {
            renderAll();
            render(targets);
        }, 1000 / 30);
    }
    render(targets);
}
const drawBackground = function(color) {
    canvas.height = canvas.height;
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}
const blankElements = function(objPerEdge, color) {
    var elements = [];
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var t = obj(canvas.width / 2, canvas.height / 2, color);
        elements.push(t);
    }
    return pointShape(elements, objPerEdge);
}
const generateSetOne = function() {
    var objPerEdge = 20;
    //Rectangle
    var px = canvas.width / objPerEdge;
    var py = canvas.height / objPerEdge;
    var objs = [];
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var m = obj(px / 2 + px * (i % objPerEdge), py / 2 + py * Math.floor(i / objPerEdge), '#FFCC99')
        objs.push(m);
    }
    var bigRect = pointShape(objs, objPerEdge);
    //Trapezoid
    var ty = py / 4;
    var tars = [];
    var starty = canvas.height * 3 / 4;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var lengx = canvas.width * (0.4 + (0.4 / objPerEdge) * Math.floor(i / objPerEdge));
        var tx = lengx / objPerEdge;
        var startx = canvas.width * 0.5 - lengx / 2;
        var tempx = startx + i % objPerEdge * tx;
        var m = obj(tempx, starty + ty * Math.floor(i / objPerEdge), '#FFCC99');
        tars.push(m);
    }
    var bigTrap = pointShape(tars, objPerEdge);
    //Trapezoid No.2
    var ty = py / 6;
    var trap = [];
    var starty = canvas.height * 3 / 4;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var lengx = canvas.width * (0.15 + (0.15 / objPerEdge) * (objPerEdge - Math.floor(i / objPerEdge)));
        var tx = lengx / objPerEdge;
        var startx = canvas.width * 0.75 - lengx / 2;
        var tempx = startx + i % objPerEdge * tx;
        var m = obj(tempx, starty + ty * Math.floor(i / objPerEdge), '#FFCC99');
        trap.push(m);
    }
    var bigTrap2 = pointShape(trap, objPerEdge, 0, trap[objPerEdge * objPerEdge / 2 + objPerEdge / 2].x, trap[objPerEdge * objPerEdge / 2 + objPerEdge / 2].y);
    bigTrap2.right = true;
    bigTrap2.move = function(done) {
        if (done) {
            if (bigTrap2.right) {
                bigTrap2.rotate += 1;
                if (bigTrap2.rotate >= 10)
                    bigTrap2.right = false;
            } else {
                bigTrap2.rotate -= 1;
                if (bigTrap2.rotate <= -10)
                    bigTrap2.right = true;
            }
        }
    }

    //Rectangle No.1
    var rect2 = [];
    var rex = canvas.width / objPerEdge / 3,
        rey = canvas.height / objPerEdge;
    var startx = 0.5 * rex,
        starty = 0.5 * rey;
    for (var i = 0; i < 400; i++) {
        var m = obj(startx + rex * (i % objPerEdge), starty + rey * Math.floor(i / objPerEdge), '#FFCC99')
        rect2.push(m);
    }
    var bigRect1 = pointShape(rect2, objPerEdge);

    //Rectangle No.2
    var rect = [];
    var rex = Math.sqrt(canvas.height * canvas.height / 4 + canvas.width * canvas.width / 4) / 50,
        rey = rex;
    var startx = canvas.width / 2 - 3.5 * rex,
        starty = canvas.height / 2 - 3 * rey;
    for (var i = 0; i < 8 * 50; i++) {
        var m = obj(startx + rex * (i % 8), starty - rey * Math.floor(i / 8), '#FFCC99')
        rect.push(m);
    }
    var bigRect2 = pointShape(rect, objPerEdge, 0, canvas.width / 2, canvas.height / 2);
    bigRect2.duration = 200;
    generateSetOne.degree = 0;
    bigRect2.move = function(done) {
        if (done) {
            bigRect2.rotate += 2;
            if (bigRect2.rotate == 360)
                bigRect2.rotate = 0;
            generateSetOne.degree = bigRect2.rotate;
        }
    }

    //Random
    var random = [];
    var ranx = (canvas.width >= canvas.height) ? (canvas.width / 40) : (canvas.width / 30),
        rany = (canvas.width >= canvas.height) ? (canvas.height / 30) : (canvas.height / 40);
    var scalex = (canvas.width >= canvas.height) ? 40 : 30;
    var startx = ranx / 2,
        starty = rany / 2;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var randomx = Math.floor(Math.random() * scalex);
        var randomy = Math.floor(Math.random() * 1200 / scalex);
        var m = obj(startx + ranx * randomx, starty + rany * randomy, '#FFCC99')
        random.push(m);
    }
    var randoms = pointShape(random, objPerEdge);

    var tarList = [bigRect, bigTrap, bigTrap2, bigRect1, bigRect2, randoms];
    return tarList;
}
const generateSetTwo = function() {
    var objPerEdge = 20;
    var px = canvas.width / objPerEdge;
    var py = canvas.height / objPerEdge;
    //Rhombus
    var rhom = [];
    var starty = canvas.height * 0.2;
    var startx = canvas.width / 2 - canvas.height * 0.3;
    var rx = py * 0.6,
        ry = rx;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var rectx = startx + i % objPerEdge * rx;
        var recty = starty + Math.floor(i / objPerEdge) * ry;
        var m = obj(rectx, recty, '#00CCFF');
        rhom.push(m);
    }
    var bigRhom = pointShape(rhom, objPerEdge, 45, rhom[objPerEdge * objPerEdge / 2 + objPerEdge / 2].x, rhom[objPerEdge * objPerEdge / 2 + objPerEdge / 2].y);

    //Buildings
    var buildings = [];
    var bx = (canvas.width - canvas.width * 0.4) / 8 / 8,
        by = bx;
    var starty = canvas.height * 4 / 5;
    var startx = canvas.width * 0.2;
    for (var i = 0; i < 4 * 15; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#00CCFF');
        buildings.push(m);
    }
    startx += bx * 8;
    for (var i = 0; i < 4 * 30; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#00CCFF');
        buildings.push(m);
    }
    startx += bx * 8;
    for (var i = 0; i < 4 * 20; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#00CCFF');
        buildings.push(m);
    }
    startx += bx * 8;
    for (var i = 0; i < 4 * 35; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#00CCFF');
        buildings.push(m);
    }
    var builds = pointShape(buildings, objPerEdge);

    //Sea
    var drops = [];
    var sx = canvas.width / 40,
        sy = sx / 2;
    var startx = sx / 2,
        starty = canvas.height - sy * 5;
    for (var i = 0; i < 10 * 40; i++) {
        var tempx = startx + sx * (i % 40);
        var fixy = starty - sy * (5 - Math.abs(i % 40 % 10 - 5));
        var tempy = fixy + sy * Math.floor(i / 40);
        var m = obj(tempx, tempy, '#00CCFF');
        drops.push(m);
    }
    var sea = pointShape(drops, objPerEdge);
    sea.move = function(done) {
        if (done) {
            sea.noAnimation = true;
            for (var i = 0; i < 10 * 40; i++) {
                sea.points[i].x += 2;
                if (sea.points[i].x > canvas.width) {
                    sea.points[i].x = 0;
                }
            }
        } else {
            sea.noAnimation = false;
        }
    }

    //Rectangle No.1
    var rect2 = [];
    var rex = canvas.width / objPerEdge / 3,
        rey = canvas.height / objPerEdge;
    var startx = canvas.width / 3 + 0.5 * rex,
        starty = 0.5 * rey;
    for (var i = 0; i < 400; i++) {
        var m = obj(startx + rex * (i % objPerEdge), starty + rey * Math.floor(i / objPerEdge), '#00CCFF')
        rect2.push(m);
    }
    var bigRect1 = pointShape(rect2, objPerEdge);

    //Rectangle No.2
    var rect = [];
    var rex = Math.sqrt(canvas.height * canvas.height / 4 + canvas.width * canvas.width / 4) / 50,
        rey = rex;
    var startx = canvas.width / 2 - 3.5 * rex,
        starty = canvas.height / 2 - 3 * rey;
    for (var i = 0; i < 8 * 50; i++) {
        var m = obj(startx + rex * (i % 8), starty - rey * Math.floor(i / 8), '#00CCFF')
        rect.push(m);
    }
    var bigRect2 = pointShape(rect, objPerEdge, 120, canvas.width / 2, canvas.height / 2);
    bigRect2.duration = 200;
    bigRect2.move = function(done) {
        if (done)
            bigRect2.rotate = generateSetOne.degree + 120;
    }
    //Random
    var random = [];
    var ranx = (canvas.width >= canvas.height) ? (canvas.width / 40) : (canvas.width / 30),
        rany = (canvas.width >= canvas.height) ? (canvas.height / 30) : (canvas.height / 40);
    var scalex = (canvas.width >= canvas.height) ? 40 : 30;
    var startx = ranx / 2,
        starty = rany / 2;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var randomx = Math.floor(Math.random() * scalex);
        var randomy = Math.floor(Math.random() * 1200 / scalex);
        var m = obj(startx + ranx * randomx, starty + rany * randomy, '#00CCFF')
        random.push(m);
    }
    var randoms = pointShape(random, objPerEdge);

    var tarList = [bigRhom, builds, sea, bigRect1, bigRect2, randoms];
    return tarList;
}
const generateSetThree = function() {
    var objPerEdge = 20;
    var px = canvas.width / objPerEdge;
    var py = canvas.height / objPerEdge;
    //Rhombus
    var rhom = [];
    var starty = canvas.height * 0.35;
    var startx = canvas.width / 2 - canvas.height * 0.15;
    var rx = py * 0.3,
        ry = rx;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var rectx = startx + i % objPerEdge * rx;
        var recty = starty + Math.floor(i / objPerEdge) * ry;
        var m = obj(rectx, recty, '#FF6699');
        rhom.push(m);
    }
    var bigRhom = pointShape(rhom, objPerEdge, 45, rhom[objPerEdge * objPerEdge / 2 + objPerEdge / 2].x, rhom[objPerEdge * objPerEdge / 2 + objPerEdge / 2].y);
    //Buildings
    var buildings = [];
    var bx = (canvas.width - canvas.width * 0.4) / 8 / 8,
        by = bx;
    var starty = canvas.height * 4 / 5;
    var startx = canvas.width * 0.2 + bx * 32;
    for (var i = 0; i < 4 * 20; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#FF6699');
        buildings.push(m);
    }
    startx += bx * 8;
    for (var i = 0; i < 4 * 30; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#FF6699');
        buildings.push(m);
    }
    startx += bx * 8;
    for (var i = 0; i < 4 * 35; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#FF6699');
        buildings.push(m);
    }
    startx += bx * 8;
    for (var i = 0; i < 4 * 15; i++) {
        var rectx = startx + i % 4 * bx,
            recty = starty - Math.floor(i / 4) * by;
        var m = obj(rectx, recty, '#FF6699');
        buildings.push(m);
    }
    var builds = pointShape(buildings, objPerEdge);

    //Rhombus No.2
    var rhom2 = [];
    var starty = canvas.height * 0.05;
    var startx = canvas.width * 0.05;
    var rx = canvas.width * 0.05 / objPerEdge,
        ry = rx;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var rectx = startx + i % objPerEdge * rx;
        var recty = starty + Math.floor(i / objPerEdge) * ry;
        var m = obj(rectx, recty, '#FF6699');
        rhom2.push(m);
    }
    var bigRhom2 = pointShape(rhom2, objPerEdge, 45, rhom2[objPerEdge * objPerEdge / 2 + objPerEdge / 2].x, rhom2[objPerEdge * objPerEdge / 2 + objPerEdge / 2].y);
    bigRhom2.move = function(done) {
        if (done)
            bigRhom2.rotate += 4;
    }

    //Rectangle No.1
    var rect2 = [];
    var rex = canvas.width / objPerEdge / 3,
        rey = canvas.height / objPerEdge;
    var startx = canvas.width * 2 / 3 + 0.5 * rex,
        starty = 0.5 * rey;
    for (var i = 0; i < 400; i++) {
        var m = obj(startx + rex * (i % objPerEdge), starty + rey * Math.floor(i / objPerEdge), '#FF6699')
        rect2.push(m);
    }
    var bigRect1 = pointShape(rect2, objPerEdge);

    //Rectangle No.2
    var rect = [];
    var rex = Math.sqrt(canvas.height * canvas.height / 4 + canvas.width * canvas.width / 4) / 50,
        rey = rex;
    var startx = canvas.width / 2 - 3.5 * rex,
        starty = canvas.height / 2 - 3 * rey;
    for (var i = 0; i < 8 * 50; i++) {
        var m = obj(startx + rex * (i % 8), starty - rey * Math.floor(i / 8), '#FF6699')
        rect.push(m);
    }
    var bigRect2 = pointShape(rect, objPerEdge, 240, canvas.width / 2, canvas.height / 2);
    bigRect2.duration = 200;
    bigRect2.move = function(done) {
        if (done)
            bigRect2.rotate = generateSetOne.degree + 240;
    }

    //Random
    var random = [];
    var ranx = (canvas.width >= canvas.height) ? (canvas.width / 40) : (canvas.width / 30),
        rany = (canvas.width >= canvas.height) ? (canvas.height / 30) : (canvas.height / 40);
    var scalex = (canvas.width >= canvas.height) ? 40 : 30;
    var startx = ranx / 2,
        starty = rany / 2;
    for (var i = 0; i < objPerEdge * objPerEdge; i++) {
        var randomx = Math.floor(Math.random() * scalex);
        var randomy = Math.floor(Math.random() * 1200 / scalex);
        var m = obj(startx + ranx * randomx, starty + rany * randomy, '#FF6699')
        random.push(m);
    }
    var randoms = pointShape(random, objPerEdge);

    var tarList = [bigRhom, builds, bigRhom2, bigRect1, bigRect2, randoms];
    return tarList;
}
const main = function() {
    const resizeCanvas = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        radius = canvas.width / 640;
    };
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
    //Start Position
    var ele1 = blankElements(20, '#FFCC99'),
        ele2 = blankElements(20, '#00CCFF'),
        ele3 = blankElements(20, '#FF6699');
    var elements = [ele1, ele2, ele3];
    //Start Animation
    var tarList1 = generateSetOne(),
        tarList2 = generateSetTwo(),
        tarList3 = generateSetThree();
    var targets = [tarList1, tarList2, tarList3];
    transform(elements, targets);
}
main();
