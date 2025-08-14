/**
 * Nesse Script tem função relacionadas a mandar comandos para o player, como pausar, avançar, mutar, etc.
 * A funções aqui serão adicionadas como métodos ao objeto PlayerManager com o comando 
 * Object.assign(PlayerManager.prototype, { metodoA, metodoB,})
 * Todas as funções salvas aqui devem começar com "command" para organização.
 */

export function commandSelectPlayerUp() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.playerAtual--
    this.setPlayerAtual(this.playerAtual)
    // this.updatePlayerView()
    if (this.playerAtual > 0) {
    }
}
export function commandSelectPlayerDown() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.playerAtual++
    this.setPlayerAtual(this.playerAtual)
    // this.updatePlayerView()
    if (this.playerAtual < this.players.length - 1) {
    }
}
export function commandVolumeUp() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    if (!this.players[this.playerAtual].config.global.volume) {
        this.players[this.playerAtual].commandSetVolumeTo(`+5`)
    }
}
export function commandVolumeDown() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    if (!this.players[this.playerAtual].config.global.volume) {
        this.players[this.playerAtual].commandSetVolumeTo(`-5`)
    }
}
export function commandForwardShort() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandGoToTime('+3')
}
export function commandForwardMedium() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandGoToTime('+10')
}
export function commandForwardLong() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandGoToTime('+60')
}
export function commandBackwardShort() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandGoToTime('-3')
}
export function commandBackwardMedium() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandGoToTime('-10')
}
export function commandBackwardLong() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandGoToTime('-60')
}
export function commandVolumeLimiterToggle() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandVolumeLimiterToggle()
}
export function commandMutedToggle() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandMutedToggle()
}
export function commandPauseToggle() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandPauseToggle()
}
export function commandLoopToggle() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    this.players[this.playerAtual].commandLoopToggle()
}
export function commandRemoveSound(number) {
    /**
     * Remove um player de audio e atualiza a seleção
     * param number | Number(): Número do player pra remover
     */
    if (number === undefined) { number = this.playerAtual } // Mandou pelo atalho
    
    this.players[number].commandRemove()
    this.players.splice(number, 1)

    for (let i = 0; i < this.players.length; i++) {
        this.players[i].setNewPlayerNumber(i)
    }
    this.setPlayerAtual(number)
}
export function commandPlayAll() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    for (let i = 0; i < this.players.length; i++) {
        this.players[i].commandPlay()
    }
}
export function commandPauseAll() {
    if (this.players.length == 0) { // Não tem players
        return
    }
    for (let i = 0; i < this.players.length; i++) {
        this.players[i].commandPause()
    }
}
