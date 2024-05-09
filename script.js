const apikey = '1bfb148d-105e-4eb7-a99e-8ae0238e2d4a';
const apihost = 'https://todo-api.coderslab.pl';
const apitasks = apihost + '/api/tasks'
const apioperations = apihost + '/api/operations'


function apiListTasks(serverAddress, apiKey){
    return     fetch(serverAddress, {
        method: 'get',
        headers: {
            Authorization: apiKey
        }
    })

        .then(function(response){
            if (!response.ok){
                alert('Wystąpił bład! Otwórz devtools i zakładkę Sieć/Network')
            }
            // console.log(response)
            return response.json()
        })
        // .then (function(resp){
        //     // console.log(resp.data)
        //     return resp.data
        // })

        .catch(function (error){
            // console.log(error)
            return error;
        })


}

function renderTask(addedDate, description, id, status, title){
    const main = document.querySelector("main");

    const deleteButton = document.createElement("button")
    const finishButton = document.createElement("button")
    const addOperationButton = document.createElement("button");
    const section = document.createElement("section");
    const divHeader = document.createElement("div");
    const divTaskTitle = document.createElement("div");
    const h5TaskTitle = document.createElement("h5");
    const h6TaskDescription = document.createElement("h6");
    const divTaskButtons = document.createElement("div");
    const ulOperations = document.createElement("ul");
    const divFormCard = document.createElement("div");
    const formOperations = document.createElement("form");
    const divFormInputGroup = document.createElement("div")
    const inputTextOperations = document.createElement("input")
    const divInputGroupAppend = document.createElement("div");



    deleteButton.innerText = 'Delete';
    finishButton.innerText = 'Finish';
    h5TaskTitle.innerText = title;
    h6TaskDescription.innerText = description;
    addOperationButton.innerText = 'Add'

    deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
    finishButton.className = "btn btn-dark btn-sm";
    section.className = "card mt-5 shadow-sm"
    divHeader.className = "card-header d-flex justify-content-between align-items-center";
    h6TaskDescription.className = "card-subtitle text-muted";
    ulOperations.className = "list-group list-group-flush";
    divFormCard.className = "card-body";
    divFormInputGroup.className = "input-group";
    inputTextOperations.className = "form-control";
    divInputGroupAppend.className = "input-group-append";
    addOperationButton.className = "btn btn-info";

    apiListOperationsForTask(apitasks, apikey, id)
        .then(resp => {
            if (!resp.error){
                // console.log(`Operations for id: ${id}, response: ${resp}`);
                console.log('response for operations: ', resp.data)
                tasksOperationsProcessor(resp.data, ulOperations)
            }
        })

    inputTextOperations.setAttribute("type", "text");
    inputTextOperations.setAttribute("placeholder", "Operation description");
    inputTextOperations.setAttribute("minlength", "5")

    divTaskTitle.appendChild(h5TaskTitle);
    divTaskTitle.appendChild(h6TaskDescription);

    if (status === 'open'){
        divTaskButtons.appendChild(finishButton)
    }
    divTaskButtons.appendChild(deleteButton);

    divHeader.appendChild(divTaskTitle);
    divHeader.appendChild(divTaskButtons)

    divInputGroupAppend.appendChild(addOperationButton);

    divFormInputGroup.appendChild(inputTextOperations);
    divFormInputGroup.appendChild(divInputGroupAppend)

    formOperations.appendChild(divFormInputGroup);

    divFormCard.appendChild(formOperations)

    section.appendChild(divHeader)
    section.appendChild(ulOperations);
    section.appendChild(divFormCard);

    main.appendChild(section);



    deleteButton.addEventListener("click", function(event){
        apiDeleteTask(apitasks, apikey, id)
            .then(resp => {
                if (!resp.error){
                    console.log("Deleted: ", resp.data);
                    section.remove();
                }
            })

    //     usuniesz z drzewa DOM całe <section>

    })

    finishButton.addEventListener("click", function(event){
        apiUpdateTask(id, title, description, status)
    })

    formOperations.addEventListener("submit", function(event){
        event.preventDefault();
        console.log("here should be the code for handling adding operation for the task of id: ", id)
    })
    console.log(`task ID: ${id}`);
    console.log(`task title: ${title}`)
}

