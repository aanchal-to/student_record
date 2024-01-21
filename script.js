class ApiSingleton {
    constructor() {
        if (ApiSingleton.instance) {
            return ApiSingleton.instance;
        }
        ApiSingleton.instance = this;
        return this;
    }

    async fetchData(url) {
        const response = await fetch(url);
        return await response.json();
    }

    async postData(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async putData(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async deleteData(url) {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        return await response.json();
    }
}

class UISingleton {
    constructor() {
        if (UISingleton.instance) {
            return UISingleton.instance;
        }
        UISingleton.instance = this;
        return this;
    }

}

const apiUrl = 'https://65acaf5badbd5aa31bdf7159.mockapi.io/aanchal/bct';
const api = new ApiSingleton();
const ui = new UISingleton();

async function init() {
   
    const records = await api.fetchData(apiUrl);
    updateRecordList(records);

    document.getElementById('addButton').addEventListener('click', openAddModal);
}

function updateRecordList(records) {
    const recordTableBody = document.querySelector('#recordTable tbody');
    recordTableBody.innerHTML = '';

    records.forEach(record => {
        const row = recordTableBody.insertRow();
        const cellName = row.insertCell(0);
        cellName.textContent = record.name; 

        const cellEdit = row.insertCell(1);
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => openEditModal(record));
        editButton.style.backgroundColor = '#3498db'; 
        editButton.style.color = '#fff';
        editButton.style.padding = '5px 10px'; 
        editButton.style.border = 'none';
        editButton.style.cursor = 'pointer';
        editButton.style.borderRadius = '4px';
        editButton.style.transition = 'background-color 0.3s'; 
        editButton.addEventListener('mouseenter', () => {
            editButton.style.backgroundColor = '#fff'; 
            editButton.style.color = '#3498db'; 
        });
        editButton.addEventListener('mouseleave', () => {
            editButton.style.backgroundColor = '#3498db'; 
            editButton.style.color = '#fff'; 
        });

        cellEdit.appendChild(editButton);

        const cellDelete = row.insertCell(2);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => confirmDelete(record.id));
        deleteButton.style.backgroundColor = '#c61010'; 
        deleteButton.style.color = '#fff';
        deleteButton.style.padding = '5px 10px'; 
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.borderRadius = '4px';

        deleteButton.addEventListener('mouseenter', () => {
            deleteButton.style.backgroundColor = '#fff'; 
            deleteButton.style.color = '#c61010'; 
        });

        deleteButton.addEventListener('mouseleave', () => {
            deleteButton.style.backgroundColor = '#c61010'; 
            deleteButton.style.color = '#fff'; 
        });


        cellDelete.appendChild(deleteButton);
    });
}

function openAddModal() {
    const newName = prompt('Enter the name for the new record:');
if (newName) {
const newData = { name: newName }; 
api.postData(apiUrl, newData)
    .then(() => api.fetchData(apiUrl))
    .then(updatedRecords => updateRecordList(updatedRecords))
    .catch(error => console.error('Error adding record:', error));
}
}

function openEditModal(record) {
    const newName = prompt('Enter the updated name:', record.name);
if (newName !== null) { 
const updatedData = { name: newName }; 
api.putData(`${apiUrl}/${record.id}`, updatedData)
    .then(() => api.fetchData(apiUrl))
    .then(updatedRecords => updateRecordList(updatedRecords))
    .catch(error => console.error('Error updating record:', error));
}
}

async function confirmDelete(recordId) {
    const isConfirmed = confirm('Are you sure you want to delete this record?');
    if (isConfirmed) {
        await api.deleteData(`${apiUrl}/${recordId}`);
        const updatedRecords = await api.fetchData(apiUrl);
        updateRecordList(updatedRecords);
    }
}

document.addEventListener('DOMContentLoaded', init);