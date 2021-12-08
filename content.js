chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        document.addEventListener('mousemove', () => {
            if (document.getElementById('tooltipOpquast') !== null) {
                document.getElementById('tooltipOpquast').remove();
            }
        }, false);


        if (request.message === "clicked_browser_action") {
            localStorage.removeItem('website');
            if (localStorage.getItem('website') === null) {
                fetch('https://api.myjson.com/bins/10l9g0', {
                    headers: {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest'

                    }
                }).then(function (res) {
                    return res.text();
                }).then(function (html) {
                    localStorage.setItem('website', html);
                });
            }

            document.body.onkeydown = function (evt) {
                if (evt.shiftKey === true || evt.ctrlKey === true) {
                    const opquastContent = JSON.parse(localStorage.getItem('website'));
                    let selection = document.getSelection ? document.getSelection().toString() : document.selection.createRange().toString();

                    if (selection !== '') {
                        let bonnePratiqueTosearch = opquastContent.filter((bonnePratique) => {
                            return bonnePratique.title.includes(selection.replace(/(\r\n|\n|\r|^ | $)/gm, ""));
                        });

                        if (bonnePratiqueTosearch.length === 0) {
                            bonnePratiqueTosearch = opquastContent.filter((bonnePratique) => {
                                let hasSting = false;
                                bonnePratique.objectifs.forEach((objectif) => {
                                    if (objectif.includes(selection.replace(/(\r\n|\n|\r|^ | $)/gm, "")) === true) {
                                        hasSting = true;
                                    }
                                });
                                return hasSting;
                            });
                        }
                        if (bonnePratiqueTosearch.length > 0) {
                            let div = document.getElementById('tooltipOpquast') === null ? document.createElement('div') : document.getElementById('tooltipOpquast');
                            if (evt.ctrlKey === true) {
                                let questionLists = [...document.getElementsByClassName('wpProQuiz_listItem')];

                                let question = questionLists.filter((question) => {
                                    return question.style.cssText !== 'display: none;';
                                });

                                let liAnswers = [...question[0].getElementsByClassName('wpProQuiz_questionListItem')];

                                let answers = liAnswers.map((answer) => {
                                    return answer.getElementsByTagName('label');
                                });

                                answers.forEach((answer) => {
                                    bonnePratiqueTosearch[0].objectifs.forEach((objectif) => {
                                        if (objectif.includes(answer[0].innerText.replace(/(\r\n|\n|\r|^ | $)/gm, "")) === true) {
                                            answer[0].classList.add('right-answer');
                                        }
                                    });
                                });
                            }
                            if (evt.shiftKey === true) {
                                createToolTip(div, bonnePratiqueTosearch[0].title);
                                addObjectifForTooltip(bonnePratiqueTosearch[0].objectifs);
                            }
                        }
                    }
                }
            };

            document.body.onkeyup = function (evt) {
                if (evt.key === 'Shift') {
                    let div = document.getElementById('tooltipOpquast') === null ? null : document.getElementById('tooltipOpquast');
                    if (div !== null) {
                        div.parentElement.removeChild(div);
                    }
                }
                if (evt.key === 'Control') {
                    let rightAnswer = [...document.getElementsByClassName('right-answer')];
                    if (rightAnswer.length > 0) {
                        rightAnswer.forEach((answer) => {
                            answer.classList.remove('right-answer');
                        })
                    }
                }
            }
        }
    }
);


function createToolTip(div, title) {
    div.innerHTML = `
                    <div id="tooltipOpquast">
                      <div class="tooltiptext">
                        <div class="title">${title}</div>
                        <div>
                        <ul id="objectifsList">
                        </ul>
                        </div>
                      </div>
                    </div>`;
    document.body.appendChild(div);
}

function addObjectifForTooltip(objectifs) {
    objectifs.forEach((objectif) => {
        let li = document.createElement('li');
        document.getElementById('objectifsList').appendChild(li);
        li.innerHTML = objectif;
    });
}