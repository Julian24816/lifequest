const activity = function () {
    document.addEventListener("DOMContentLoaded", init);

    function init() {
        const activityInput = document.getElementById("activity");
        const submitButton = document.getElementById("submit");

        activityInput.onkeypress = ev => {
            if (ev.key === "Enter") {
                submit(activityInput.value);
                activityInput.value = "";
            }
        };
        submitButton.onclick = () => {
            submit(activityInput.value);
            activityInput.value = ""
        }
    }

    function submit(activity = "") {
        if (activity === "") return;
        fetch("/activity", {
            method: "POST", credentials: "include", headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type: activity})
        }).then(response => response.json()).then(data => {
            const confettiAmount = data["confetti"];
            if (confettiAmount) confetti(confettiAmount);
        });
    }

}();