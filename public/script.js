
const start = document.getElementById('start')

start.addEventListener('click', function (e) {
    CookiesDelete()
    getQuestion()
    start.style = 'display: none'
})


function getQuestion() {
    fetch("/questions")
        .then((response) => response.json())
        .then((response) => {

            let showQuestion = document.getElementById("questions");
            showQuestion.innerHTML = response.question

            let buttons = document.getElementById('buttons')

            if (response.answer) {
                response.answer.forEach(element => {
                    let newButton = document.createElement('button')
                    buttons.append(newButton)
                    newButton.innerHTML = element
                    newButton.setAttribute('class', 'answer_button')
                    newButton.setAttribute('value', response.id)
                    newButton.setAttribute('type', 'submit')
                });
            }
            if (!response.answer) {
                start.style = 'displayl: block'
            }
        })
}

let buttons = document.querySelector('#buttons')
let nodeNext = document.querySelector('#next')

buttons.addEventListener('click', function (event) {
    let target = event.target

    targetAnswer = target.innerText
    questionId = target.getAttribute('value')

    let nextBtn = document.createElement('p')
    nodeNext.append(nextBtn)
    nextBtn.innerHTML = 'Следующий вопрос'
    nextBtn.classList.add('next')

    let nextBtnText = document.querySelector('#next p')

    nextBtn.onclick = () => {
        let btns = document.querySelectorAll('button')
        nextBtnText.remove()

        for (const iterator of btns) {
            iterator.remove()
        }
        getQuestion()
    }

    let send = {
        'answer': targetAnswer,
        'questionId': questionId
    }

    fetch('/questionsanswers', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send)
    }).then((response) => response.json())
        .then((response) => {

            btn = document.getElementsByTagName('button')

            for (const iterator of btn) {
                if (response.trueAnswer === iterator.innerHTML) {
                    iterator.setAttribute('id', 'trueAnswer')
                } else {
                    iterator.setAttribute('id', 'falseAnswer')
                }
                iterator.setAttribute('disabled', 'true')
            }
        })
})

function CookiesDelete() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}