const elements = document.getElementsByTagName("a");
for (let i = 0; i < elements.length; i++) {
    if (elements[i].className === "database-word") {
        elements[i].onclick = ev => {
            const data = {id: ev.target.id};
            fetch("/cms/db", {
                method: "POST",
                body: JSON.stringify(data)
            }).then(response => response.json())
                .then(responseData => {
                    ev.target.parentElement.remove();
                    ev.target.remove();
                });
        }
    }
}