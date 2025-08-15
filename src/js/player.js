import * as commands from './player-commands.js'


class Player {
    constructor(PlayerManager, playerNumber, name, link, maxVolume) {
        /**
         * PlayerManager: Objeto que gerencia os players.
         * playerNumber | Number(): Número do player na lista.
         * name | String(): Nome do som pra exibir no label do player.
         * link | String(): Link do arquivo de som, aceita URL ou caminho de arquivo.
         * maxVolume | Number: Valor do volume máximo permitido, aceita de 0 a 100.
        */
        this.playerManager = PlayerManager
        this.playerNumber = playerNumber
        this.isMouseOverbtnRemoveSound = null
        this.soundName = name // Nome do som pra label
        this.config = this.loadConfig()
        this.configObjeto = null // Objeto com interface de configurações
        
        // Cria tag de audio
        this.audio = document.createElement('audio')
        this.audio.src = link
        this.audio.loop = this.config.loop
        this.audio.volume = this.config.volume / 100
        this.audio.preload = true
        this.audio.muted = false
        this.audio.addEventListener('canplaythrough', (event) => this.onTimeUpdate(event))
        this.audio.addEventListener('timeupdate', (event) => this.onTimeUpdate(event))
        
        // Elementos da interface
        if (this.config.interfaceCode == 0) {
            this.player = this.createInterface0()
        } else if (this.config.interfaceCode == 1) {
            this.player = this.createInterface1()
            this.updateSpanTimer()
            this.updateVolumeBar()
            this.updatebtnVolumeLimiter()
            this.updatebtnLoop()
        }
    }
    loadConfig() { // Retorna um Object com as configurações desse player
        let config = {
            'loop': false,
            'volume': 30,
            'maxVolume': 45,
            'volumeLimiter': true,
            'interfaceCode': 1,
            'global': { // Se é pra seguir a configuração global
                'loop': true,
                'volume': false,
                'maxVolume': false,
                'volumeLimiter': false,
            }
        }
        return config
    }

