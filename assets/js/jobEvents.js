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

const getContentData = async (categoryID) => {
    return fetch(`${dataCenter}/getContents`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryID: categoryID })
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

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

const deleteContent = async (contentID) => {
    return fetch(`${dataCenter}/deleteContent`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contentID: contentID })
    })
        .then(response => response.json())
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com/";
        });
}

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

var setDeleteContentsActions = () => {
    var allDeleteIcons = document.querySelectorAll('i[class="fa-solid fa-trash"]');
    allDeleteIcons.forEach(element => {
        element.onclick = async () => {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                await deleteContent(element.parentElement.getAttribute('id'))
                .then(data => {
                    if(data['task'] == true){
                        element.parentElement.remove();
                    }
                    else{
                        alert(data['err']['msg']);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            }
        }
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
        var textArea = document.createElement('p');
        var textAreaIcon = document.createElement('i');
        textAreaIcon.setAttribute('class', "fa-solid fa-caret-right");
        textAreaIcon.style.color = "#0061ff";
        textArea.innerText = " " + element['categoryName'];
        textArea.prepend(textAreaIcon);
        newCategory.appendChild(textArea);
        document.querySelector('.categories').appendChild(newCategory);
    });

    allCategories = document.querySelectorAll('.categories > .category');
    for(var i = 0; i < allCategories.length; i++){
        var element = allCategories[i];
        var categoryID = element.getAttribute('id');
        var contents = [];
        var hiddenFiles = document.createElement('div');
        hiddenFiles.setAttribute('class', 'files');
        hiddenFiles.setAttribute('hidden', true);
        
        await getContentData(categoryID)
        .then(data => {
            if(data['task'] == true){
                contents = data['results'];
            }
            else{
                contents == null;
            }
        })
        .catch(error => {
            console.error(error);
        });

        var addButton = document.createElement('button');
        addButton.setAttribute('type', 'button');
        addButton.style.marginBottom = "5px";
        addButton.innerText = '+ Yeni İçerik';

        (function (currentCategoryID) {
            contents.forEach(element => {
                var newFile = document.createElement('div');
                newFile.setAttribute('class', 'file');
                newFile.setAttribute('id', element['id']);
                newFile.setAttribute('title', element['contentHeader']);
                var p = document.createElement('p');
                p.innerText = " " + element['contentHeader'];
                var icon = document.createElement('i');
                icon.setAttribute('class', 'fa-regular fa-file');
                icon.style.color = "#0061ff";
                p.prepend(icon);
                newFile.appendChild(p);
                var icon2 = document.createElement('i');
                icon2.setAttribute('class', 'fa-solid fa-trash');
                icon2.style.color = "#919191";
                newFile.appendChild(addButton);
                newFile.appendChild(icon2);
                hiddenFiles.appendChild(newFile);
            });
    
            // Use the currentCategoryID variable in the onclick function
            addButton.onclick = () => {
                window.location.href = "https://panel.buhikayesenin.com/v1.0/editor?scat=" + currentCategoryID;
            };
        })(categoryID);

        hiddenFiles.prepend(addButton);
        allCategories[i].appendChild(hiddenFiles);

    }


    setActionsCategories();
    setDeleteContentsActions();
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

var setActionsCategories = () => {
    const categories = document.querySelectorAll('.categories .category');

    categories.forEach(category => {
        category.querySelector('p').onclick = () => {
            if(category.getAttribute('open') == 'true'){
                category.setAttribute('open', 'false');
                category.querySelector('p i').setAttribute('class', 'fa-solid fa-caret-right');
            }
            else{
                category.setAttribute('open', 'true');
                category.querySelector('p i').setAttribute('class', 'fa-solid fa-caret-down');
            }
        };
    });
}

getDevices();
setActionsCategories();
refreshData();
setDeleteContentsActions();

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