const confetti = function () {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = canvas.style.left = "0";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.addEventListener("DOMContentLoaded", () => document.body.append(canvas));
    document.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

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

    function spawnParticle(spawnAttributes = new ParticleSpawn()) {
        particles.push({
            pos: spawnAttributes.pos,
            radius: spawnAttributes.radius,
            color: spawnAttributes.color,
            lifetime: spawnAttributes.lifetime,
            velocity: spawnAttributes.velocity,
            acceleration: spawnAttributes.acceleration,
        });
        if (!running) requestAnimationFrame(animation);
        running = true;
    }

    function drawParticle(particle) {
        const opacity = particle.lifetime < 10 ? particle.lifetime / 10 : 1;
        ctx.fillStyle = makeColorString(particle.color, opacity);
        ctx.beginPath();
        ctx.arc(particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function updateParticle(particle) {
        particle.lifetime -= 1;
        particle.pos.add(particle.velocity);
        particle.velocity.add(particle.acceleration);
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

    class Vec2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        add(other) {
            this.x += other.x;
            this.y += other.y;
        }

        copy() {
            return new Vec2(this.x, this.y);
        }
    }

    class ParticleSpawn {
        get pos() {
            return new Vec2(random(canvas.width), canvas.height);
        }

        get radius() {
            return random(4) + 1;
        }

        get color() {
            return choose(colors);
        }

        get lifetime() {
            return random(400) + 100;
        }

        get velocity() {
            return new Vec2(0, random(1, false) + 0.5);
        }

        get acceleration() {
            return new Vec2(0, 0);
        }

        get waitForNextFrame() {
            return false;
        }

        next() {
        }
    }

    class DelayedSpawn extends ParticleSpawn {
        constructor(delayEveryNParticles = 5) {
            super();
            this.delayEveryNParticles = delayEveryNParticles;
            this.counter = 0;
        }

        get waitForNextFrame() {
            return this.counter % this.delayEveryNParticles === 0;
        }

        next() {
            this.counter++;
        }
    }

    class TopSpawn extends DelayedSpawn {
        constructor(delayEveryNParticles) {
            super(delayEveryNParticles);
        }

        get pos() {
            const pos = super.pos;
            pos.y = 0;
            return pos;
        }
    }

    class ExplosionSpawn extends DelayedSpawn {
        constructor(center = new Vec2(), speed = 1, variance = .5) {
            super(20);
            this.center = center;
            this.speed = speed;
            this.variance = variance;
        }

        get pos() {
            return this.center.copy();
        }

        get velocity() {
            const angle = random(Math.PI * 2, false);
            const speed = this.speed + random(this.variance * 2, false) - this.variance;
            return new Vec2(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }

        get acceleration() {
            return new Vec2(0, .02);
        }
    }

    function confetti(number, spawn = new TopSpawn()) {
        for (let i = 0; i < number; i++) {
            spawn.next();
            spawnParticle(spawn);
            if (spawn.waitForNextFrame) {
                requestAnimationFrame(() => confetti(number - i - 1, spawn));
                break;
            }
        }
    }

    confetti.canvas = canvas;
    confetti.colors = colors;
    confetti.ParticleSpawn = ParticleSpawn;
    confetti.DelayedSpawn = DelayedSpawn;
    confetti.TopSpawn = TopSpawn;
    confetti.ExplosionSpawn = ExplosionSpawn;
    confetti.Vec2 = Vec2;
    return confetti;
}();