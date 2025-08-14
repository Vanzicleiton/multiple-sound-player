/**
 * Nesse Script tem função relacionadas a mandar comandos para o player, como pausar, avançar, mutar, etc.
 * A funções aqui serão adicionadas como métodos ao objeto Player com o comando 
 * Object.assign(Player.prototype, { metodoA, metodoB,})
 * Todas as funções salvas aqui devem começar com "command" para organização.
 */
import Config from './config.js'

export function commandSetVolumeTo(value) {
    /**
     * Define volume para o valor passado.
     * value | String(): Valor para ajustar no volume, deve ser uma string com valor inteiro entre 0 e 100.
     * se for passado "+" ou "-" como prefixo ele adiciona ou reduz, exemplo "+5", "-10".
     */
    
    // Pega o valor do volume e o tipo de operação
    let newValue
    let type
    if (value[0] === '+') {
        newValue = Number(value.slice(1))
        type = 'add'
    } else if (value[0] === '-') {
        newValue = Number(value.slice(1))
        type = 'sub'
    } else {
        newValue = Number(value)
        type = 'to'
    }

    const player = this.audio
    let newVolume
    
    // Ajusta o novo volume pelo tipo de operação
    switch (type) {
        case 'add':
            newVolume = (player.volume * 100) + newValue
            break
        case 'sub':
            newVolume = (player.volume * 100) - newValue
            break
        default: // to
            newVolume = newValue
            break
    }
    
    newVolume = this.aplicarLimiteVolume(newVolume)
    this.audio.volume = newVolume

    // Muda o volume local
    if (!this.config.global.volume) {
        this.config.volume = newVolume * 100
        this.player.volumeBar.value = this.config.volume
        this.updateVolumeBar()
    }
    return
}

export function commandGoToTime(value) {
    /**
     * Define o tempo para o valor passado.
     * value | String(): Valor para ajustar no tempo, deve ser uma string com valor inteiro entre 0 e 100.
     * se for passado "+" ou "-" como prefixo ele adiciona ou reduz, exemplo "+5", "-10".
    */
   // Define o valor e o tipo de operação
   let newValue
   let type
   
   if (value[0] === '+') {
       newValue = Number(value.slice(1))
       type = 'add'
    } else if (value[0] === '-') {
        newValue = Number(value.slice(1))
        type = 'sub'
    } else {
        newValue = Number(value);
        type = 'to'
    }
    
    const player = this.audio
    let newTime
    
    // Ajusta o novo tempo
    switch (type) {
        case 'add':
            newTime = (player.currentTime) + newValue
            break
        case 'sub':
            newTime = (player.currentTime) - newValue
            break
        default: // to
            newTime = newValue
            break
        }
    
    // Ajusta o tempo do player
    player.currentTime = newTime
}

export function commandVolumeLimiterToggle(value) { // Ativa/desativa o limitador de volume.
    const config = this.config

    if (!config.volumeLimiter && !config.global.volumeLimiter) { // Desativado > Global
        config.global.volumeLimiter = true
    } else if (config.global.volumeLimiter) { // Global > Ativado
        config.global.volumeLimiter = false
        config.volumeLimiter = true        
    } else if (config.volumeLimiter && !config.global.volumeLimiter) { // Ativado > Desativado
        config.volumeLimiter = false
    }
    this.updatebtnVolumeLimiter()
    this.onVolumeBarChange()
}

export function commandMutedToggle(value) { // Ativa/desativa o mudo
    /**
     * Ativa/desativa o mudo. Se não for passado nada, ele inverte o mudo
     * se for passado true ele ativa e false desativa.
     */
    // Pega o novo valor
    let newValue
    if (value === undefined) {
        newValue = !this.audio.muted
    } else {
        newValue = value
    }
    
    this.audio.muted = newValue

    // Alterna o mudo
    if (newValue) {
        this.player.btnVolume.innerHTML = 'volume_off'
    } else {
        this.player.btnVolume.innerHTML = 'volume_up'
    }
}

export function commandPauseToggle() { // Ativa/desativa o pause
    const audio = this.audio
    const btn = this.player.btnPauseToggle

    // Alterna o pause
    if (audio.paused) {
        audio.play()
        btn.innerHTML = 'pause'
    } else {
        audio.pause()
        btn.innerHTML = 'play_arrow'
    }
    this.updatebtnPlay()
}
export function commandPlay() { // Dá play no audio
    this.audio.play()
    this.player.btnPauseToggle.innerHTML = 'pause'
    this.updatebtnPlay()
}
export function commandPause() { // Dá pause no audio
    this.audio.pause()
    this.player.btnPauseToggle.innerHTML = 'play_arrow'
    this.updatebtnPlay()
}
export function commandLoopToggle() { // Ativa/desativa o loop
    const config = this.config
    const globalConfig = this.playerManager.config

    if (!config.loop && !config.global.loop) { // Desativado > Global
        config.global.loop = true
        this.audio.loop = globalConfig.loop
    } else if (config.global.loop) { // Global > Ativado
        config.global.loop = false
        config.loop = true        
        this.audio.loop = true
    } else if (config.loop && !config.global.loop) { // Ativado > Desativado
        config.loop = false
        this.audio.loop = false
    }
    this.updatebtnLoop()
}

// commandAllGlobalToggle
export function commandRemove() { // Remove o objeto da página e da memória
    this.player.baseDiv.remove()
    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
    this.audio.remove()
    this.audio = null // Remove referência da variável
    this.player = null // Remove referência da variável
}
export function commandSettings() { // Abri a tela de configurações
    this.configObjeto = new Config(this)
}
