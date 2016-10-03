$(document).ready(function() {
    let ws = new WebSocket("ws://localhost:8888/ws");
    ws.onopen = evt => {
        let conn_status = document.getElementById('conn_text');
        conn_status.innerHTML = "CONNECTED!"
    };
    ws.onmessage = function(evt) {
        let data = JSON.parse(evt.data);
        let newMessage = document.createElement('li');
        newMessage.className = "list-group-item";
        if(data.text){
            let text = data.text.toLowerCase();
            newMessage.textContent = data.text.toLowerCase();
            if(text.indexOf("bank") !== -1){
                document.getElementById('messages_txt')
                    .appendChild(newMessage);
            }
        }
    };
    ws.onclose = evt => {
        let conn_status = document.getElementById('conn_text');
        conn_status.innerHTML = "DISCONNECTED!"
    };
})