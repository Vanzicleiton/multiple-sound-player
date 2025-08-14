import Player from './player.js'
import * as commands from './player-manager-commands.js'

class PlayerManager {
    constructor(files) {
        /**
         * files | object: Objeto com os links dos arquivos.
         */
        this.files = files // Object com os links dos arquivos
        this.config = this.loadConfig() // Object com as configurações
        this.playerMaster = this.criarPlayerMaster()
        this.players = this.criarPlayers(this.files) // Lista com os objetos de player
        this.playerAtual = 0 // Índice do player atual
        this.addDiv = this.criarAddFileDiv() // Cria a div que tem o botão de adicionar arquivos
        this.updatePlayerView()
        this.updatebtnVolumeLimiter()
        
        // ------------------------------------------------
        // Adiciona os eventos ao body
        // ------------------------------------------------
        let body = document.body
        body.addEventListener('keydown', (event) => this.onKeyDown(event))
        
        // ------------------------------------------------
        // Lógica de drop de arquivos na página
        // ------------------------------------------------
        // Evita comportamento padrão e adiciona classe visual
        window.addEventListener('dragover', (e) => {
            e.preventDefault();
            document.body.classList.add('dragover');
        });

        window.addEventListener('dragleave', () => {
            document.body.classList.remove('dragover');
        });
        window.addEventListener('drop', (event) => this.onDropFiles(event))

    }

