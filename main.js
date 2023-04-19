const sprite = document.getElementById('sprite')
const apple = document.getElementById('apple')
const poisons = document.getElementsByClassName('poison')
const contentBox = document.getElementById('content')
const scoreContainer = document.getElementById('score')
let score = 0
const DIRECTIONS = {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down'
}
let direction = DIRECTIONS.left


function start() {
    show(apple)
    randomizePosition(apple)
    forever()
}

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        pointInDirection("left")
    }
})

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        pointInDirection("right")
    }
})

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        pointInDirection("up")
    }
})

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { 
        pointInDirection ("down")
    }
})


function forever() {
    if (!window.intervalId) {
        window.intervalId = setInterval(() => {
            move10Steps()
            checkCollision()
        }, 25)
    }
}

function stop() {
    clearInterval(window.intervalId)
    reset()
    window.intervalId = undefined
}

function pointInDirection(dir) {
    if (!window.intervalId) return
    sprite.className = ''
    sprite.classList.add(dir)
    direction = dir
}

function move10Steps() {
    const speed = 10
    const spriteWidth = 50
    const borderWidth = 2
    const margin = 5 * 16
    const headerHeight = 120
    switch (direction) {
        case DIRECTIONS.left: {
            let newOffset = sprite.offsetLeft - speed
            if (newOffset <= 0) {
                newOffset = 0
            }
            sprite.style.left = newOffset + 'px'
            break;
        }
        case DIRECTIONS.right: {
            let newOffset = sprite.offsetLeft + speed
            if (sprite.offsetLeft + 50 + speed > contentBox.getBoundingClientRect().right - margin) {
                newOffset = contentBox.getBoundingClientRect().right - margin - spriteWidth - 2 * borderWidth
            }
            sprite.style.left = newOffset + 'px'
            break;
        }
        case DIRECTIONS.up: {
            let newOffset = sprite.offsetTop - speed
            if (newOffset <= 0) {
                newOffset = -1
            }
            sprite.style.top = newOffset + 'px'
            break;
        }
        case DIRECTIONS.down: {
            let newOffset = sprite.offsetTop + speed
            if (newOffset > contentBox.getBoundingClientRect().bottom - headerHeight - margin - spriteWidth - borderWidth) {
                newOffset = contentBox.getBoundingClientRect().bottom - headerHeight - margin - spriteWidth - 2 * borderWidth
            }
            sprite.style.top = newOffset + 'px'
            break;
        }
    }
}

function reset() {
    sprite.style.top = 'calc(50% - 25px)'
    sprite.style.left = '80%'
    sprite.className =  DIRECTIONS.left
    direction = DIRECTIONS.left
    apple.style.visibility = 'hidden'
    score = 0
    scoreContainer.innerHTML = ''
    while (poisons.length > 0) {
        poisons[0].parentNode.removeChild(poisons[0]);
    }
}

function show(element) {
    element.style.visibility = 'visible'
}

function randomizePosition(element) {
    const randomTop = Math.random() * contentBox.clientHeight
    element.style.top = (randomTop - 50 > 0 ? randomTop - 50 : 0) + 'px'
    const randomLeft = Math.random() * contentBox.clientWidth
    element.style.left = (randomLeft - 94 > 0 ? randomLeft - 94 : 0) + 'px'
}

function checkCollision() {
    if (collidesWith(sprite, apple)) {
        increaseScore()
        randomizePosition(apple)
        addPoison()
    }
    for (let p of poisons) {
        if (collidesWith(p, sprite)) {
            gameOver()
        }
    }
}

function collidesWith(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

async function gameOver() {
    await alert('game over')
    stop()
}

function increaseScore() {
    score++
    scoreContainer.innerHTML = 'Score: '+ score

}

function addPoison() {
    const el = document.createElement('img' )
    el.src = "images/poison.svg"
    el.className = 'poison'
    contentBox.appendChild(el)
    randomizePosition(el)
}