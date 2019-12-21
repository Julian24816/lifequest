const confetti = function () {
    // canvas
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

    // context & text settings
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "20em san-serif";

    // default colors
    const colors = [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]];

    // simulation state
    let running = false;
    const particles = [];

    // random number helpers
    function random(limit = 1, floor = true) {
        const r = Math.random() * limit;
        return floor ? Math.floor(r) : r;
    }

    function choose(array) {
        return array[random(array.length, true)];
    }

    // tuple class
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

    // Particle Spawn Information
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

    // fill simulation with additional particle
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

    // compute color string
    function makeColorString(colorArray = [0, 0, 0], alpha = 1) {
        return "rgba(" + colorArray + ", " + alpha + ")";
    }

    // draw one particle
    function drawParticle(particle) {
        const opacity = particle.lifetime < 10 ? particle.lifetime / 10 : 1;
        ctx.fillStyle = makeColorString(particle.color, opacity);
        ctx.beginPath();
        ctx.arc(particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // update one particle
    function updateParticle(particle) {
        particle.lifetime -= 1;
        particle.pos.add(particle.velocity);
        particle.velocity.add(particle.acceleration);
    }

    // remove dead particle from simulation
    function removeDeadParticles(particles) {
        for (let i = particles.length - 1; i >= 0; i--) if (!particles[i].lifetime) particles.splice(i, 1);
    }

    // tick simulation. clear canvas, when no particles left
    function animation() {
        //update
        particles.forEach(updateParticle);
        removeDeadParticles(particles);
        running = particles.length > 0;

        // draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = makeColorString(confetti.textColor);
        ctx.fillText(confetti.text, canvas.width / 2, canvas.height / 3);
        particles.forEach(drawParticle);

        //next frame
        if (running) requestAnimationFrame(animation);
    }

    // spawn number confetti into the simulation according to spawn information
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

    // exposed values
    confetti.textColor = [233, 64, 35];
    confetti.text = "";
    confetti.canvas = canvas;
    confetti.colors = colors;
    confetti.ParticleSpawn = ParticleSpawn;
    confetti.DelayedSpawn = DelayedSpawn;
    confetti.TopSpawn = TopSpawn;
    confetti.ExplosionSpawn = ExplosionSpawn;
    confetti.Vec2 = Vec2;
    return confetti;
}();