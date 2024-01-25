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
        console.log(e.get('coords'))
        // здесь открывать балун
    })
}


async function openBalloon(map, coords, currentGeoObjects) {
    await map.ballon.open(coords, {
        content: ``
    })
}