function tasksListProcessor(tasksList){
    tasksList.forEach(function (task){
        renderTask(
            task.addedDate,
            task.description,
            task.id,
            task.status,
            task.title
        )
    })
}

function tasksOperationsProcessor(tasksOperations, ulListPerTask){
    tasksOperations.forEach(function (operation){
        renderOperation(ulListPerTask,
            operation.task.status,
            operation.id,
            operation.description,
            operation.timeSpent)
    })
}

function apiListOperationsForTask(serverAddress, apiKey, taskId){
    return fetch(serverAddress + `/${taskId}/operations`, {
        method: 'get',
        headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            // console.log('operations for task id: ', taskId)
            // console.log(response);
            return response.json();
        })
    // console.log("apiListOperationsForTask")
}

function transformTime(timeInMinutes){
    let hours;
    let minutes;

    hours = Math.floor(timeInMinutes / 60)
    if (hours > 0){
        minutes = timeInMinutes % 60;
        return [hours, minutes]
    }
    return [timeInMinutes];

}

function updateBadgeInMinutesForOperation(timeSpent, time){
    // descriptionDiv.innerText = operationDescription;
    let timeTransformed;
    timeTransformed = transformTime(timeSpent);
    if (timeTransformed.length > 1){
        time.innerText = timeTransformed[0] + "h " + timeTransformed[1] + "m";
    } else {
        time.innerText = timeTransformed[0] + "m";
    }

    // return [descriptionDiv, time]
}

function renderOperation(ulList, taskStatus, operationId, operationDescription, timeSpent){
    let timeTransformed;
    const li = document.createElement("li");
    const descriptionDiv = document.createElement("div");
    const timeDiv = document.createElement("div");
    const plus15minButton = document.createElement("button");
    const plus1hButton = document.createElement("button");
    const deleteOperationButton = document.createElement("button");
    const time = document.createElement("span");





    plus15minButton.className = "btn btn-outline-success btn-sm mr-2";
    plus1hButton.className = "btn btn-outline-success btn-sm mr-2";
    deleteOperationButton.className = "btn btn-outline-danger btn-sm";

    li.className = "list-group-item d-flex justify-content-between align-items-center";
    time.className = "badge badge-success badge-pill ml-2";

    plus15minButton.innerText = "+15m";
    plus1hButton.innerText = "+1h";
    deleteOperationButton.innerText = "Delete"



    descriptionDiv.innerText = operationDescription;
    timeTransformed = transformTime(timeSpent);
    if (timeTransformed.length > 1){
        time.innerText = timeTransformed[0] + "h " + timeTransformed[1] + "m";
    } else {
        time.innerText = timeTransformed[0] + "m";
    }



    descriptionDiv.appendChild(time);
    li.appendChild(descriptionDiv);
    if (taskStatus === "open"){
        timeDiv.appendChild(plus15minButton);
        timeDiv.appendChild(plus1hButton);
        timeDiv.appendChild(deleteOperationButton);
        li.appendChild(timeDiv)
    }
    ulList.appendChild(li)

    plus15minButton.addEventListener("click", function(event){
        timeSpent += 15;
        updateBadgeInMinutesForOperation(timeSpent, time)
        console.log(timeSpent)
        // update timeSpent for given operation on backend

    })

    plus1hButton.addEventListener("click", function(event){
        timeSpent += 60;
        updateBadgeInMinutesForOperation(timeSpent, time)
        console.log(timeSpent)
        // update timeSpent for given operation on backend

    })

    // console.log(`lista operacji: ${ulList}`);
    // console.log(`Status zadania: ${taskStatus}`);
    // console.log(`id operacji: ${operationId}`);
    // console.log(`opis operacji: ${operationDescription}`);
    // console.log(`czas spedzony: ${timeSpent}`);

}


function apiCreateTask(serverAddress, apiKey, title, description){
    return fetch(serverAddress, {
        method: 'post',
        headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, description: description, status: 'open'})
    })
        .then(response => {
            if (!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            console.log(response)
            return response.json()
        })
}

