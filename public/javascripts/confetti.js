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

    function confetti(number) {
        console.log(number);
    }

    return confetti;
}();