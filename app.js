//git commit -am "make it better"
//git push heroku master
//https://blooming-plains-91755.herokuapp.com/
// Require packages and set the port
const express = require('express');
const port = process.env.PORT || 3002
const app = express();
const path = require('path');
const session = require('express-session');


const arrayQuestionsAndAnswers = [
    {
        'id': 0,
        'question': 'Какого числа отмечают День солидарности трудящихся?',
        'answer': ['Первого мая', 'Седьмого ноября', 'Восьмого марта', 'Четвертого июня']
    },
    {
        'id': 1,
        'question': 'Какого вида транспорта не существует?',
        'answer': ['Пешеходный', 'Авиационный', 'Городской общественный', 'Железнодорожный']
    },
    {
        'id': 2,
        'question': 'Кто по профессии братья Жемчужниковы?',
        'answer': ['Писатели', 'Актеры', 'Певцы ', 'Политики']
    },
    {
        'id': 3,
        'question': 'Как называется в геометрии линия, делящая угол пополам?',
        'answer': ['Биссектриса', 'Секущая', 'Гипотенуза', 'Синусоида']
    },
    {
        'id': 4,
        'question': 'Какого цвета волосы были у Мальвины из "Золотого ключика"?',
        'answer': ['Голубые', 'Разноцветные', 'Розовые', 'Золотые']
    },
    {
        'id': 5,
        'question': 'Какое дерево характерно для саванн Африки?',
        'answer': ['Баобаб', 'Эвкалипт', 'иственница', 'Береза']
    },
    {
        'id': 6,
        'question': 'От чего яблоко падает недалеко?',
        'answer': ['От яблони', 'От дома', 'От Ньютона', 'От забора']
    },
    {
        'id': 7,
        'question': 'Где периодически происходит сокращение штатов?',
        'answer': ['В учреждениях', 'В США', 'В бюджете', 'В налогах']
    },
    {
        'id': 8,
        'question': 'Какое ежегодное мероприятие в Рио-де-Жанейро привлекает туристов со всего мира?',
        'answer': ['Карнавал', 'Военный парад', 'Кинофестиваль', 'Экономический форум']
    },
    {
        'id': 9,
        'question': 'Что из перечисленного Кот Матроскин не предъявлял в качестве своих документов?',
        'answer': ['Уши', 'Лапы', 'Усы', 'Хвост']
    },
    {
        'id': 10,
        'question': 'Про кого С.Маршак написал стихотворение "Усатый - полосатый" ?',
        'answer': ['Про котенка', 'Про гусара', 'Про матроса', 'Про офицера']
    },
    {
        'id': 11,
        'question': 'Что из этого не является именем известного поросенка?',
        'answer': ['Полтинник', 'Фунтик', 'Хрюша', 'Нуф-Нуф']
    },
    {
        'id': 12,
        'question': 'Кого, предположительно, можно обнаружить в тихом омуте?',
        'answer': ['Чертей', 'Угрей', 'Червей', 'Бубей']
    },
    {
        'id': 13,
        'question': 'От какого сладкого лакомства заболел старик Хоттабыч?',
        'answer': ['Мороженое', 'Лимонад', 'Орехи', 'Шоколад']
    },
    {
        'id': 14,
        'question': 'Как звали пушкинского Онегина?',
        'answer': ['Евгений', 'Александр', 'Иван', 'Михаил']
    },
];

let users = [
    {
        'id': 'test',
        'questions': 'test',
        'correctAnswers': 0
    }
]

let pathToSite = path.join(__dirname, 'index.html')

//Use Node.js body parsing middleware
app.use(express.static('public'));
app.use(express.json({ extended: true }))

app.use(session({
    secret: 'keyboard cats',
    name: 'app',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: false, }
}));

app.get('/', (request, response) => {
    response.sendFile(pathToSite)
})

app.get('/questions', (request, response) => {
    addUser(request)
    response.send(findUser(request))
})

app.post('/questionsanswers', (request, response) => {
    let trueAnswer = answerToTheQuestion(request.body, request.sessionID)
    response.send(trueAnswer)
})

app.get('*', (request, response) => {
    response.sendStatus(404)
});

// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});

function getRandomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function addUser(request) {
    let userId = request.sessionID
    let copyQuestions = arrayQuestionsAndAnswers.slice()

    let findUser = users.filter(function (find) {
        return find.id == userId;
    });


    if (findUser.length == 0) {
        let newuser = {
            'id': userId,
            'questions': copyQuestions,
            'correctAnswers': 0
        }
        users.push(newuser)
    }
}

function findUser(request) {
    let userId = request.sessionID

    let findUser = users.filter(e => e.id === userId)

    let getQuestion = findUser[0].questions[0]

    if (findUser[0].questions != 0) {
        let shuffledAnswers = findUser[0].questions[0].answer.slice()

        shuffleArray(shuffledAnswers)

        findUser[0].questions.splice(0, 1)

        sendQuestion = {
            'id': getQuestion.id,
            'question': getQuestion.question,
            'answer': shuffledAnswers
        }
    } else {
        sendQuestion = {
            'id': '',
            'question': 'Количество правильных ответов ' + findUser[0].correctAnswers + ' из 15',
            'answer': ''
        }
    }
    return sendQuestion
}


function answerToTheQuestion(requestAnswer, userId) {

    let findQuestion = arrayQuestionsAndAnswers.filter(function (e) {
        return e.id == requestAnswer.questionId;
    });

    let sendAnswer = {
        'trueAnswer': ''
    }

    let findUser = users.filter(e => e.id === userId)

    if (requestAnswer.answer === findQuestion[0].answer[0]) {
        findUser[0].correctAnswers++
    }

    if (requestAnswer.questionId) {
        sendAnswer = {
            'trueAnswer': findQuestion[0].answer[0]
        }
    }

    return sendAnswer
}
