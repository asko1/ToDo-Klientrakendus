var request = new XMLHttpRequest()
var accessToken;

var serverResponse = document.querySelector("[name=response]")
var submit = document.getElementById("submit");

function reqListener () {
    console.log(this.responseText);
    response = JSON.parse(this.response);
    accessToken = response.access_token;
    console.log(accessToken);

    if (this.status == 200) {
        serverResponse.innerHTML = "Login Successful";
        loadTasks();
    } else if (this.status == 201) {
        serverResponse.innerHTML = "Account successfully created";
    } else {
        serverResponse.innerHTML = "Login Failed " + this.status + " " + this.statusText + " " + response.message;
    }
}
request.addEventListener("load", reqListener);

submit.onclick = function(e)
    {
    var registerChecked = document.querySelector("[name=register]").checked
    var username = document.querySelector("[name=username]").value
    var password = document.querySelector("[name=password]").value

    if (password.length < 6) return;

    if (registerChecked) {
        request.open('POST', "http://demo2.z-bit.ee/users", true)
        a();
        request.send(JSON.stringify({
            "username": username,
            "newPassword": password
        }));
    }

    else
    {
        request.open('POST', "http://demo2.z-bit.ee/users/get-token", true) 
        a();
        request.send(JSON.stringify({
            "username": username,
            "password": password
        }));
    }

    function a()
    {  // Järgnev funktsioon oli (on?) kasulik debuggimiseks
        /*request.onload = function (res)
        {
            console.log(data, res, this)   
            var data = JSON.parse(this.response)         
        }*/
        request.setRequestHeader("Content-Type", "application/json")
    }        
};

function loadTasks() {
    const listDiv = document.querySelector("[id=list]");

    const createTask = document.createElement("button");
    createTask.id = "createTask";
    createTask.innerHTML = "Create task";

    const saveTasks = document.createElement("button");
    saveTasks.id = "saveTasks";
    saveTasks.innerHTML = "Save tasks";

    listDiv.appendChild(createTask);
    listDiv.appendChild(saveTasks);

    $('#createTask').on('click', () => {
        $(`<div>
            <input name="title" value="" placeholder="Title"/>
            <input name="desc" value="" placeholder="Description"/>
            <label> Done: <input name="done" type="checkbox"/> </label>
            
            <input type="button" value="Delete Task"/>
        </div>`).appendTo($('#list'))
    })    

    saveTasks.onclick = function() {
        var title, desc, done;
        var divs = listDiv.querySelectorAll('div');
        
        divs.forEach(el => {
            console.log(el);
            title = el.querySelector("[name=title]").value;
            desc = el.querySelector("[name=desc]").value;
            done = el.querySelector("[name=done]").checked;
        })

        request.open('POST', "http://demo2.z-bit.ee/tasks", true)
        request.setRequestHeader("Content-Type", "application/json")
        request.setRequestHeader("Authorization", "Bearer " + accessToken)
    }
}