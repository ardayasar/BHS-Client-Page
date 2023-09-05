const datatable = document.getElementById('3gte764px');

if(!datatable){
    console.error("Datatable error. Element not found.");
}

var dt_items = [];

function requestItemsFromServer(){
    for(let i = 0; i < 100; i++){
        dt_items.push({item_id: i, barcode: "AX12345", name: 'Item ' + i, price: '200', switch_price: '240', photo_url: './assets/image/ico-rm.png'});
    }
}

function getDatatableItems(from = 0, to = 12){

    if(to > dt_items.length){
        to = dt_items.length - 1;
    }

    for(let i = from; i < to; i++){
        const item_data = dt_items[i];
        const item_raw = `
                        <div class="item-img" style="background-image: url('${item_data.photo_url}');">
                            <div class="price-info">
                                <p>₺ ${item_data.price}</p>
                                <pricestatus status="bad">•</pricestatus>
                                <p>₺ ${item_data.switch_price}</p>
                            </div>
                        </div>
                        <div class="item-info">
                            <h3>${item_data.name}</h3>
                            <p id="barcode">${item_data.barcode}</p>
                        </div>
        `;

        let item_html = document.createElement('div');
        item_html.setAttribute('class', 'item');
        item_html.innerHTML = item_raw;
        datatable.appendChild(item_html);
    }
}

requestItemsFromServer();
getDatatableItems();