// Константы 48:20
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


async function openBalloon(map, coords, currentGeoObjects) {

    await map.balloon.open(coords, {
        content: `<div class="reviews">Отзывы здесь</div>` + formTemplate
    })



    document.querySelector('#add-form').addEventListener('submit', function (e) {
        e.preventDefault()


        const review = {
            coords,
            place: this.elements.place.value,
            author: this.elements.author.value,
            reviewText: this.elements.reviewText.value
        }

        console.log(review);
    })
}
