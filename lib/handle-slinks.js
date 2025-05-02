function handleSlinks() {
    var panel = document.getElementById("slink-dropdown-panel");
    var button = document.getElementById("slink-dropdown-button");
    var icon = document.getElementById("slink-dropdown-icon");
    if (button == null) {
        setTimeout(function(){
            handleSlinks();
        }, 1000);
        return
    }
    button.onclick = function() {
        if (panel.classList.contains("caret")) {
            panel.classList.remove("caret");
            icon.classList.remove("fa-xmark");
            button.classList.remove("slink-pressed");
        } else {
            panel.classList.add("caret");
            icon.classList.add("fa-solid");
            icon.classList.add("fa-xmark");
            button.classList.add("slink-pressed");
        }
    };
}

document.addEventListener("DOMContentLoaded", function(){
    includeHTML();
    setTimeout(function(){
        handleSlinks();
    }, 500);
});