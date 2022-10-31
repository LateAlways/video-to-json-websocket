function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    })
}

window.addEventListener('DOMContentLoaded', async (event) => {
    document.getElementById("connect").addEventListener("click", async () => {
        fetch("https://api.fuchsiax.dev/birthday/verify?code=" + (document.getElementsByClassName("text")[0].value))
            .then((res) => res.json())
            .then((res) => {
                if (res["error"] == null) {
                    document.getElementById("error").innerHTML = "";
                    document.querySelectorAll(".widget")[0].hidden = true;
                    document.querySelectorAll(".widget")[1].style.display = "";
                    document.getElementById("message").innerHTML = "Bonjour, " + res["full_name"] + "!<br>" + res["message"];
                } else {
                    document.getElementById("error").innerHTML = res["error"].replace("Invalid code.", "Code invalide.");
                }
            });
    });
    await delay(1000)
    document.getElementById("animateText").innerHTML = "Bonjour!";
    document.getElementById("page").style.opacity = 1;
    await delay(1500);
    document.getElementById("page").style.opacity = 0;
    await delay(750);
    document.getElementById("animateText").innerHTML = "Nous préparons tout pour vous.";
    await delay(1500);
    document.getElementById("page").style.opacity = 1;
    await delay(1500);
    document.getElementById("page").style.transition = "3s"
    document.getElementById("page").style.opacity = 0.6;
    await delay(1500);
    document.getElementById("page").style.opacity = 1;
    await delay(1500);
    document.getElementById("page").style.opacity = 0.6;
    await delay(1500);
    document.getElementById("page").style.opacity = 1;
    await delay(1500);
    document.getElementById("page").style.transition = "0.3s"
    document.getElementById("page").style.opacity = 0;
    await delay(750);
    document.getElementById("animateText").innerHTML = "Tout est prêt.";
    await delay(750);
    document.getElementById("page").style.opacity = 1;
    await delay(2500);
    document.getElementById("page").style.opacity = 0;
    await delay(750);
    document.getElementById("main").style = "";
});