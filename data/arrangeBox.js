//Конструктор контрола ArrangeBox 
function arrangeBox(containerID, arrangeBoxId, possibleValuesList = []) {
    this._container = document.getElementById(containerID);
    this._possibleValuesList = possibleValuesList;
    this._selectedValuesList = [];
    this._id = arrangeBoxId;
    this._filterID = 0;

    this._render();
}

//Методы контрола ArrangeBox (вынесены в прототип, т.к. так принято, и это не плодит переопределения методов в каждом экземпляре)
arrangeBox.prototype = {

    //Начальная отрисовка контрола 
    _render: function () {

        //#region создание элементов
        const arrangeBox = document.createElement('div')
        arrangeBox.id = this._id
        arrangeBox.classList.add('arrangeBox')

        //создание панели поиска и сортировки
        const functionalBar = document.createElement('div')
        functionalBar.classList.add('functionalBar')

        //поисковая строка
        const searchInput = document.createElement('input');
        searchInput.classList.add('arrangeBoxSearch');
        searchInput.placeholder = 'Поиск';
        searchInput.type = 'text';
        searchInput.addEventListener('input', (event) => searchElements(event.target))

        //Сортировка
        const filterSelect = document.createElement('select');
        filterSelect.classList.add("arrangeBoxSort");
        filterSelect.addEventListener('change', (event) => setFilter(event))
        filterSelect.id = `${this._id}-Sort`

        const optionsNames = ['сортировка', 'наименование A-Я', 'Наименование Я-А', 'цена по возрастанию', 'цена по убыванию'];

        optionsNames.forEach((value, index) => {
            let option = document.createElement('option')
            option.value = index;
            option.textContent = value;
            filterSelect.appendChild(option);
        })

        functionalBar.append(searchInput, filterSelect)

        //Создание списков 
        const lists = document.createElement('div')
        lists.classList.add("arrangeBoxLists")

        const possibleValues = document.createElement('div')
        possibleValues.classList.add("arrangeBoxList")
        possibleValues.id = `${this._id}-possibleValues`
        possibleValues.addEventListener('click', (event) => selectListItem(event, this._possibleValuesList))

        const selectedValues = document.createElement('div')
        selectedValues.classList.add("arrangeBoxList")
        selectedValues.id = `${this._id}-selectedValues`
        selectedValues.addEventListener('click', (event) => selectListItem(event, this._selectedValuesList))


        //Создание кнопок
        const buttonsContainer = document.createElement('div')
        buttonsContainer.classList.add('arrangeBoxSelectButtons')

        buttonsLabels = ['>', '>>', '<', '<<']

        const [moveToRightButton, moveToRightAllButton, moveToLeftButton, moveToLeftAllButton] = buttonsLabels.map(label => {
            let button = document.createElement('button');
            button.textContent = label
            button.classList.add("arrangeBoxButton")
            return button
        })


        moveToRightButton.addEventListener('click', () => moveItemsTo(this._possibleValuesList, this._selectedValuesList))
        moveToRightAllButton.addEventListener('click', () => moveItemsTo(this._possibleValuesList, this._selectedValuesList, true))
        moveToLeftButton.addEventListener('click', () => moveItemsTo(this._selectedValuesList, this._possibleValuesList))
        moveToLeftAllButton.addEventListener('click', () => moveItemsTo(this._selectedValuesList, this._possibleValuesList, true))

        buttonsContainer.append(moveToRightButton, moveToRightAllButton, moveToLeftButton, moveToLeftAllButton);

        lists.append(possibleValues, buttonsContainer, selectedValues);
        arrangeBox.append(functionalBar, lists)



        //#endregion

        //#region Обработчики событий:


        const selectListItem = (event, valuesList = []) => {
            let listItem = event.target.closest('.arrangeBoxlistItem');
            if (listItem) {
                listItem.classList.toggle('selected');
                valueOfList = valuesList.find(value => value.id === parseInt(listItem.id));
                valueOfList.selected = !valueOfList.selected;
            }
        }

        //Обаботка событий кликов по кнопкам контрола

        //Перемещение элементов между списками 
        const moveItemsTo = (sourceList, destinationList, moveAll = false) => {



            if (moveAll === true) {
                destinationList.push(...sourceList.map(value => {
                    return { ...value, selected: false }
                }));
                sourceList.splice(0, sourceList.length);
            }
            else {
                const selectedItems = sourceList.filter(value => value.selected === true)

                selectedItems.forEach(value => {

                    const index = sourceList.indexOf(value);
                    if (index !== -1)
                        sourceList.splice(index, 1);


                    value.selected = false;
                    destinationList.push(value);
                })
            }
            this._sortPossibleValues(this._filterID)
            this._renderList(this._possibleValuesList, `${this._id}-possibleValues`);
            this._renderList(this._selectedValuesList, `${this._id}-selectedValues`);
        }

        //Обработка поиска
        const searchElements = (target) => {

            if (target.value !== '') {
                let searchValue = target.value.toLowerCase()

                let searchedElements = this._possibleValuesList.filter(value => value.name.toLowerCase().includes(searchValue))

                this._renderList(searchedElements, `${this._id}-possibleValues`)
            }
            else {

                this._renderList(this._possibleValuesList, `${this._id}-possibleValues`)
            }
        }

        //обработчик события установки фильтра
        const setFilter = (event) => {

            this._filterID = parseInt(event.target.value)
            this._sortPossibleValues(this._filterID)

            this._renderList(this._possibleValuesList, `${this._id}-possibleValues`);
        }
        //#endregion

        this._container.appendChild(arrangeBox)

        if (this._possibleValuesList.length !== 0) {
            this._sortPossibleValues(this._filterID)
            this._renderList(this._possibleValuesList, `${this._id}-possibleValues`)
        }


    },

    //сортировка массива доступных значений
    _sortPossibleValues: function (selectValue) {

        switch (selectValue) {

            case 1:
                this._possibleValuesList.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 2:
                this._possibleValuesList.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 3: this._possibleValuesList.sort((a, b) => a.price - b.price);
                break;
            case 4: this._possibleValuesList.sort((a, b) => b.price - a.price);
        }
    },

    //Перерисовка списка
    _renderList: function (itemsList, listID) {

        const listElement = document.getElementById(listID)
        listElement.innerHTML = ''

        itemsList.forEach(value => {
            let listItem = document.createElement('div');
            listItem.classList.add('arrangeBoxlistItem');
            if (value.selected)
                listItem.classList.add('selected');
            listItem.id = value.id;
            listItem.innerHTML = `<span class="itemHeader">${value.name}</span><span class="itemPrice">$${value.price}</span>`
            listItem.addEventListener('click', event => { event, itemsList });
            listElement.appendChild(listItem);
        })
    },

    //установка списка возможных значений
    setPossibleValues: function (possibleValues) {


        this._possibleValuesList.splice(0, this._possibleValuesList.length);
        this._possibleValuesList.push(...possibleValues);
        this._renderList(this._possibleValuesList, `${this._id}-possibleValues`);
        this.setSelectedValues();
    },

    //Установка списка выбранных значений
    setSelectedValues: function (selectedValues = []) {
        this._selectedValuesList.splice(0, this._selectedValuesList.length);
        this._selectedValuesList.push(...selectedValues);
        this._renderList(this._selectedValuesList, `${this._id}-selectedValues`);
    },

    //Добавление возможного значения
    addPossibleValue: function (possibleValue) {
        this._possibleValuesList.push(possibleValue);
        this._renderList(this._possibleValuesList, `${this._id}-possibleValues`);
    },

    //удаление элемента из списка возможных значений
    removePossibleValue: function (value) {

        const index = this._possibleValuesList.findIndex(item => item.id === value.id);

        if (index !== -1)
            this._possibleValuesList.splice(index, 1);

        this._renderList(this._possibleValuesList, `${this._id}-possibleValues`);
    },

    //Получение текущего значения контрола
    state: function () {

        return {
            id: this._id,
            container: this._container,
            filter: this._filterID,
            possibleValues: this._possibleValuesList,
            selectedValues: this._selectedValuesList
        }
    },

    //Сброс контрола к начальному состоянию
    reset: function () {

        this._possibleValuesList.push(...this._selectedValuesList);
        this._selectedValuesList.splice(0, this._selectedValuesList.length)
        this._possibleValuesList.forEach(value => value.selected = false);
        this._filterID = 0;
        document.getElementById(`${this._id}-Sort`).value = this._filterID;
        this._sortPossibleValues(this._filterID);
        this._renderList(this._possibleValuesList, `${this._id}-possibleValues`);
        this._renderList(this._selectedValuesList, `${this._id}-selectedValues`);
    }
}

//экземпляр контрола ArrangeBox

let arrangeBoxOne = new arrangeBox('container', 'ab1')
