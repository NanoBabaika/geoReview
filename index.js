// Константы 58:20
const formTemplate = `
<form id="add-form" action="">
<input type="text" placeholder="Ваше место" name="place"><br><br>
<input type="text" placeholder="Ваш никнейм" name="name"><br><br>
<textarea name="textReview" placeholder="Ваш отзыв"></textarea><br><br>
<button>Отправить отзыв</button>
</form>
`


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
    for(const review of getReviewsFormLS()) {
        const placemark = new ymaps.Placemark(review.coords);
        map.geoObjects.add(placemark);
    }
}

async function openBalloon(map, coords, currentGeoObjects) {

    await map.balloon.open(coords, {
        content: `<div class="reviews">Отзывы здесь</div>` + formTemplate
    })



    document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault()

        const review = {
            coords,
            place: this.elements.place.value,
            author: this.elements.name.value,
            textReview: this.elements.textReview.value
        }

        console.log(review);

 
        localStorage.reviews = JSON.stringify(...getReviewsFormLS(), review);

        renderGeoObjects(map);

        map.balloon.close();
    })
}
