// Константы 01:02
const formTemplate = `
<form id="add-form" action="">
<input type="text" placeholder="Ваше место" name="place"><br><br>
<input type="text" placeholder="Ваш никнейм" name="name"><br><br>
<textarea name="textReview" placeholder="Ваш отзыв"></textarea><br><br>
<button>Отправить отзыв</button>
</form>
`

let clusterer
ymaps.ready(init);


function init(){
    // Создание карты.
    const myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [ 45.035470, 38.975313],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 12
    });

    clusterer = new ymaps.Clusterer({disableClickZoom: true});
    clusterer.options.set('hasBalloon', false);
    clusterer.events.add('click', (e) => {
        const geoObjectsInClusterer = e.get('target').getGeoObjects()
        openBalloon(myMap, e.get('coords'), geoObjectsInClusterer)
    })


    renderGeoObjects(myMap);

    myMap.events.add('click', (e) => {
        // здесь открывать балун

        openBalloon(myMap, e.get('coords'), []);
    })
}

function getReviewsFormLS() {
    const reviews = localStorage.reviews;

    return JSON.parse(reviews || '[]');
}



function renderGeoObjects (map) {
    const geoObjects = [];

    for(const review of getReviewsFormLS()) {
        const placemark = new ymaps.Placemark(review.coords);

        placemark.events.add('click', (e) => {
            e.stopPropagation()
            openBalloon(map, e.get('coords'), [e.get('target')])
        })

        geoObjects.push(placemark);
    }

    clusterer.removeAll();
    map.geoObjects.remove();


    clusterer.add(geoObjects);
    map.geoObjects.add(clusterer);
}


function getReviewList(currentGeoObjects) {
    let reviewListHTML = '';

    for(const review of getReviewsFormLS()) {
        if(currentGeoObjects.some((geoObject) => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coords))) {
            reviewListHTML += `
            <div class="review">
                <div>Место: ${review.place}</div>
                <div>Автор: ${review.name}</div>
                <div>Отзыв: ${review.textReview}</div>
            </div>
            `

        }
    }

    return reviewListHTML;
}



async function openBalloon(map, coords, currentGeoObjects) {

    await map.balloon.open(coords, {
        content: `<div class="reviews">${getReviewList(currentGeoObjects)}</div>` + formTemplate
    })



    document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault()

        const review = {
            coords,
            place: this.elements.place.value,
            author: this.elements.name.value,
            textReview: this.elements.textReview.value
        }

     
 
        localStorage.reviews = JSON.stringify([...getReviewsFormLS(), review]);

        renderGeoObjects(map);

        map.balloon.close();
    })
}