    criarAddFileDiv() {
        const el = {}

        // Div que fica abaixo da lista de players
        el.baseDiv = document.createElement('div')
        el.baseDiv.classList.add('add')
        el.baseDiv.id = 'div'
        document.body.appendChild(el.baseDiv)

        // input que vai receber os arquivos
        el.input = document.createElement('input')
        el.input.classList.add('add')
        el.input.id = 'file-input'
        el.input.type = 'file'
        el.input.multiple = 'true'
        el.input.ariaHidden = 'true'
        
        el.btn = document.createElement('button')
        el.btn.classList.add('add')
        el.btn.id = 'upload-btn'
        el.btn.type = 'button'
        el.btn.ariaControls = 'file-input'
        el.baseDiv.appendChild(el.btn)
        el.btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Adicionar arquivos
            `
        
        // Eventos
        el.btn.addEventListener('click', () => el.input.click())

        // Processar arquivos selecionados
        el.input.addEventListener('change', () => {
            const tempLinks = {}
    
            for (const file of el.input.files) {
                if (file.type && file.type.startsWith('audio/')) {
                    const audioURL = URL.createObjectURL(file)
                    tempLinks[file.name] = audioURL
                } else {
                    const fileType = file.type || 'Desconhecido';
                    alert(`Arquivo inválido: ${file.name}\nTipo: ${fileType}\nApenas arquivos de áudio são aceitos.`);
                }
            }
            
            // Salva o players
            this.players.push(...this.criarPlayers(tempLinks))
            this.updatePlayerView()
        })

        return el
    }
    criarPlayerMaster() {
        const el = {}

        el.baseDiv = document.createElement('div')
        el.baseDiv.classList.add('master')
        document.body.appendChild(el.baseDiv)

        // Div com o conteúdo
        el.contentDiv = document.createElement('div')
        el.contentDiv.id = 'div-content'
        el.baseDiv.appendChild(el.contentDiv)

        // Título
        el.title = document.createElement('h2')
        el.title.id = 'title'
        el.title.innerHTML = 'Controle Mestre'
        el.contentDiv.appendChild(el.title)

        // Div com os controles
        el.controlsDiv = document.createElement('div')
        el.controlsDiv.id = 'div-control'
        el.contentDiv.appendChild(el.controlsDiv)

        // Botão Play All
        el.btnPlayAll = document.createElement('button')
        el.btnPlayAll.id = 'btn-play-all'
        el.btnPlayAll.innerHTML = 'play_arrow'
        el.btnPlayAll.classList.add('btn')
        el.btnPlayAll.classList.add('material-symbols-outlined')
        el.btnPlayAll.addEventListener('focus', function(){this.blur()})
        el.btnPlayAll.addEventListener('click', (event) => this.commandPlayAll(event))
        el.controlsDiv.appendChild(el.btnPlayAll)
        
        // Botão Pause All
        el.btnPauseAll = document.createElement('button')
        el.btnPauseAll.id = 'btn-pause-all'
        el.btnPauseAll.innerHTML = 'pause'
        el.btnPauseAll.classList.add('btn')
        el.btnPauseAll.classList.add('material-symbols-outlined')
        el.btnPauseAll.addEventListener('focus', function(){this.blur()})
        el.btnPauseAll.addEventListener('click', (event) => this.commandPauseAll(event))
        el.controlsDiv.appendChild(el.btnPauseAll)
        
        // Botão stop All
        el.btnStopAll = document.createElement('button')
        el.btnStopAll.id = 'btn-stop-all'
        el.btnStopAll.innerHTML = 'stop'
        el.btnStopAll.classList.add('btn')
        el.btnStopAll.classList.add('material-symbols-outlined')
        el.btnStopAll.addEventListener('focus', function(){this.blur()})
        el.controlsDiv.appendChild(el.btnStopAll)
        
        // Botão VolumeLimiter
        el.btnVolumeLimiter = document.createElement('button')
        el.btnVolumeLimiter.id = 'btn-volume-limiter'
        el.btnVolumeLimiter.innerHTML = 'volume_down'
        el.btnVolumeLimiter.classList.add('btn')
        el.btnVolumeLimiter.classList.add('material-symbols-outlined')
        el.btnVolumeLimiter.addEventListener('click', (event) => this.onbtnVolumeLimiterClick(event))
        el.btnVolumeLimiter.addEventListener('focus', function(){this.blur()})
        el.controlsDiv.appendChild(el.btnVolumeLimiter)
        
        // Botão loop
        el.btnLoop = document.createElement('button')
        el.btnLoop.id = 'btn-volume-limiter'
        el.btnLoop.innerHTML = 'repeat'
        el.btnLoop.classList.add('btn')
        el.btnLoop.classList.add('material-symbols-outlined')
        el.btnLoop.addEventListener('click', (event) => this.onbtnLoopClick(event))
        el.btnLoop.addEventListener('focus', function(){this.blur()})
        el.controlsDiv.appendChild(el.btnLoop)
        
        el.controlsDiv.appendChild(document.createElement('br'))
        
        // Botão Volume
        el.btnVolume = document.createElement('button')
        el.btnVolume.id = 'btn-volume'
        el.btnVolume.innerHTML = 'volume_up'
        el.btnVolume.classList.add('btn')
        el.btnVolume.classList.add('material-symbols-outlined')
        el.btnVolume.addEventListener('focus', function(){this.blur()})
        el.controlsDiv.appendChild(el.btnVolume)
        
        // Barra de volume
        el.volumeBar = document.createElement('input')
        el.volumeBar.id = 'volume-bar'
        el.volumeBar.type = 'range'
        el.volumeBar.min = 0
        el.volumeBar.value = parseInt(this.config.volume)
        el.volumeBar.max = 100
        el.volumeBar.addEventListener('focus', function(){this.blur()})
        el.volumeBar.addEventListener('input', (event) => this.onBarChange(event))
        el.controlsDiv.appendChild(el.volumeBar)

        // Span do volume
        el.volumeSpan = document.createElement('span')
        el.volumeSpan.innerHTML = el.volumeBar.value
        el.controlsDiv.appendChild(el.volumeSpan)
        
        // el.controlsDiv.appendChild(document.createElement('br'))
        
        // Cria o segundo botão de volumeLimiter, só ilustrativo
        el.btnVolumeLimiter2 = el.btnVolumeLimiter.cloneNode(true)
        el.btnVolumeLimiter2.addEventListener('focus', function(){this.blur()})
        el.controlsDiv.appendChild(el.btnVolumeLimiter2)
        
        // Barra de volume máximo
        el.maxVolumeBar = document.createElement('input')
        el.maxVolumeBar.id = 'max-volume-bar'
        el.maxVolumeBar.type = 'range'
        el.maxVolumeBar.min = 0
        el.maxVolumeBar.value = parseInt(this.config.maxVolume)
        el.maxVolumeBar.max = 100
        el.maxVolumeBar.addEventListener('focus', function(){this.blur()})
        el.maxVolumeBar.addEventListener('input', (event) => this.onBarChange(event))
        el.controlsDiv.appendChild(el.maxVolumeBar)
        
        // Span do volume máximo
        el.maxVolumeSpan = document.createElement('span')
        el.maxVolumeSpan.innerHTML = el.maxVolumeBar.value
        el.controlsDiv.appendChild(el.maxVolumeSpan)

        return el
    }
    rolarSeForaDaTela(elemento) { // ChatGPT
        const rect = elemento.getBoundingClientRect();
        const topoVisivel = rect.top >= 0;
        const baixoVisivel = rect.bottom <= window.innerHeight;
  
        if (!topoVisivel || !baixoVisivel) {
          // Usa scrollIntoView para centralizar o elemento visivelmente
          elemento.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    onDropFiles(event) {
        event.preventDefault()
        document.body.classList.remove('dragover')

        const files = event.dataTransfer.files
        const tempLinks = {}
        const audio = document.createElement('audio')

        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            
            // Verifica se o arquivo é de áudio
            if (file.type && file.type.startsWith('audio/')) {
                const audioURL = URL.createObjectURL(file)
                tempLinks[String(file.name)] = audioURL
            } else {
                const fileType = file.type || 'Desconhecido'
                alert(`Arquivo inválido: ${file.name}\nTipo: ${fileType}\nApenas arquivos de áudio são aceitos.`)
            }
}
        // Salva o players
        this.players.push(...this.criarPlayers(tempLinks))
        this.updatePlayerView()

    }
        
    loadConfig() {
        // Configurações padrão
        let config = {
            'volume': 10,
            'volumeLimiter': true,
            'maxVolume': 60,
            'loop': false,
            'commands' : { // Teclas de comando (hotkeys).
                'ArrowUp': this.commandVolumeUp.bind(this),
                'ArrowDown': this.commandVolumeDown.bind(this),
                'Ctrl+ArrowUp': this.commandSelectPlayerUp.bind(this),
                'Ctrl+ArrowDown': this.commandSelectPlayerDown.bind(this),
                'Shift+ArrowRight': this.commandForwardShort.bind(this),
                'ArrowRight': this.commandForwardMedium.bind(this),
                'Ctrl+ArrowRight': this.commandForwardLong.bind(this),
                'Shift+ArrowLeft': this.commandBackwardShort.bind(this),
                'ArrowLeft': this.commandBackwardMedium.bind(this),
                'Ctrl+ArrowLeft': this.commandBackwardLong.bind(this),
                'L': this.commandVolumeLimiterToggle.bind(this),
                'R': this.commandLoopToggle.bind(this),
                'M': this.commandMutedToggle.bind(this),
                ' ': this.commandPauseToggle.bind(this),
                'Shift+Delete': this.commandRemoveSound.bind(this),
            }
        }
        return config
    }
    onBarChange() { // Mudou o Volume ou MaxVolume
        let volume = parseInt(this.playerMaster.volumeBar.value)
        const maxVolume = parseInt(this.playerMaster.maxVolumeBar.value)
        const spanVolume = this.playerMaster.volumeSpan
        const spanMaxVolume = this.playerMaster.maxVolumeSpan

        // Está limitando e passou do limimte
        if (this.config.volumeLimiter && volume > maxVolume) {
            volume = maxVolume
            this.playerMaster.volumeBar.value = volume
        }
        
        // Salva os valores
        this.config.volume = volume
        this.config.maxVolume = maxVolume

        // Mudou o volume
        if (spanVolume.innerHTML != volume) {
            spanVolume.innerHTML = volume
        }

        // Mudou o volume máximo
        if (spanMaxVolume.innerHTML != maxVolume) {
            spanMaxVolume.innerHTML = maxVolume
        }
        
        // Atualiza o volume dos plauers
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.config.global.volume) {
                player.commandSetVolumeTo(String(volume))
            }
        }
    }
    onbtnVolumeLimiterClick(){
        this.config.volumeLimiter = !this.config.volumeLimiter
        this.updatebtnVolumeLimiter()
    }
    onbtnLoopClick(){
        this.config.loop = !this.config.loop
        this.updatebtnLoop()
    }
    updatebtnVolumeLimiter() {
        const btn = this.playerMaster.btnVolumeLimiter
        if (this.config.volumeLimiter) {
            btn.classList.add('aura')
        } else {
            btn.classList.remove('aura')
        }
    }
    updatebtnLoop() {
        const btn = this.playerMaster.btnLoop
        if (this.config.loop) {
            btn.classList.add('aura')
        } else {
            btn.classList.remove('aura')
        }
    }
    criarPlayers(files) { // Retorna uma lista com os objetos de player
        if (!this.playersDiv) { // Cria a div que vai receber os players
            this.playersDiv = document.createElement('div')
            this.playersDiv.classList.add('players-div')
            document.body.appendChild(this.playersDiv)
        }


        let players = []
        
        // Define o começo da contagem pela quantidaque que já tem
        let i = 0
        if (this.players === undefined) {
            i = 0
        } else {
            i = this.players.length
        }

        // Cria os players
        for (const [name, link] of Object.entries(files)) {           
            let newPlayer = new Player(this, i, name, link, this.config.globalMaxVolume)
            newPlayer.append(this.playersDiv)
            players.push(newPlayer)
            i++
        }

        return players
    }

    updatePlayerView() { // Atualiza a visibilidade dos players
        for (let i = 0; i < this.players.length; i++) {
            if (i == this.playerAtual) {
                this.players[i].showPlayer()
            } else {
                this.players[i].hidePlayer()
            }
        }
        if (this.players.length > 0) { // Executa se tem players
            this.rolarSeForaDaTela(this.players[this.playerAtual].player.baseDiv)
        }
    }
    onKeyDown(event) { 
        // event.preventDefault()
        let hotkey = this.montarEventHotkey(event)

        // Executa a função do comando
        if (this.config.commands[hotkey]) {
            event.preventDefault()
            this.config.commands[hotkey]()
        }
        // console.log('hotkey: ' + hotkey) // Debug
        // console.log('PlayerAtual: ' + this.playerAtual) // Debug
    }
    montarEventHotkey(event) {
        /**
         * Serve pra facilitar a detecção de combinação de teclas.
         * Retorna uma String() com as teclas precionadas.
         * param event: Objeto de evento. O evento deve ser do tipo "keydown".
         */
    
        // Pega as teclas pressionadas e salva como String() na variável hotkey
        let keys = [];
    
        if (event.ctrlKey) keys.push('Ctrl');
        if (event.shiftKey) keys.push('Shift');
        if (event.altKey) keys.push('Alt');
        if (event.metaKey) keys.push('Meta'); // tecla "Command" no Mac
    
        // Pega a tecla principal (ex: "a", "Enter", "ArrowLeft")
        let mainKey = event.key;
    
        // Evita duplicar modificadores como 'Control' sendo também a tecla principal
        if (!['Control', 'Shift', 'Alt', 'Meta'].includes(mainKey)) {
            keys.push(mainKey.charAt(0).toUpperCase() + mainKey.slice(1));
        }
    
        // Gera a string do atalho
        let hotkey = keys.join('+');
    
        return hotkey
    }

    setPlayerAtual(number) { // Define a seleção do player atual
        if (number < 0) {
            this.playerAtual = 0
        } else if (number >= this.players.length - 1) {
            this.playerAtual = this.players.length - 1
        } else {
            this.playerAtual = number
        }
        this.updatePlayerView()
    }
}

// Adiciona os métodos dos módulos
Object.assign(PlayerManager.prototype, {
    commandSelectPlayerUp: commands.commandSelectPlayerUp,
    commandSelectPlayerDown: commands.commandSelectPlayerDown,
    commandVolumeUp: commands.commandVolumeUp,
    commandVolumeDown: commands.commandVolumeDown,
    commandForwardShort: commands.commandForwardShort,
    commandForwardMedium: commands.commandForwardMedium,
    commandForwardLong: commands.commandForwardLong,
    commandBackwardShort: commands.commandBackwardShort,
    commandBackwardMedium: commands.commandBackwardMedium,
    commandBackwardLong: commands.commandBackwardLong,
    commandVolumeLimiterToggle: commands.commandVolumeLimiterToggle,
    commandMutedToggle: commands.commandMutedToggle,
    commandPauseToggle: commands.commandPauseToggle,
    commandLoopToggle: commands.commandLoopToggle,
    commandRemoveSound: commands.commandRemoveSound,
    commandPlayAll: commands.commandPlayAll,
    commandPauseAll: commands.commandPauseAll,
    // commandVolumeLimiterToggle: commands.commandVolumeLimiterToggle,
})

export default PlayerManager
