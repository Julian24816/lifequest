const params = new URLSearchParams(window.location.search);
if (params.has("confetti")) confetti(parseInt(params.get("confetti")));
