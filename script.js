const apikey = '1bfb148d-105e-4eb7-a99e-8ae0238e2d4a';
const apihost = 'https://todo-api.coderslab.pl';


function apiListTasks(serverAddress, apiKey){
    return     fetch(serverAddress, {
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
        .then (function(resp){
            // console.log(resp.data)
            return resp.data
        })

        .catch(function (error){
            // console.log(error)
            return error;
        })


}

function renderTask(addedDate, description, id, status, title){
    const deleteButton = document.createElement("button")
    deleteButton.addEventListener("click", function(event){
        apiDeleteTask(id)
    //     usuniesz z drzewa DOM całe <section>

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

function apiListOperationsForTask(){
    console.log("apiListOperationsForTask")
}

function renderOperation(){
    console.log("renderOperation")
}


function apiCreateTask(serverAddress, apiKey){
    return fetch(serverAddress, {
        method: 'post',
        headers: {
            Authorization: apiKey
        }
    })
        .then(response => {
            console.log(response.json())
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

function newTaskSubmit(submittedForm){
    submittedForm.addEventListener("submit", function (event){
        let isValid = true;
        // isValid = true
        event.preventDefault();
        const titleInput = this.querySelector('input[name="title"]');
        const descriptionInput = this.querySelector('input[name="description"]')

        // isTitleOk(titleInput)

        if (isTitleOk(titleInput)) {
            console.log("CAN CREATE TASK")
        } else {
            console.log("DO NOT CREATE TASK!!")
            isValid = false;
        }


        console.log(titleInput.value)
    })
}

function apiDeleteTask(id){
    console.log(`id to delete: ${id}`)
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

//zamykanie zadania

function apiUpdateTask(taskId, taskTitle, taskDescription, taskStatus) {
    // put na adres
// zmieniamy status zadania z open na closed, tytul, descirption,  zostaja jak byly
    //
    // event listener click on finish button
    // po odpowiedzi z serwera, usunac odpowiednie elementy z zadania: przyciski "Finish", "+1h", "+15m" oraz "Delete" przy operacjach
}
document.addEventListener('DOMContentLoaded', function() {
    const newTaskForm = document.querySelector('.js-task-adding-form');
    newTaskSubmit(newTaskForm);
    apiListTasks(apihost + '/api/tasks', apikey)
        .then(tasksList => {
            console.log(tasksList)
            tasksListProcessor(tasksList)
        })
    // apiCreateTask(apihost + '/ADDRESSCREATETASL', apikey)
    //     .then(taskCreatedResponse => {
    //         renderTask(taskCreatedResponse.addedDate,
    //             taskCreatedResponse.description,
    //             taskCreatedResponse.id,
    //             taskCreatedResponse.status,
    //             taskCreatedResponse.title)
    //     })



});
