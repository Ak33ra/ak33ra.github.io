// Questions will be asked
const Questions = [{
    id: 0,
    q: "Mark Zuckerberg renamed Facebook to what?",
    a: [{ text: "Meta", isCorrect: true },
        { text: "Handstory", isCorrect: false },
        { text: "Nodelink", isCorrect: false },
        { text: "Zuck and co", isCorrect: false }
    ]

},
{
    id: 1,
    q: "ASIC chips are replaced on average every _____ years",
    a: [{ text: "3 trillion", isCorrect: false, isSelected: false },
        { text: "never", isCorrect: false },
        { text: "1.29", isCorrect: true },
        { text: "3.23", isCorrect: false }
    ]

},
{
    id: 2,
    q: "Proof of work is also known as",
    a: [{ text: "Quick maths", isCorrect: false },
        { text: "Drilling", isCorrect: false },
        { text: "Mining", isCorrect: true },
        { text: "Voodoo", isCorrect: false }
    ]

},
{
    id: 3,
    q: "Bitcoin emitted _____ metric tons of CO2 in 2017",
    a: [{ text: "Your phone number", isCorrect: false },
        { text: "69 million", isCorrect: true },
        { text: "A couple", isCorrect: false },
        { text: "Too many", isCorrect: true }
    ]
},
{
    id: 4,
    q: "The metaverse was compared to what movie?",
    a: [{ text: "The SpongeBob Movie: Sponge on the Run", isCorrect: false },
        { text: "Harry Potter", isCorrect: false },
        { text: "Elf", isCorrect: false },
        { text: "Ready Player One", isCorrect: true }
    ]
}

]

// Set start
var start = true;
const score = {val: 0};

// Iterate
function iterate(id) {

// Getting the result display section
var result = document.getElementsByClassName("result");
result[0].innerText = "";

// Getting the question
const question = document.getElementById("question");

// Setting the question text
question.innerText = Questions[id].q;

// Getting the options
const op1 = document.getElementById('op1');
const op2 = document.getElementById('op2');
const op3 = document.getElementById('op3');
const op4 = document.getElementById('op4');


// Providing option text 
op1.innerText = Questions[id].a[0].text;
op2.innerText = Questions[id].a[1].text;
op3.innerText = Questions[id].a[2].text;
op4.innerText = Questions[id].a[3].text;

// Providing the true or false value to the options
op1.value = Questions[id].a[0].isCorrect;
op2.value = Questions[id].a[1].isCorrect;
op3.value = Questions[id].a[2].isCorrect;
op4.value = Questions[id].a[3].isCorrect;

op1.style.backgroundColor = "white";
op2.style.backgroundColor = "white";
op3.style.backgroundColor = "white";
op4.style.backgroundColor = "white";

var selected = "";

// Show selection for op1
op1.addEventListener("click", () => {
    op1.style.backgroundColor = "lightgoldenrodyellow";
    op2.style.backgroundColor = "white";
    op3.style.backgroundColor = "white";
    op4.style.backgroundColor = "white";
    selected = op1.value;
})

// Show selection for op2
op2.addEventListener("click", () => {
    op1.style.backgroundColor = "white";
    op2.style.backgroundColor = "lightgoldenrodyellow";
    op3.style.backgroundColor = "white";
    op4.style.backgroundColor = "white";
    selected = op2.value;
})

// Show selection for op3
op3.addEventListener("click", () => {
    op1.style.backgroundColor = "white";
    op2.style.backgroundColor = "white";
    op3.style.backgroundColor = "lightgoldenrodyellow";
    op4.style.backgroundColor = "white";
    selected = op3.value;
})

// Show selection for op4
op4.addEventListener("click", () => {
    op1.style.backgroundColor = "white";
    op2.style.backgroundColor = "white";
    op3.style.backgroundColor = "white";
    op4.style.backgroundColor = "lightgoldenrodyellow";
    selected = op4.value;
})

// Grabbing the evaluate button
const evaluate = document.getElementsByClassName("evaluate");

// Evaluate method
evaluate[0].addEventListener("click", () => {
    if (selected == "true") {
        result[0].innerHTML = "True";
        result[0].style.color = "green";
    } else {
        result[0].innerHTML = "False";
        result[0].style.color = "red";
    }
})
}

if (start) {
iterate("0");
}

// Next button and method
const next = document.getElementsByClassName('next')[0];
var id = 0;

next.addEventListener("click", () => {
start = false;
if (id < 4) {
    id++;
    iterate(id);
    
}

})