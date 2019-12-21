const confetti = function () {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = canvas.style.left = "0";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.addEventListener("DOMContentLoaded", () => document.body.append(canvas));

    const ctx = canvas.getContext("2d");
    ////////////////////////////////// temp text test
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "20em san-serif";
    ctx.fillStyle = "rgb(18,196,61)";
    ctx.fillText("Merry Christmas :)", canvas.width / 2, canvas.height / 3);
    ////////////////////////////////// TODO remove tempt text test

    const colors = [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]];

    let running = false;
    const particles = [];

    function random(limit = 1, floor = true) {
        const r = Math.random() * limit;
        return floor ? Math.floor(r) : r;
    }

    function choose(array) {
        return array[random(array.length, true)];
    }

    function makeColorString(colorArray = [0, 0, 0], alpha = 1) {
        return "rgba(" + colorArray + ", " + alpha + ")";
    }

    function spawnParticle(x = undefined, y = undefined) {
        particles.push({
            x: x !== undefined ? x : random(canvas.width),
            y: y !== undefined ? y : random(canvas.height),
            radius: random(4) + 1,
            color: choose(colors),
            lifetime: random(400) + 100,
            speed: random(1, false) + 0.5,
        });
        if (!running) requestAnimationFrame(animation);
        running = true;
    }

    function drawParticle(particle) {
        const opacity = particle.lifetime < 10 ? particle.lifetime / 10 : 1;
        ctx.fillStyle = makeColorString(particle.color, opacity);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function updateParticle(particle) {
        particle.lifetime -= 1;
        particle.y += particle.speed;
    }

    function removeDeadParticles(particles) {
        for (let i = particles.length - 1; i >= 0; i--) if (!particles[i].lifetime) particles.splice(i, 1);
    }

    function animation() {
        // draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(drawParticle);

        //update
        particles.forEach(updateParticle);
        removeDeadParticles(particles);
        running = particles.length > 0;

        //next frame
        if (running) requestAnimationFrame(animation);
        else requestAnimationFrame(() => ctx.clearRect(0, 0, canvas.width, canvas.height));
    }

    function topDelayed(delayEveryNParticles = 3) {
        let counter = 0;
        let x = random(canvas.width);
        let y = 0;

        function inc() {
            counter++;
            x = random(canvas.width);
        }

        return {
            get x() {
                return x;
            },
            get y() {
                return y;
            },
            get waitForNextFrame() {
                return counter % delayEveryNParticles === 0;
            },
            get next() {
                return inc;
            }
        }
    }

    function confetti(number, spawn = topDelayed()) {
        for (let i = 0; i < number; i++) {
            spawn.next();
            spawnParticle(spawn.x, spawn.y);
            if (spawn.waitForNextFrame) {
                requestAnimationFrame(() => confetti(number - i - 1, spawn));
                break;
            }
        }
    }

    confetti.colors = colors;
    return confetti;
}();