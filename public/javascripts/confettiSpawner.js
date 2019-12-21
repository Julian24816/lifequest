// spawn via get parameter
const params = new URLSearchParams(window.location.search);
if (params.has("confetti")) confetti(parseInt(params.get("confetti")));

// spawn via click
document.addEventListener("click", ev => {
    confetti(100, new confetti.ExplosionSpawn(new confetti.Vec2(ev.clientX, ev.clientY)))
});
