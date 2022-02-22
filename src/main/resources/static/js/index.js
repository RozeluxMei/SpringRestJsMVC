$(function () {
    fetch('api/auth')
        .then(response => response.json())
        .then(user => {
            let isAdmin = false;
            user.roles.forEach(role => {
                if (role.role === 'ROLE_ADMIN') {
                    isAdmin = true;
                }
            });
            if (isAdmin === true) {
                $(async function () {
                    await fillNavbar();
                    await fillTableWithUsers();
                    await fillUserInformationPage();
                    await getDefaultModal();
                    await createUser();

                })
            } else {
                $(async function () {
                    await fillNavbar();
                    await fillUserInformationPage();

                    let userTab = document.querySelector('#v-pills-user-tab')
                    let bsUserTab = new bootstrap.Tab(userTab)
                    bsUserTab.show()

                    document.getElementById("v-pills-admin-tab")
                    .hidden = true
                })

            }
        })
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    findAuthentication: async () => await fetch('api/auth'),
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user) => await fetch(`api/users`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head}),
    findAllRoles: async () => await fetch('api/roles')
}

async function fillNavbar () {
    let navMail = document.getElementById("authMail")
    let navRoles = document.getElementById("authRoles")

    userFetchService.findAuthentication()
        .then(res => res.json())
        .then(authUser => {

            navMail.textContent = authUser.mail
            navRoles.textContent = stringifyRoles(authUser.roles)
        })
}

async function fillTableWithUsers() {
    let table = $('#usersTable tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {

                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>   
                            <td>${user.mail}</td>
                            <td>${stringifyRoles(user.roles)}</td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info text-white" 
                                data-bs-toggle="modal" data-bs-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger text-white" 
                                data-bs-toggle="modal" data-bs-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`
                table.append(tableFilling)
            })
        })
}

async function fillUserInformationPage () {
    let table = $('#userInformationTable tbody')
    table.empty()

    await userFetchService.findAuthentication()
        .then(res => res.json())
        .then(user => {
            let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>   
                            <td>${user.mail}</td>
                            <td>${stringifyRoles(user.roles)}</td>
                        </tr>
            )`
            table.append(tableFilling)
        })
}

function stringifyRoles (roles) {
    //строковое представление всех ролей пользователя
    let rolesStr = ""

    roles.forEach(role => {
        rolesStr += role.role
        //дописываем запятые чтобы сделать красивое
        if (roles.findIndex((currentRole) => {return role.role === currentRole.role})
            !== roles.length-1){
            rolesStr += ", "
        }
    })
    return rolesStr
}

// обрабатываем нажатие на любую из кнопок edit или delete
// достаем из нее данные и отдаем модалке, открываем модалку
async function getDefaultModal() {
    let defaultModal = document.getElementById("someDefaultModal")
    defaultModal.setAttribute("keyboard", "true")
    defaultModal.setAttribute("backdrop", "true")
    defaultModal.setAttribute("show", "false")

    defaultModal.addEventListener('show.bs.modal', function (event) {
        let triggeredButton = event.relatedTarget
        let userid = triggeredButton.getAttribute('data-userid').toString()
        let action = triggeredButton.getAttribute('data-action')

        defaultModal.setAttribute("data-userid", userid)
        defaultModal.setAttribute("data-action", action)

        switch (action) {
            case 'edit':
                editUser(defaultModal, userid);
                break;
            case 'delete':
                deleteUser(defaultModal, userid);
                break;
        }
    })
    //Очистить модалку если скрываем
    defaultModal.addEventListener('hide.bs.modal', event => {
        defaultModal.querySelector('.modal-title').textContent = ""
        defaultModal.querySelector('.modal-body').innerHTML = ""
        defaultModal.querySelector('.modal-footer').innerHTML = ""
    })

}

//список всех ролей на БД
async function getAllRoles () {
    return await userFetchService.findAllRoles()
        .then(res => {
            return res.json()
        }).then(roles => {
            return roles
        })
}

