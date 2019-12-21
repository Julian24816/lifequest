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

    let running = false;
    const particles = [];

    function random(limit = 1, floor = true) {
        const r = Math.random() * limit;
        return floor ? Math.floor(r) : r;
    }

    function spawnParticle(x = undefined, y = undefined) {
        particles.push({
            x: x !== undefined ? x : random(canvas.width),
            y: y !== undefined ? y : random(canvas.height),
            radius: random(4) + 1,
            color: "rgb(165,104,246)",
            lifetime: 100,
        });
    }

    function drawParticle(particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function updateParticle(particle) {
        particle.lifetime -= 1;
        particle.y += 1;
    }

    function removeDeadParticles(particles) {
        for (let i = particles.length -1; i >= 0; i--) if (!particles[i].lifetime) particles.splice(i, 1);
    }

    function animation() {
        particles.forEach(drawParticle);
        particles.forEach(updateParticle);
        removeDeadParticles(particles);
        running = particles.length > 0;
        if (running) requestAnimationFrame(animation);
    }


    function confetti(number) {
        for (let i = 0; i < number; i++) spawnParticle();
        if (!running) requestAnimationFrame(animation);
        running = true;
    }

    return confetti;
}();