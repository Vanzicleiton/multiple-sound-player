import PlayerManager from './player-manager.js'
import Config from './config.js'
// import Player from './player.js'

// Pega o body
const body = document.body

let files = { // Caminhos de arquivos fixo para sempre abrir, nome e link
}

// const config = new Config() // Debug: Teste de interface, apagar depois
const playerManager = new PlayerManager(files)

// --------------------------------------------------------