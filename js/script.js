const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

const score =  document.querySelector('.score--value')
const finalscore =  document.querySelector('.final--score > span')
const menu = document.querySelector('.menu--screen')
const buttonplay = document.querySelector('.btn-play')

const audio = new Audio("../audio/audio.mp3")

const size = 30

const incrementscore = () => {
    score.innerText = +score.innerText + 10
}


const initialposition = { x: 270, y: 240}
  


let snake = [
    { x: 270, y: 240},
  
]

const randomnumber = (min,max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomposition = (min,max) => {
   const number = randomnumber(0, canvas.width - size)
   return Math.round(number / 30) * 30
}

const randomcolor = ( ) =>{
    const red = randomnumber(0, 255)
    const green = randomnumber(0, 255)
    const blue = randomnumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`

}

const food = {
    x:randomposition(),
    y:randomposition(),
    color: randomcolor()
}

let direction,loopId

const drawfood = ( ) => {

    const {x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillStyle = color
    ctx.fillRect(x,y, size,size)
    ctx.shadowBlur = 0


}

const drawsnake = ( ) => {
    ctx.fillStyle = "#ddd"
  
    snake.forEach((position, index) => {

        if(index == snake.length -1 ){
            ctx.fillStyle = "white"

        }

        ctx.fillRect(position.x, position.y, size, size)
    })

}

const movesnake = ( ) => {
    if(!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right"){
        snake.push({x: head.x + size, y:head.y })
    }

    if (direction == "left"){
        snake.push({x: head.x - size, y:head.y })
    }

    if (direction == "down"){
        snake.push({x: head.x, y:head.y + size })
    }

    if (direction == "up"){
        snake.push({x: head.x, y:head.y - size})
    }

        snake.shift()
}

const drawgrid = ( ) => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i= 30; i < canvas.width;i += 30){
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i,600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(600,i)
        ctx.stroke()
        
}

    }

const chackeat = ( ) => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y ){
        incrementscore()
        snake.push(head)
        audio.play()

        let x = randomposition()
        let y =  randomposition()

        while(snake.find((position) => position.x == x && position.y == y)){
           
        x = randomposition()
        y =  randomposition() 

        }

        food.x = x
        food.y = y
        food.color = randomcolor()
    }
}

const checkcollision = ( ) => {
    const head = snake[snake.length - 1]
    const canvaslimit = canvas.width - size
    const neckindex = snake.length - 2


    const wallcollision = head.x < 0 || head.x > canvas.width|| head.y < 0 || head.y > canvas.width


    const selfcollision = snake.find((position, index) => {
        return index <  neckindex && position.x == head.x && position.y == head.y
    })

    if (wallcollision || selfcollision){
    gameover()

    }
}

const gameover = ( ) => {
    direction = undefined

    menu.style.display = "flex"
    finalscore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"

}

const gameloop = ( ) => {
    clearInterval(loopId)

    ctx.clearRect(0,0,600,600)
    drawgrid()
    drawfood()
    movesnake()
    drawsnake()
    chackeat()
    checkcollision()
  
loopId = setTimeout(() => {
    gameloop()
},300) //velocidade da cobrinha//

}

gameloop()

document.addEventListener("keydown", ({ key }) => {

    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }

})

buttonplay.addEventListener("click",() => {

score.innerText = "00"
menu.style.display = "none"
canvas.style.filter = "none"
snake = [initialposition]

})