//добываем данные из селектора ролей
function getSelectValues(select) {
    let result = [];
    let options = select && select.options;
    let opt;

    for (let i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

// редактируем юзера из модалки редактирования, забираем данные, отправляем (теперь и в BS5)
async function editUser(modal, id) {
    let response = await userFetchService.findOneUser(id)
    let user = response.json()

    let roles = await getAllRoles()

        modal.querySelector('.modal-title').textContent = "Edit User"

    let editButton = document.createElement("button")
    editButton.type = "button"
    editButton.className = "btn btn-primary"
    editButton.id = "editButton"
    editButton.innerHTML = "Edit"


    let closeButton = document.createElement("button")
    closeButton.type = "button"
    closeButton.className = "btn btn-secondary"
    closeButton.setAttribute("data-bs-dismiss", "modal")
    closeButton.innerHTML = "Close"

    let modalFooter = modal.querySelector('.modal-footer')
    modalFooter.append(closeButton, editButton)

    let modalBody = modal.querySelector('.modal-body')

    //создать селектор всех ролей
    let selector = `<label for="listRoles" class="fw-bold"><b>Role</b></label>
    <select class="form-control" name="listRoles" id="listRoles" multiple size="${roles.length}">`
    roles.forEach(role => {
        selector += `<option value="${role.role}">${role.role}</option>`
    })
    selector += `</select>`

    user.then(user => {

        let bodyTemplate = `
            <form class="form-group" id="editUser">
                <div class="form-group text-center">
                <label for="id" class="center-block"><b>ID</b></label>
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br></div>
                
                <div class="form-group text-center">
                <label for="firstName" class="center-block"><b>First Name</b></label>
                <input class="form-control" type="text" id="firstName" name="firstName" value="${user.firstName}"><br></div>
                
                <div class="form-group text-center">
                <label for="lastName" class="center-block"><b>Last Name</b></label>
                <input class="form-control" type="text" id="lastName" name="lastName" value="${user.lastName}"><br></div>
                
                <div class="form-group text-center">
                <label for="age" class="center-block"><b>Age</b></label>
                <input class="form-control" type="number" id="age" name="age" value="${user.age}"><br></div>
                
                <div class="form-group text-center">
                <label for="mail" class="center-block"><b>Mail</b></label>
                <input class="form-control" type="text" id="mail" name="mail" value="${user.mail}"><br></div>
                
                <div class="form-group text-center">
                <label for="password" class="center-block"><b>Password</b></label>
                <input class="form-control" type="password" id="password" name="password" required><br></div>
                
                <!--Roles-->
                <div class="form-group text-center">${selector}</div>
            </form>
        `

        let bodyForm = new DOMParser().parseFromString(bodyTemplate,"text/html")
        modalBody.append(bodyForm.getElementById("editUser"))

    })

    $("#editButton").on('click', async () => {

        let authorities = await getAllRoles()

        let id = document.querySelector("#id").value.trim()
        let firstName = document.querySelector("#firstName").value.trim()
        let lastName = document.querySelector("#lastName").value.trim()
        let age = document.querySelector("#age").value.trim()
        let mail = document.querySelector("#mail").value.trim()
        mail = mail === "" ? null: mail
        let password = document.querySelector("#password").value
        password = password === "" ? null: password

        let roles = []

        getSelectValues(document.querySelector("#listRoles")).forEach(str => {
            roles.push(authorities.find(role => {
                   return role.role === str
                }))
            })

        let user = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            mail: mail,
            age: age,
            password: password,
            roles: roles
        }

        const response = await userFetchService.updateUser(user);

        if (response.ok) {
            await fillNavbar()
            await fillUserInformationPage()
            await fillTableWithUsers()
            let bsmodal = bootstrap.Modal.getInstance(modal)
            bsmodal.hide()
        } else {
            let message = "Something went wrong, please check fields filled correctly or contact a developer"
            let alert = new DOMParser().parseFromString(`<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="errorMessage">
                            ${message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`,"text/html").getElementById("errorMessage")

            modal.querySelector('.modal-body').prepend(alert)
        }
    })
}

// удаляем юзера из модалки удаления (теперь и в BS5 но не работает с "врожденными" пользователями)
async function deleteUser(modal, id) {
    let response = await userFetchService.findOneUser(id)
    let user = response.json()

    let roles = await getAllRoles()

    modal.querySelector('.modal-title').textContent = "Delete User"

    let deleteButton = document.createElement("button")
    deleteButton.type = "button"
    deleteButton.className = "btn btn-danger"
    deleteButton.id = "deleteButton"
    deleteButton.innerHTML = "Delete"

    let closeButton = document.createElement("button")
    closeButton.type = "button"
    closeButton.className = "btn btn-secondary"
    closeButton.setAttribute("data-bs-dismiss", "modal")
    closeButton.innerHTML = "Close"

    let modalFooter = modal.querySelector('.modal-footer')
    modalFooter.append(closeButton, deleteButton)

    let modalBody = modal.querySelector('.modal-body')

    //создать селектор всех ролей
    let selector = `<label for="listRoles" class="fw-bold"><b>Role</b></label><select class="form-control" name="listRoles" id="listRoles" multiple size="${roles.length}" disabled>`
    roles.forEach(role => {
        selector += `<option value="${role.role}">${role.role}</option>`
    })
    selector += `</select>`

    user.then(user => {

        let bodyTemplate = `
            <form class="form-group" id="deleteUser">
                <div class="form-group text-center">
                <label for="id" class="center-block"><b>ID</b></label>
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" readonly><br></div>
                
                <div class="form-group text-center">
                <label for="firstName" class="center-block"><b>First Name</b></label>
                <input class="form-control" type="text" id="firstName" name="firstName" value="${user.firstName}" readonly><br></div>
                
                <div class="form-group text-center">
                <label for="lastName" class="center-block"><b>Last Name</b></label>
                <input class="form-control" type="text" id="lastName" name="lastName" value="${user.lastName}" readonly><br></div>
                
                <div class="form-group text-center">
                <label for="age" class="center-block"><b>Age</b></label>
                <input class="form-control" type="number" id="age" name="age" value="${user.age}" readonly><br></div>
                
                <div class="form-group text-center">
                <label for="mail" class="center-block"><b>Mail</b></label>
                <input class="form-control" type="text" id="mail" name="mail" value="${user.mail}" readonly><br></div>
               
                <!--Roles-->
                <div class="form-group text-center">${selector}</div>
            </form>
        `

        let bodyForm = new DOMParser().parseFromString(bodyTemplate,"text/html")
        modalBody.append(bodyForm.getElementById("deleteUser"))
    })

    $("#deleteButton").on('click', async () => {

        let id = document.getElementById("id").getAttribute("value").trim()
        console.log(id)

        const response = await userFetchService.deleteUser(id)

        if (response.ok) {
            await fillTableWithUsers()
            let bsmodal = bootstrap.Modal.getInstance(modal)
            bsmodal.hide()
        } else {
            let body = await response.json()
            let alert = new DOMParser().parseFromString(`<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="errorMessage">
                            ${body.info}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`,"text/html").getElementById("errorMessage")

            modal.querySelector('.modal-body').prepend(alert)
        }
    })
}

// дозаполняем окно создания юзера существующими ролями и добавляем юзера
async function createUser () {
    let roles = await getAllRoles()

    //создать селектор всех ролей
    let selector = `<label for="newlistRoles" class="fw-bold"><b>Role</b></label><select class="form-control" name="listRoles" id="newListRoles" multiple size="${roles.length}">`
    roles.forEach(role => {
        selector += `<option value="${role.role}">${role.role}</option>`
    })
    selector += `</select>`

    document.getElementById("newRoles").innerHTML = selector

    $("#addButton").on('click', async () => {

        let authorities = await getAllRoles()

        let firstName = document.querySelector("#newFirstName").value.trim();
        let lastName = document.querySelector("#newLastName").value.trim();
        let age = document.querySelector("#newAge").value.trim();
        let mail = document.querySelector("#newMail").value.trim();
        mail = mail === "" ? null: mail
        let password = document.querySelector("#newPassword").value;
        password = password === "" ? null: password

        let roles = []

        getSelectValues(document.querySelector("#newListRoles")).forEach(str => {
            roles.push(authorities.find(role => {
                return role.role === str
            }))
        })

        let user = {
            firstName: firstName,
            lastName: lastName,
            mail: mail,
            age: age,
            password: password,
            roles: roles
        }

        console.log(user)

            const response = await userFetchService.updateUser(user);


            if (response.ok) {
                await fillTableWithUsers()
                let adminTab = document.querySelector('#nav-allUsers-tab')
                let bsUserTab = new bootstrap.Tab(adminTab)
                bsUserTab.show()
            } else {
                let message = "Something went wrong, please check fields filled correctly or contact a developer"
                let alert = new DOMParser().parseFromString(`<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="errorMessageNew">
                            ${message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`,"text/html").getElementById("errorMessageNew")

                document.querySelector('#card').prepend(alert)
            }
    })

}