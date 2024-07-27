const app_name = "Unreliable Pod "
var header = document.getElementsByClassName('app-title');
fetch('/name')
    .then(res => {
        if (res.ok) {
            // Parse the response as JSON
            return res.json();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        // Update the text content of the header
        header[0].textContent = app_name + `(${data.name})`;
    })
    .catch(err => {
        // Log the error or handle it appropriately
        console.error('There was a problem with the fetch operation:', err);
    });

for (let i = 1; i <= 9; i++) {
    let box = document.getElementById(`box-${i}`);
    let modal = document.getElementById(`dialog-${i}`);
    if(!box||!modal) {
        continue;
    }
    box.addEventListener('click', () => modal.showModal());
    document.addEventListener('click', ({ target }) => target === modal && modal.close());
}