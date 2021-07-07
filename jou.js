var request = new XMLHttpRequest()
var accessToken, tasks, tasksLoaded;

var serverResponse = document.querySelector("[name=response]")
const listDiv = document.querySelector("[id=list]");
var submit = document.getElementById("submit");

var tasksNotLoaded = true;
var tasksLoaded = false; // Nimepidi peaks need üksteise vastandid olema, kuid ei ole nii ja ma ei suuda paremat nime välja mõelda

function reqListener () { // Käivitub igakord kui teha API call
    console.log(this.responseText);
    response = JSON.parse(this.response);
    tasks = response;

    if (this.status == 200 && tasksNotLoaded == true) {
        serverResponse.innerHTML = "Login Successful";
        accessToken = response.access_token;
        loadTasks();
    } else if (this.status == 201 && tasksNotLoaded == true) {
        serverResponse.innerHTML = "Account successfully created";
    } else if (tasksNotLoaded == true) {
        serverResponse.innerHTML = "Login Failed " + this.status + " " + this.statusText + " " + response.message;
    } else if (tasksNotLoaded == false && tasksLoaded == false) { // Käivitub peale edukat sisse logimist ja tekitab olemas olevad taskid ekraanile 
        console.log(tasks);
        tasks.forEach(el => {
            console.log(el);

            var task = document.createElement("div");
            task.id = el.id

            var t = document.createElement("input");
            t.name = "title";
            t.placeholder = "Title";
            t.minLength = "1";
            t.value = el.title;
            
            var n = document.createElement("input");
            n.name = "desc";
            n.placeholder = "Description";
            n.value = el.desc;

            var l = document.createElement("label");
            var d = document.createElement("input");
            d.name = "done";
            d.type = "checkbox";
            d.checked = Boolean(el.done);
            l.innerHTML = " Done: ";
            l.appendChild(d);

            var del = document.createElement("input");
            del.type = "button";
            del.value = "Delete Task";
            del.onclick = deleteTask;

            task.appendChild(t);
            task.appendChild(n);
            task.appendChild(l);
            task.appendChild(del);

            listDiv.appendChild(task);
            tasksLoaded = true;
        })
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
        request.setRequestHeader("Content-Type", "application/json");
    }        
};

function loadTasks() {
    request.open('GET', "http://demo2.z-bit.ee/tasks", true);
    request.setRequestHeader("Authorization", "Bearer " + accessToken);
    request.send();
    tasksNotLoaded = false;

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
            <input name="title" value="" placeholder="Title" minlength="1"/>
            <input name="desc" value="" placeholder="Description"/>
            <label> Done: <input name="done" type="checkbox"/> </label>
            
            <input type="button" value="Delete Task" onclick="deleteTask.call(this)"/>
        </div>`).appendTo($('#list'))
    })    

    saveTasks.onclick = function() {
        var title, desc, done;
        var divs = listDiv.querySelectorAll('div:not([id])');
        var existingTasks = listDiv.querySelectorAll("div[id]");

        existingTasks.forEach(el => {
            console.log(el);
            id = el.id;
            title = el.querySelector("[name=title]").value;
            desc = el.querySelector("[name=desc]").value;
            done = el.querySelector("[name=done]").checked;

            request.open('PUT', "http://demo2.z-bit.ee/tasks/" + id, false);
            request.setRequestHeader("Authorization", "Bearer " + accessToken);
            request.setRequestHeader("Content-Type", "application/json");

            request.send(JSON.stringify({
                "title": title,
                "desc": desc,
                "marked_as_done": done
            }));
        })
        
        divs.forEach(el => {
            console.log(el);
            title = el.querySelector("[name=title]").value;
            desc = el.querySelector("[name=desc]").value;
            done = el.querySelector("[name=done]").checked;

            request.open('POST', "http://demo2.z-bit.ee/tasks", false);
            request.setRequestHeader("Authorization", "Bearer " + accessToken);
            request.setRequestHeader("Content-Type", "application/json");


            request.send(JSON.stringify({
                "title": title,
                "desc": desc,
                "marked_as_done": done
            }));
        })
    }
}

function deleteTask() {
    console.log(this);
    console.log(this.parentElement);
    if (this.parentElement.hasAttribute("id")) {
        this.parentElement.remove();
    }
}