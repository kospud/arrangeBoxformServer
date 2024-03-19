const submitBtn = document.getElementById('submit')

//Отправка данных на сервер
submitBtn.addEventListener('click', () => {

    const state = arrangeBoxOne.state();
    const data = {
        selectedValues: state.selectedValues.map(value => {
            const { selected, ...item } = value;
            return item;
        })
    };


    fetch('cart', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok)
                alert("Товары добавлены в корзину")
        })
        .catch((err) => {
            alert(err.messege)
        })

});

//получение данных на сервере 
(
    function getData() {

        fetch('data.json')
            .then((response) => {
                if (response.ok)
                    return response.json();
            })
            .then((data) => {

                const clothes = data.clothes.map(element => { return { ...element, selected: false } })
                arrangeBoxOne.setPossibleValues(clothes)


            })
    })()