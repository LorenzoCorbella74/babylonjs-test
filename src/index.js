import "./styles.scss";

import Game from './game.js'

window.addEventListener('DOMContentLoaded', () => {
    const canvas = initCanvas()
    const game = new Game(canvas)
    game
        .createScene()
        .startLoop()
})

function removeExistingCanvas () {
    const els = document.body.children
    if (els.length > 0) document.body.removeChild(els.item(0))
}

function initCanvas () {
    removeExistingCanvas()
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    return canvas
}