const dataCenter = "http://localhost:2020";
// const dataCenter = "https://api.buhikayesenin.com";
const refreshContents = document.querySelector('.information > h2 > i');

const getDeviceList = async () => {
    return fetch(`${dataCenter}/allDevices`, {
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

const getDeviceDetails = async (deviceID) => {
    return fetch(`${dataCenter}/getDeviceInformation`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceID: deviceID })
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

const getCategoryData = async () => {
    return fetch(`${dataCenter}/getCategories`, {
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

// const getContentData = async (categoryID) => {
//     return fetch(`${dataCenter}/getContents`, {
//         credentials: 'include',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ categoryID: categoryID })
//     })
//         .then(response => response.json())
//         .catch(error => {
//         console.error(error);
//         window.location.href = "https://panel.buhikayesenin.com/";
//         });
// }

const insertNewCategory = async (categoryName) => {
    return fetch(`${dataCenter}/insertNewCategory`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryName: categoryName })
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

// const deleteContent = async (contentID) => {
//     return fetch(`${dataCenter}/deleteContent`, {
//         credentials: 'include',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ contentID: contentID })
//     })
//         .then(response => response.json())
//         .catch(error => {
//         console.error(error);
//         window.location.href = "https://panel.buhikayesenin.com/";
//         });
// }

const updateDeviceInformation = async (deviceID, deviceName, deviceFolders) => {
    return fetch(`${dataCenter}/updateDeviceInformation`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceID: deviceID, deviceName: deviceName, deviceFolders: deviceFolders })
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

const refreshData = async () => {
    refreshContents.setAttribute('id', 'rotate');
    var allCategories = document.querySelectorAll('.categories > .category');

    allCategories.forEach(element => {
        element.remove();
    });

    var categories;
    await getCategoryData()
        .then(data => {
            if(data['task'] == true){
                categories = data['results'];
            }
            else{
                categories == null;
            }
        })
        .catch(error => {
            console.error(error);
        });

    if(categories == null){
        var noData = document.createElement('h2');
        noData.innerText = "Kategori Bulunamadı";
        document.querySelector('.categories').appendChild(noData);
        return
    }

    categories.forEach(element => {
        var newCategory = document.createElement('div');
        newCategory.setAttribute('class', 'category');
        newCategory.setAttribute('id', element['id']);
        newCategory.innerText = element['categoryName'];
        document.querySelector('.categories').appendChild(newCategory);
    });

    refreshContents.removeAttribute('id');
}

const getDevices = async () => {

    const devices = document.querySelectorAll('.list .device');
    devices.forEach(element => {
        element.remove();
    });

    var deviceList;

    await getDeviceList()
    .then(data => {
        if(data['task'] == true){
            deviceList = data['results'];
        }
        else{
            alert(data['err']['msg']);
        }
    })
    .catch(error => {
        console.error(error);
    });
    let tat = document.querySelector('.holder > .list');
    for(var k = 0; k<deviceList.length; k++){
        let el = deviceList[k];
        let sub = document.createElement('div');
        sub.setAttribute('id', el['deviceID']);
        sub.setAttribute('class', 'device')
        let t = document.createElement('p');
        t.innerText = "BHS_V0.1 ";
        let j = document.createElement('nick');
        j.innerText = el['deviceName'];
        t.appendChild(j);
        sub.appendChild(t);
        tat.appendChild(sub);
    }

    loadDevices();
}

const loadDevices = () => {
    const devices = document.querySelectorAll('.list .device');
    devices.forEach(device => {
        device.onclick = async () => {

            devices.forEach(device => {
                device.removeAttribute('selected');
            });

            device.setAttribute('selected', true);

            document.querySelector('.filter').style.display = 'none';
            document.querySelector('.options').style.display = 'flex';
            document.querySelector('.options #deviceID').value = device.getAttribute('id');

            var categoryList;
            var deviceInformation;

            await getCategoryData()
            .then(data => {
                if(data['task'] == true){
                    categoryList = data['results'];
                }
                else{
                    alert(data['err']['msg']);
                }
            })

            await getDeviceDetails(device.getAttribute('id'))
            .then(data => {
                if(data['task'] == true){
                    deviceInformation = data['results'];
                }
                else{
                    alert(data['err']['msg']);
                }
            })

            const selectedNow = deviceInformation['deviceFolders'].replace('[', '').replace(']', '').replace(' ', '').split(',');
            const buttonCount = parseInt(deviceInformation['buttonCount']);

            document.querySelector('.options #deviceNickname').value = deviceInformation['deviceName'];

            document.querySelectorAll('.options .buttons select').forEach(element => {
                element.remove();
            });

            for(var i = 0; i<buttonCount; i++){

                var selecter = document.createElement('select');

                categoryList.forEach(cat => {
                    var item =  document.createElement('option');
                    if(selectedNow[i] == cat['id']){
                        item.setAttribute('selected', true);
                    }
                    item.value = cat['id'];
                    item.innerText = cat['categoryName'];
                    selecter.appendChild(item);
                });
                
                document.querySelector('.options .buttons').appendChild(selecter);
            }

            document.getElementById('saveDeviceDetails').onclick = async () => {
                let deviceID = document.querySelector('.options #deviceID').value;
                let deviceName = document.querySelector('.options #deviceNickname').value;
                var folders = [];

                document.querySelectorAll('.options .buttons select').forEach(element => {
                    folders.push(element.value);
                });

                await updateDeviceInformation(deviceID, deviceName, folders.toString())
                .then(data => {
                    if(data['task'] == true){
                        alert('Ayarlar Kaydedildi!');
                        const devices = document.querySelectorAll('.list .device');
                        devices.forEach(device => {
                            device.removeAttribute('selected');
                        });
                        document.querySelector('.filter').style.display = 'block';
                        document.querySelector('.options').style.display = 'none';
                        getDevices();
                    }
                    else{
                        alert(data['err']['msg']);
                    }
                })
            }
    
        };
    });
}

getDevices();
refreshData();

var newCategoryButton = document.querySelector('.holder > .categories > button');
var closeCategoryButton = document.querySelector('#newCategory > div > #closeCategory');
var addCategoryButton = document.querySelector('#newCategory > div > #addCategory');

newCategoryButton.onclick = () => {
    document.getElementById('newCategory').style.display = 'flex';
}

addCategoryButton.onclick = async () => {
    var categoryName = document.querySelector('#newCategory > div > input');
    if(categoryName.value && categoryName.value.length > 0){
        await insertNewCategory(categoryName.value)
        .then(data => {
            if(data['task'] == true){
                document.getElementById('newCategory').style.display = 'none';
                document.getElementById('inputCatName').value = "";
                refreshData();
            }
            else{
                var errorView = document.createElement('p');
                errorView.style.color = 'red';
                errorView.innerText = data['err']['msg'];
                document.querySelector('#newCategory > div').appendChild(errorView);
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
}

closeCategoryButton.onclick = () => {
    document.getElementById('newCategory').style.display = 'none';
    document.getElementById('inputCatName').value = "";
}

function closeContent(){
    document.getElementById('newContent').style.display = 'none';
}

refreshContents.onclick = (e) => {
    refreshData();
}