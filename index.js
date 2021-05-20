var quadro;
const humano = 'O';
const maquina = 'X';
const jogadas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();
//Faz o jogo iniciar
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    quadro = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}
//muda o turno ao clicar
function turnClick(square) {
    if (typeof quadro[square.target.id] == 'number') {
        turn(square.target.id, humano)
        if (!checkWin(quadro, humano) && !checkTie()) turn(bestSpot(), maquina);
    }
}
//Turno
function turn(squareId, player) {
    quadro[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let vencedor = checkWin(quadro, player)
    if (vencedor) gameOver(vencedor)
}
//checa se há um vencedor 
function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let vencedor = null;
    for (let [index, win] of jogadas.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            vencedor = { index: index, player: player };
            break;
        }
    }
    return vencedor;
}
//Usa a função de quem ganhou para declarar o vencendor
function gameOver(vencedor) {
    for (let index of jogadas[vencedor.index]) {
        document.getElementById(index).style.backgroundColor =
            vencedor.player == humano ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(vencedor.player == humano ? "Você Ganhou!" : "Você Perdeu :c");
}
//Declara quem ganhou
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return quadro.filter(s => typeof s == 'number');
}
//Melhor jogada
function bestSpot() {
    return minimax(quadro, maquina).index;
}
//Checa se empatou
function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "yellow";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Empate!")
        return true;
    }
    return false;
}

//MINIMAX
function minimax(newBoard, player) {
    var avaliaJogadas = emptySquares();

    if (checkWin(newBoard, humano)) {
        return { score: -10 };
    } else if (checkWin(newBoard, maquina)) {
        return { score: 10 };
    } else if (avaliaJogadas.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < avaliaJogadas.length; i++) {
        var move = {};
        move.index = newBoard[avaliaJogadas[i]];
        newBoard[avaliaJogadas[i]] = player;

        if (player == maquina) {
            var result = minimax(newBoard, humano);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, maquina);
            move.score = result.score;
        }

        newBoard[avaliaJogadas[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === maquina) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}