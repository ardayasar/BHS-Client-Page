// const dataCenter = "http://localhost:2020";
const dataCenter = "https://api.buhikayesenin.com";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const categoryID = urlParams.get('scat');

var cdb = document.getElementById('rcm');
var elList = ['filename', 'name', 'date', 'icon', 'file', 'fa-solid fa-file-lines'];
var si;
var sl;

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
        window.location.href = "https://panel.buhikayesenin.com";
        });
}

const getFilePreview = async (fileID) => {
    return fetch(`${dataCenter}/getPDF`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileID: fileID })
    })
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(error => {
        console.error(error);
        window.location.href = "https://panel.buhikayesenin.com";
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

const getID = (target) => {
    const className = target.className;

    switch (className) {
        case 'file':
            return target.getAttribute('id');
        case 'icon':
            return target.parentElement.getAttribute('id');
        case 'filename':
            return target.parentElement.getAttribute('id');
        case 'fa-solid fa-file-lines':
            return target.parentElement.parentElement.getAttribute('id');
        case 'name':
            return target.parentElement.parentElement.getAttribute('id');
        case 'date':
            return target.parentElement.parentElement.getAttribute('id');
        default:
            return false;
    }
}

var click = 0;

document.onclick = async function(e) {
    click++;
    setTimeout(async () => {
        click = 0;
    }, 300);

    if(click == 2){
        var element = e.target;
        var selectedID = getID(element);
        if(selectedID != false){
            alert('doubleclick');
        }
        return;
    }
    else{
        actions.style.display = 'none';
        cdb.style.display = 'none';
        try {
            document.getElementById(si).removeAttribute('sel');
        } catch (error) {
            
        }

        try {
            document.getElementById(sl).removeAttribute('sel');
        } catch (error) {
            
        }
        si = null;
        sl = null;
        
        document.querySelectorAll('.filePreview').forEach((b) => {
            b.remove();
        });

        var element = e.target;
        var selectedID = getID(element);
        if(selectedID != false){
            document.getElementById(selectedID).setAttribute('sel', 'true');
            sl = selectedID;
            e.preventDefault();
            var el = document.createElement('div');
            el.setAttribute('class', 'filePreview');
            var spinner = document.createElement('i');
            spinner.setAttribute('class', 'fa-regular fa-spinner');
            spinner.setAttribute('id', 'spinner');
            el.appendChild(spinner);
            var tt = document.createElement('p');
            tt.innerText = "Önizleme yükleniyor...";
            tt.style.color = 'white';
            tt.style.fontSize = '16px';
            el.appendChild(tt);
            document.querySelector('.padmar').appendChild(el);
            let doc = await getFilePreview(selectedID);
            console.log(doc);
            var ifr = document.createElement('iframe');
            ifr.src = doc;
            ifr.style.height = '80%';
            ifr.style.width = '90%';
            ifr.style.margin = 'auto';
            document.querySelector('.filePreview > #spinner').remove();
            document.querySelector('.filePreview > p').remove();
            document.querySelector('.filePreview').appendChild(ifr);
        }
    }
}

document.oncontextmenu = function(e) {
    var element = e.target;
    var selectedID = getID(element);

    let files = document.querySelectorAll('.file');
    files.forEach(element => {
        element.removeAttribute('sel');
    });

    if(selectedID != false){
        document.getElementById(selectedID).setAttribute('sel', 'true');
        si = selectedID;
        e.preventDefault();
        // console.log(si);
        cdb.style.display = 'flex';
        cdb.style.left = e.pageX + 'px';
        cdb.style.top = e.pageY + 'px';
    }
}

document.getElementById('rcm').onclick = async () => {
    var g = si;
    await deleteContent(si)
        .then(data => {
            if(data['task'] == true){
                document.getElementById(g).remove();
            }
            else{
                console.log(data);
                alert("İşlem yapılamamaktadır. Daha sonra tekrar deneyiniz.");
            }
        })
        .catch(error => {
            console.error(error);
            window.location.href = "https://panel.buhikayesenin.com";
            alert("İşlem yapılamamaktadır. Daha sonra tekrar deneyiniz.");
        });
}

const loadData = async () => {
    await getContentData(categoryID)
        .then(data => {
            if(data['task'] == false){
                document.getElementById('nocontent').style.display = 'flex';
            }
            if(data['task'] == true){
                data['results'].forEach(element => {
                    var d = document.createElement('div');
                    d.setAttribute('class', 'file');
                    d.setAttribute('id', element['id']);
                    var icd = document.createElement('div');
                    icd.setAttribute('class', 'icon');
                    var icd_i = document.createElement('i');
                    icd_i.setAttribute('class', 'fa-solid fa-file-lines');
                    icd_i.style.color = "#d29d00";
                    icd.appendChild(icd_i);
                    d.appendChild(icd);
                    var f = document.createElement('div');
                    f.setAttribute('class', 'filename');
                    var p_1 = document.createElement('p');
                    var p_2 = document.createElement('p');
                    p_1.setAttribute('class', 'name');
                    p_2.setAttribute('class', 'date');
                    p_1.innerText = element['contentHeader'];
                    p_2.innerText = element['creationTime'].slice(0, 10);
                    f.appendChild(p_1);
                    f.appendChild(p_2);
                    d.appendChild(f);
                    document.querySelector('.files').appendChild(d);
                });

            }
            else{
                console.log(data);
            }
        })
        .catch(error => {
            console.error(error);
        });

        setURLs();
}

const setURLs = () => {
    document.querySelectorAll('togo').forEach((element) => {
        element.href = 'https://panel.buhikayesenin.com/v1.0/editor?scat=' + categoryID;
    });
}

loadData();