    createInterface0() { // Retorna um Object com os elementos da interface 1
        const el = {}
        this.audio.controls = true

        // Div com todo o player
        el.baseDiv = document.createElement('div')
        el.baseDiv.addEventListener('click', (event) => this.onBaseDivClick(event))
        el.baseDiv.classList.add('player')

        // Div que serve de borda para o player
        el.borderDiv = document.createElement('div')
        el.borderDiv.classList.add('border-div')

        // Div com o conteudo do player
        el.contentDiv = document.createElement('div')
        el.contentDiv.classList.add('content-div')

        // Cria o label com nome do som
        el.label = document.createElement('label')
        el.label.classList.add('sound-label')
        el.label.appendChild(document.createTextNode(this.soundName))

        // --------------------------------------------------
        // Cria o botão de pause
        // --------------------------------------------------
        el.btnPauseToggle = document.createElement('button')
        el.btnPauseToggle.classList.add('player')
        el.btnPauseToggle.classList.add('btn-pausetoggle')
        el.btnPauseToggle.classList.add('material-symbols-outlined')
        el.btnPauseToggle.innerHTML = 'play_arrow'
        el.btnPauseToggle.addEventListener('click', (event) => this.commandPauseToggle(event))
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Cria o botão de remover
        // --------------------------------------------------
        el.btnRemoveSound = document.createElement('button')
        // this.playerManager.commandRemoveSound(this.playerNumber)
        el.btnRemoveSound.classList.add('player')
        el.btnRemoveSound.classList.add('btn-remove')
        el.btnRemoveSound.classList.add('material-symbols-outlined')
        el.btnRemoveSound.innerHTML = 'close'
        el.btnRemoveSound.addEventListener('click', (event) => this.playerManager.commandRemoveSound(this.playerNumber))
        el.btnRemoveSound.addEventListener('mouseenter', () => {
            this.isMouseOverbtnRemoveSound = true
        })
        el.btnRemoveSound.addEventListener('mouseleave', () => {
            this.isMouseOverbtnRemoveSound = false
        })
        // --------------------------------------------------
        

        // --------------------------------------------------
        // Cria a checkbox de limitar o volume
        // --------------------------------------------------
        // Cria a Label da checkbox
        el.volumeCheckboxLabel = document.createElement('label')

        // Cria a checkbox
        el.volumeCheckbox = document.createElement('input')
        el.volumeCheckboxLabel.appendChild(el.volumeCheckbox)
        el.volumeCheckboxLabel.appendChild(document.createTextNode(` Limitar volume a ${this.maxVolume}%`))
        el.volumeCheckbox.type = 'checkbox'
        el.volumeCheckbox.checked = true
        el.volumeCheckbox.addEventListener('click', (event) => this.onVolumeLimiterClick(event))

        // --------------------------------------------------
        // Aplica o append nos elementos na ordem correta
        // --------------------------------------------------
        el.baseDiv.appendChild(el.borderDiv)
        el.borderDiv.appendChild(el.contentDiv)
        el.contentDiv.appendChild(el.label)
        el.contentDiv.appendChild(document.createElement('br'))
        // el.contentDiv.appendChild(el.btnPauseToggle)
        el.contentDiv.appendChild(this.audio)
        el.contentDiv.appendChild(el.btnRemoveSound)
        el.contentDiv.appendChild(document.createElement('br'))
        el.contentDiv.appendChild(el.volumeCheckboxLabel)

        return el
    }
    createInterface1() { // Retorna um Object com os elementos da interface 1
        const el = {}
        // this.audio.controls = true

        // Div com todo o player
        el.baseDiv = document.createElement('div')
        el.baseDiv.addEventListener('click', (event) => this.onBaseDivClick(event))
        el.baseDiv.classList.add('player')

        // Div com o conteudo do player
        el.contentDiv = document.createElement('div')
        el.contentDiv.classList.add('player-content-div')
        
        // Cria o label com nome do som
        el.label = document.createElement('h2')
        el.label.classList.add('name')
        el.label.appendChild(document.createTextNode(this.soundName))
        
        // Div com os controles do player
        el.controlsDiv = document.createElement('div')
        el.controlsDiv.classList.add('div-controls')
        
        // --------------------------------------------------
        // Cria a seekbar
        // --------------------------------------------------
        el.seekbar = document.createElement('input')
        el.seekbar.classList.add('seekbar')
        el.seekbar.classList.add('material-symbols-outlined')
        el.seekbar.type = 'range'
        el.seekbar.value = 0
        el.seekbar.min = 0
        el.seekbar.max = this.audio.duration
        el.controlsDiv.appendChild(el.seekbar)
        el.seekbar.addEventListener('focus', function() {this.blur()})
        el.seekbar.addEventListener('input', (event) => this.onSeekbarChange(event))
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Cria o botão de pause
        // --------------------------------------------------
        el.btnPauseToggle = document.createElement('button')
        el.btnPauseToggle.classList.add('btn')
        el.btnPauseToggle.classList.add('material-symbols-outlined')
        el.btnPauseToggle.innerHTML = 'play_arrow'
        el.btnPauseToggle.addEventListener('click', (event) => this.commandPauseToggle(event))
        el.btnPauseToggle.addEventListener('focus', function() {this.blur()})
        el.controlsDiv.appendChild(document.createElement('br'))
        el.controlsDiv.appendChild(el.btnPauseToggle)
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Div de volume
        // --------------------------------------------------
        el.volumeDiv = document.createElement('div')
        el.volumeDiv.classList.add('div-volume')        
        el.controlsDiv.appendChild(el.volumeDiv)
        
        // Botão do volume
        el.btnVolume = document.createElement('button')
        el.btnVolume.classList.add('btn')
        el.btnVolume.classList.add('material-symbols-outlined')
        el.btnVolume.innerHTML = 'volume_up'
        el.btnVolume.addEventListener('click', (event) => this.commandMutedToggle())
        el.btnVolume.addEventListener('focus', function() {this.blur()})
        el.volumeDiv.appendChild(el.btnVolume)
        
        // Barra de volume
        el.volumeBar = document.createElement('input')
        el.volumeBar.classList.add('volume-bar')
        el.volumeBar.type = 'range'
        el.volumeBar.value = this.config.volume
        el.volumeBar.min = 0
        el.volumeBar.max = 100
        el.volumeBar.style.background = `linear-gradient(to right, var(--player-cor-seekbar-fill) 0%, var(--player-cor-seekbar-fill) ${this.config.volume}%, var(--player-cor-seekbar-background) ${this.config.volume}%, var(--player-cor-seekbar-background) 100%)`;
        el.volumeBar.addEventListener('focus', function() {this.blur()})
        el.volumeBar.addEventListener('input', (event) => this.onVolumeBarChange(event))
        el.volumeDiv.appendChild(el.volumeBar)

        // --------------------------------------------------
        // Span com o tempo
        // --------------------------------------------------
        el.spanTimer = document.createElement('span')
        el.spanTimer.classList.add('time')
        el.controlsDiv.appendChild(el.spanTimer)
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Cria o btn de limitar o volume
        // --------------------------------------------------
        el.btnVolumeLimiter = document.createElement('button')
        el.btnVolumeLimiter.innerHTML = 'volume_down'
        el.btnVolumeLimiter.classList.add('btn')
        el.btnVolumeLimiter.classList.add('material-symbols-outlined')
        el.btnVolumeLimiter.addEventListener('click', (event) => this.commandVolumeLimiterToggle())
        el.btnVolumeLimiter.addEventListener('focus', function() {this.blur()})
        el.controlsDiv.appendChild(el.btnVolumeLimiter)
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Cria o btn de loop
        // --------------------------------------------------
        el.btnLoop = document.createElement('button')
        el.btnLoop.innerHTML = 'repeat'
        el.btnLoop.classList.add('btn')
        el.btnLoop.classList.add('material-symbols-outlined')
        el.btnLoop.addEventListener('click', (event) => this.commandLoopToggle(event))
        el.btnLoop.addEventListener('focus', function() {this.blur()})
        if (this.config.loop) {el.btnLoop.classList.add('btn-activated')
        } else {el.btnLoop.classList.remove('btn-activated')}
        el.controlsDiv.appendChild(el.btnLoop)
        
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Div com botões de fora dos controles
        // --------------------------------------------------
        el.outButtonsDiv = document.createElement('div')
        el.outButtonsDiv.classList.add('div-out-buttons')
        
        // --------------------------------------------------
        // Cria o botão de remover
        // --------------------------------------------------
        el.btnRemoveSound = document.createElement('button')
        // this.playerManager.commandRemoveSound(this.playerNumber)
        // el.btnRemoveSound.classList.add('btn')
        el.btnRemoveSound.classList.add('btn-out')
        el.btnRemoveSound.classList.add('material-symbols-outlined')
        el.btnRemoveSound.innerHTML = 'close'
        el.btnRemoveSound.addEventListener('click', (event) => this.playerManager.commandRemoveSound(this.playerNumber))
        el.btnRemoveSound.addEventListener('focus', function() {this.blur()})
        el.btnRemoveSound.addEventListener('mouseenter', () => {
            this.isMouseOverbtnRemoveSound = true
        })
        el.btnRemoveSound.addEventListener('mouseleave', () => {
            this.isMouseOverbtnRemoveSound = false
        })
        el.outButtonsDiv.appendChild(el.btnRemoveSound)
        
        // el.outButtonsDiv.appendChild(document.createElement('br'))
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Cria o botão de configuração
        // --------------------------------------------------
        el.btnsettings = document.createElement('button')
        // this.playerManager.commandRemoveSound(this.playerNumber)
        el.btnsettings.classList.add('btn-out')
        el.btnsettings.classList.add('material-symbols-outlined')
        el.btnsettings.innerHTML = 'settings'
        el.btnsettings.addEventListener('click', (event) => this.commandSettings())
        el.btnsettings.addEventListener('focus', function() {this.blur()})
        el.outButtonsDiv.appendChild(el.btnsettings)
        // --------------------------------------------------
        
        // --------------------------------------------------
        // Aplica o append nos elementos na ordem correta
        // --------------------------------------------------
        el.baseDiv.appendChild(el.contentDiv)
        el.contentDiv.appendChild(el.label)
        el.contentDiv.appendChild(document.createElement('br'))
        el.contentDiv.appendChild(el.controlsDiv)
        el.contentDiv.appendChild(el.outButtonsDiv)
        // el.contentDiv.appendChild(document.createElement('br'))

        return el
    }
    onRemove(event) { // Remove o objeto da página e da memória
        this.playerManager.commandRemoveSound(this.playerNumber)
    }
    append(element) {
        element.appendChild(this.player.baseDiv)
    }
    onSeekbarChange(event) {
        const seekbar = this.player.seekbar
        this.audio.currentTime = seekbar.value
        
        // Efeito de preenchimento
        const percent = (seekbar.value / seekbar.max) * 100
        seekbar.style.background = `linear-gradient(to right, var(--player-cor-seekbar-fill) 0%, var(--player-cor-seekbar-fill) ${percent}%, var(--player-cor-seekbar-background) ${percent}%, var(--player-cor-seekbar-background) 100%)`
    }
    updatebtnVolumeLimiter() { // Atualiza o botão de VolumeLimiter
        const config = this.config
        const btn = this.player.btnVolumeLimiter
        
        if (!config.volumeLimiter && !config.global.volumeLimiter) { // Desativado
            btn.classList.add('btn-state-deactivated')
            btn.classList.remove('btn-state-activated')
            btn.classList.remove('btn-state-global')        
        } else if (config.global.volumeLimiter) { // Global
            btn.classList.add('btn-state-global')
            btn.classList.remove('btn-state-activated')
            btn.classList.remove('btn-state-deactivated')
        } else if (config.volumeLimiter && !config.global.volumeLimiter) { // Ativado
            btn.classList.add('btn-state-activated')
            btn.classList.remove('btn-state-global')
            btn.classList.remove('btn-state-deactivated')
        }
    }
    updatebtnLoop() { // Atualiza o botão de Loop
        const config = this.config
        const btn = this.player.btnLoop
        
        if (!config.loop && !config.global.loop) { // Desativado
            btn.classList.add('btn-state-deactivated')
            btn.classList.remove('btn-state-activated')
            btn.classList.remove('btn-state-global')        
        } else if (config.global.loop) { // Global
            btn.classList.add('btn-state-global')
            btn.classList.remove('btn-state-activated')
            btn.classList.remove('btn-state-deactivated')
        } else if (config.loop && !config.global.loop) { // Ativado
            btn.classList.add('btn-state-activated')
            btn.classList.remove('btn-state-global')
            btn.classList.remove('btn-state-deactivated')
        }
    }
    aplicarLimiteVolume(valor) {
        /**
         * Retorna o valor com o limite de volume (se ativado) aplicado
         * valor | Number(): Valor do volume pra aplicar o limite
         * return: Number() com o limite aplicado
         */

        const player = this.audio
        let newVolume = valor

        // Referencia pra facilitar o código
        const localConfig = this.config
        const globalConfig = this.playerManager.config

        // Ajusta o novo volume
        if (newVolume >= 100) { // Máximo
            newVolume = 100
        } else if (newVolume <= 0) { // Mínimo
            newVolume = 0.0
        }
        
        // Segui o limite global e o global está limitando
        if (localConfig.global.volumeLimiter && globalConfig.volumeLimiter) { // Seguiu o limite global
            // Segui o máximo global e passou o global
            if (localConfig.global.maxVolume && newVolume >= globalConfig.maxVolume) {
                newVolume = globalConfig.maxVolume / 100
            
            // Segui o máximo local e passou o local
            } else if (!localConfig.global.maxVolume && newVolume >= localConfig.maxVolume){
                newVolume = localConfig.maxVolume / 100
            
            } else { // Pega  o valor atual
                newVolume = newVolume / 100
            }
        
        // Segue o limite local e o local está limitando
        } else if (!localConfig.global.volumeLimiter && localConfig.volumeLimiter){ // Segui o limite local
            // Segui o máximo global e passou o global
            if (localConfig.global.maxVolume && newVolume >= globalConfig.maxVolume) {
                newVolume = globalConfig.maxVolume / 100
            
            // Segui o máximo local e passou o local
            } else if (!localConfig.global.maxVolume && newVolume >= localConfig.maxVolume){
                newVolume = localConfig.maxVolume / 100
            
            } else { // Pega  o valor atual
                newVolume = newVolume / 100
            }
        } else { // Pega o valor passado
            newVolume = newVolume / 100
        }
                
        return newVolume
    }
    onVolumeBarChange(event) {
        const bar = this.player.volumeBar
        this.commandSetVolumeTo(bar.value)
        this.updateVolumeBar()
    }
    updateVolumeBar() { // Atuaçoza a barra de volume
        // Efeito de preenchimento
        const bar = this.player.volumeBar

        // Atualiza a barra
        if (this.config.global.volume) {
            bar.disabled = true
        } else {
            bar.disabled = false
            const percent = (bar.value / bar.max) * 100
            bar.style.background = `linear-gradient(to right, var(--player-cor-seekbar-fill) 0%, var(--player-cor-seekbar-fill) ${percent}%, var(--player-cor-seekbar-background) ${percent}%, var(--player-cor-seekbar-background) 100%)`
        }

    }
    onTimeUpdate(event) {
        const seekbar = this.player.seekbar
        seekbar.max = this.audio.duration
        seekbar.value = this.audio.currentTime

        const percent = (seekbar.value / seekbar.max) * 100
        seekbar.style.background = `linear-gradient(to right, var(--player-cor-seekbar-fill) 0%, var(--player-cor-seekbar-fill) ${percent}%, var(--player-cor-seekbar-background) ${percent}%, var(--player-cor-seekbar-background) 100%)`

        this.updatebtnPlay()
        this.updateSpanTimer()
        this.updateLoop()
    }
    updateLoop() {
        let newValue
        if (this.config.global.loop) { // Segui o global
            newValue = this.playerManager.config.loop
        } else { // Segui o local
            newValue = this.config.loop
        }

        // Atualiza o audio
        if (this.audio.loop != newValue) {
            this.audio.loop = newValue
        }
    }
    updateSpanTimer() { // Atualiza o span com o tempo do audio
        const span = this.player.spanTimer
        let duration = Number(this.audio.duration)
        let time = Number(this.audio.currentTime)

        // Converte duration para horas, minutos e segundos
        let durHoras = Math.floor(duration / 3600)
        let durMinutos = Math.floor((duration % 3600) / 60)
        let durSegundos = Math.floor(duration % 60)
        if (durHoras === Infinity || Number.isNaN(durHoras)) {durHoras = undefined}
        if (durMinutos === Infinity || Number.isNaN(durMinutos)) {durMinutos = '0'}
        if (durSegundos === Infinity || Number.isNaN(durSegundos)) {durSegundos = '0'}
        
        // Converte time para horas, minutos e segundos
        let timeHoras = Math.floor(time / 3600)
        let timeMinutos = Math.floor((time % 3600) / 60)
        let timeSegundos = Math.floor(time % 60)

        let textDuration = []
        let textTime = []

        // Monta o duration
        if (durHoras) { textDuration.push(String(durHoras)) }
        if (durMinutos < 10) {durMinutos = `0${durMinutos}`} // Trata o dado
        if (durSegundos < 10) {durSegundos = `0${durSegundos}`} // Trata o dado
        textDuration.push(String(durMinutos))
        textDuration.push(String(durSegundos))
        
        // Monta o time
        if (timeHoras) { textTime.push(String(timeHoras)) }
        if (timeMinutos < 10) {timeMinutos = `0${timeMinutos}`} // Trata o dado
        if (timeSegundos < 10) {timeSegundos = `0${timeSegundos}`} // Trata o dado
        textTime.push(String(timeMinutos))
        textTime.push(String(timeSegundos))

        // Monta o texto final
        textDuration = textDuration.join(':')
        textTime = textTime.join(':')
        let newText = `${textTime} / ${textDuration}`
        
        // Muda o span
        if (newText != this.player.spanTimer.innerHTML){
            this.player.spanTimer.innerHTML = newText
        }
    }
    updatebtnPlay() { // Atualiza o ícone do botão de play/pause
        // Ajuta o ícone do botão
        const btn = this.player.btnPauseToggle
        if (this.audio.paused && btn.innerHTML != 'play_arrow') {
            btn.innerHTML = 'play_arrow'
        } else if (!this.audio.paused && btn.innerHTML != 'pause') {
            btn.innerHTML = 'pause'
        }        
    }
    onBaseDivClick(event) { // Clicou na div que tem o player
        // O mouse NÃO está em cima do botão de remover
        if (!this.isMouseOverbtnRemoveSound) {
            this.playerManager.setPlayerAtual(this.playerNumber)
        }
    }
    showPlayer() { // Exibe o player
        this.player.contentDiv.classList.remove('hide')
    }
    hidePlayer() { // Oculta o player
        this.player.contentDiv.classList.add('hide')
    }
    setNewPlayerNumber(number) { // Muda o number do player
        this.playerNumber = number
    } 
}

// Adiciona os métodos dos módulos
Object.assign(Player.prototype, {
    commandSetVolumeTo: commands.commandSetVolumeTo,
    commandGoToTime: commands.commandGoToTime,
    commandVolumeLimiterToggle: commands.commandVolumeLimiterToggle,
    commandMutedToggle: commands.commandMutedToggle,
    commandPauseToggle: commands.commandPauseToggle,
    commandLoopToggle: commands.commandLoopToggle,
    commandAllGlobalToggle: commands.commandAllGlobalToggle,
    commandRemove: commands.commandRemove,
    commandSettings: commands.commandSettings,
    commandPlay: commands.commandPlay,
    commandPause: commands.commandPause,
})

export default Player