function clearErrorMessage(someInput){
    // If the title value meets the requirements, remove any existing error message
    const existingErrorMessage = someInput.nextElementSibling;
    if (existingErrorMessage && existingErrorMessage.classList.contains('error-message')) {
        existingErrorMessage.remove();
    }
}

function isTitleOk(titleInput){
    titleInput.addEventListener("input", function(event) {
        clearErrorMessage(titleInput);
    });

    if (titleInput.value === ""){

        // Create a new span element for the error message
        const errorTitle = document.createElement('span');
        errorTitle.textContent = 'Title cannot be empty!';
        errorTitle.classList.add('error-message'); // Add a CSS class for styling if needed

        // Insert the error message after the input element
        titleInput.insertAdjacentElement('afterend', errorTitle);
        return false;
    }
    return true;
}

function viewTasks(){
    apiListTasks(apihost + '/api/tasks', apikey)
        .then(tasksListResponse => {
            console.log(tasksListResponse)
            if (!tasksListResponse.error){

                tasksListProcessor(tasksListResponse.data)
            }
        })
}

function newTaskSubmit(submittedForm){
    submittedForm.addEventListener("submit", function (event){
        let isValid = true;
        // isValid = true
        event.preventDefault();
        const titleInput = this.querySelector('input[name="title"]');
        const descriptionInput = this.querySelector('input[name="description"]')
        clearErrorMessage(titleInput);

        // isTitleOk(titleInput)

        if (isTitleOk(titleInput)) {
            console.log("CAN CREATE TASK")
            apiCreateTask(apitasks, apikey, titleInput.value, descriptionInput.value)
                .then(taskCreated => {
                    if (!taskCreated.error){

                        console.log('Odpowiedź z serwera to:', taskCreated.data)
                    }
                    return taskCreated.data;
                })
                .then(data => {
                    renderTask(data.addedDate,
                        data.description,
                        data.id,
                        data.status,
                        data.title)

                    this.reset();

                })
        } else {
            console.log("DO NOT CREATE TASK!!")
            alert("Task nie utworzony!")
            this.reset();
            // isValid = false;
        }




        console.log(titleInput.value)
        // location.href = location.href;
        // viewTasks();
    })
}

function apiDeleteTask(serverAddress, apiKey, taskIDToDelete){
    console.log(`id to delete: ${taskIDToDelete}`)
    return fetch(serverAddress + `/${taskIDToDelete}`, {
        method: 'delete',
        headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            console.log(response)
            return response.json()
        })
}

function apiCreateOperationForTask(){
    // submit na form od dodawania operacji do taska
    renderOperation()
}

// dodawanie czasu operacji (put na adres)
function apiUpdateOperation(){
    // eventListener "click" na przyciski dodawania czasu
    // update timeSpent
}


//usuwanie operacji z zadania
function apiDeleteOperation(operationId) {

}

// zamykanie zadania

function apiUpdateTask(taskId, taskTitle, taskDescription, taskStatus) {
    console.log(`Status: ${taskStatus} do zmiany. Task id: ${taskId}, taskTitle: ${taskTitle}, taskDescription: ${taskDescription}`)
    // put na adres
// zmieniamy status zadania z open na closed, tytul, descirption,  zostaja jak byly
    //
    // event listener click on finish button
    // po odpowiedzi z serwera, usunac odpowiednie elementy z zadania: przyciski "Finish", "+1h", "+15m" oraz "Delete" przy operacjach
}


document.addEventListener('DOMContentLoaded', function() {
    const newTaskForm = document.querySelector('.js-task-adding-form');
    newTaskSubmit(newTaskForm);
    viewTasks();
    // apiListTasks(apihost + '/api/tasks', apikey)
    //     .then(tasksListResponse => {
    //         console.log(tasksListResponse)
    //         if (!tasksListResponse.error){
    //
    //             tasksListProcessor(tasksListResponse.data)
    //         }
    //     })
    // apiCreateTask(apihost + '/ADDRESSCREATETASL', apikey)
    //     .then(taskCreatedResponse => {
    //         renderTask(taskCreatedResponse.addedDate,
    //             taskCreatedResponse.description,
    //             taskCreatedResponse.id,
    //             taskCreatedResponse.status,
    //             taskCreatedResponse.title)
    //     })



});
