let add = document.querySelector("form button");

add.addEventListener("click", event => {
    event.preventDefault(); //.preventDefault阻擋預設行為
    //console.log(event.target);  //.target  表示觸發事件的元素
    //console.log(event.target.parentElement);
    let form = event.target.parentElement; //抓取上層元素

    let todoText = form.children[0].value;
    //console.log(form.children[0].value);

    let todoYear = form.children[1].value;
    let todoMonth = form.children[2].value;
    let todoDate = form.children[3].value;

    //console.log(todoText, todoYear, todoMonth, todoDate);

    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;  //▪ innerText -插入指定文字
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoYear + "/" + todoMonth + "/" + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    // 按下新增事項按鈕後清空輸入框
    form.children[0].value = "";

    // 提示未輸入資料
    if (todoText === "") {
        alert("請輸入事項");
        return;
    }

    let section = document.querySelector("section");

    // = <section><div class="todo"><p class="todo-text"></p><p class="todo-time"></p></div></section>

    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    // 事項完成時標示記號
    completeButton.addEventListener("click", event => {
        let todoItem = event.target.parentElement;
        console.log(event.target);
        console.log(event.target.parentElement);
        todoItem.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    // 設定移除動畫與特效
    trashButton.addEventListener("click", event => {
        let todoItem = event.target.parentElement;
        //animationend在一個CSS 動畫完成後，觸發
        todoItem.addEventListener("animationend", () => { 
            // 刪除localStorage資料
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.3s forwards";



    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    // 新增事項時彈出動畫
    todo.style.animation = "scaleUp 0.5s forwards";

    section.appendChild(todo);

    // 將資料以陣列方式存入localStorage，下次載入頁面時，資料依舊存在
    let myTodo = {
        todoText: todoText,
        todoYear: todoYear,
        todoMonth: todoMonth,
        todoDate: todoDate
    };  // 一個物件

    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));  // 字串化myTodo，因為localStorage只能存字串
    } else {
        // 如果不是空值
        let myListArray = JSON.parse(myList);  //將myList轉成陣列
        myListArray.push(myTodo); //新增資料
        localStorage.setItem("list", JSON.stringify(myListArray)); //再轉回字串存起來
    }

    console.log(JSON.parse(localStorage.getItem("list")));

});


// 排序時間函式
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoYear) > Number(arr2[j].todoYear)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoYear) < Number(arr2[j].todoYear)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoYear) == Number(arr2[j].todoYear)) {
            // 如果年一樣排序月
            if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
                result.push(arr2[j]);
                j++;
            } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
                result.push(arr1[i]);
                i++;
            } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
                // 如果月一樣排序日
                if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                    result.push(arr2[j]);
                    j++;
                } else {
                    result.push(arr1[i]);
                    i++;
                }
            }
        }
    }
    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++
    }
    return result;
};

// 排序事件函式
function mergeSort(arr) {

    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
};

// 載入資料
function loadData() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);

            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fas fa-check"></i>';
            // 事項完成時標示記號
            completeButton.addEventListener("click", event => {
                let todoItem = event.target.parentElement;
                todoItem.classList.toggle("done");
            })
            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';
            // 設定移除動畫與特效
            trashButton.addEventListener("click", event => {
                let todoItem = event.target.parentElement;
                //animationend在一個CSS 動畫完成時觸發
                todoItem.addEventListener("animationend", () => {
                    todoItem.remove();
                })
                todoItem.style.animation = "scaleDown 0.3s forwards";

                // 刪除localStorage資料
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item, index) => {
                    if (item.todoText == text) {
                        myListArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                })

            })

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            // 新增事項時彈出動畫
            todo.style.animation = "scaleUp 0.3s forwards";

            let section = document.querySelector("section");
            section.appendChild(todo);
        });


    }

}

// 排序按鈕
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));


    let section = document.querySelector("section");

    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    loadData();

    
});


// 下次載入頁面時，抓取localStorage的資料
let myList = localStorage.getItem("list");

if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach(item => {
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time);

        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fas fa-check"></i>';
        // 事項完成時標示記號
        completeButton.addEventListener("click", event => {
            let todoItem = event.target.parentElement;
            todoItem.classList.toggle("done");
        })
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        // 設定移除動畫與特效
        trashButton.addEventListener("click", event => {
            let todoItem = event.target.parentElement;
            //animationend在一個CSS 動畫完成時觸發
            todoItem.addEventListener("animationend", () => {
                // 刪除localStorage資料
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item, index) => {
                    if (item.todoText == text) {
                        myListArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                })

                todoItem.remove();
            })
            todoItem.style.animation = "scaleDown 0.3s forwards";


        })

        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        // 新增事項時彈出動畫
        todo.style.animation = "scaleUp 0.3s forwards";

        let section = document.querySelector("section");
        section.appendChild(todo);
    });


}



