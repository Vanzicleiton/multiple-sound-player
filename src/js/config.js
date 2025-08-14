class Config {
    /**
     * Esse objeto serve pra editar as configurações de um player criar uma 
     * interface para o usuário editar.
     */
    constructor(player) {
        this.player = player
        this.config = player.config
        this.globalIconText = 'language' // Ícone usado pelo btn de global
        this._keydownHandler = this.onKeyDown.bind(this)
        this.interface = this.criarInterface()
        document.body.addEventListener('keydown', this._keydownHandler)
        document.addEventListener('keydown', this.trapFocus)
    }
    onKeyDown(event) { 
        // event.preventDefault()
        if (event.key === 'Escape' && !event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey){
            this.close()
        }
    }
    criarInterface() {
        const el = {}
        const local = {}
        const global = {}

        // Botão global base
        el.btnGlobalBase = document.createElement('button')
        el.btnGlobalBase.classList.add('material-symbols-outlined')
        el.btnGlobalBase.classList.add('btn-global')
        el.btnGlobalBase.innerHTML = this.globalIconText
        el.btnGlobalBase.addEventListener('click', this.onbtnGlobalClick)
        
        // backgroundDiv
        el.backgroundDiv = document.createElement('div')
        el.backgroundDiv.classList.add('config')
        el.backgroundDiv.id = 'overlay'
        el.backgroundDiv.role = 'dialog'
        el.backgroundDiv.ariaModal = true
        el.backgroundDiv.focus()
        document.body.appendChild(el.backgroundDiv)

        // baseDiv
        el.baseDiv = document.createElement('div')
        el.baseDiv.id = 'div-base'
        el.baseDiv.tabindex = -1
        el.backgroundDiv.appendChild(el.baseDiv)
        
        // ----------------------------------------------------------
        // topDiv
        // ----------------------------------------------------------
        el.topDiv = document.createElement('div')
        el.topDiv.id = 'div-top'
        el.baseDiv.appendChild(el.topDiv)
        el.btnClose = document.createElement('button')
        el.btnClose.innerHTML = 'close'
        el.btnClose.id = 'btn-close'
        el.btnClose.classList.add('btn-global')
        el.btnClose.classList.add('material-symbols-outlined')
        el.btnClose.addEventListener('click', (event) => this.close(event))
        el.topDiv.appendChild(el.btnClose)
        // ----------------------------------------------------------
        
        
        // ----------------------------------------------------------
        // middleDiv
        // ----------------------------------------------------------
        el.middleDiv = document.createElement('div')
        el.middleDiv.id = 'div-middle'
        el.baseDiv.appendChild(el.middleDiv)
        // ----------------------------------------------------------
        
        // fieldset
        local.fieldset = document.createElement('fieldset')
        el.middleDiv.appendChild(local.fieldset)
        
        // legend
        local.legend = document.createElement('legend')
        local.legend.innerHTML = 'Configurações Locais'
        local.fieldset.appendChild(local.legend)
        
        // ----------------------------------------------------------
        // Loop
        // ----------------------------------------------------------
        local.btnGlobalLoop = el.btnGlobalBase.cloneNode(true)
        local.btnGlobalLoop.addEventListener('click', this.onbtnGlobalClick)
        local.btnGlobalLoop.checked = this.config.global.loop
        if (this.config.global.loop) {local.btnGlobalLoop.classList.add('aura')
        } else {local.btnGlobalLoop.classList.remove('aura')}
        local.fieldset.appendChild(local.btnGlobalLoop)
        
        // Label
        local.loopLabel = document.createElement('label')
        local.loopLabel.innerHTML = 'Loop: '
        local.fieldset.appendChild(local.loopLabel)
        
        // Checkbox
        local.loopCheckbox = document.createElement('input')
        local.loopCheckbox.type = 'checkbox'
        local.loopCheckbox.id = 'local-loop'
        local.loopCheckbox.name = 'local-loop'
        local.loopCheckbox.checked = this.config.loop
        local.loopLabel.appendChild(local.loopCheckbox)
        
        local.fieldset.appendChild(document.createElement('br'))
        // ----------------------------------------------------------
        
        // ----------------------------------------------------------
        // Volume
        // ----------------------------------------------------------
        local.btnGlobalVolume = el.btnGlobalBase.cloneNode(true)
        local.btnGlobalVolume.addEventListener('click', (event) => this.onbtnGlobalClick(event))
        local.btnGlobalVolume.checked = this.config.global.volume
        if (this.config.global.volume) {local.btnGlobalVolume.classList.add('aura')
        } else {local.btnGlobalVolume.classList.remove('aura')}
        local.fieldset.appendChild(local.btnGlobalVolume)

        local.volumeLabel = document.createElement('label')
        local.volumeLabel.innerHTML = 'Volume: '
        local.fieldset.appendChild(local.volumeLabel)
        
        local.volumeBar = document.createElement('input')
        local.volumeBar.type = 'range'
        local.volumeBar.min = 0
        local.volumeBar.value = parseInt(this.config.volume)
        local.volumeBar.max = 100
        local.volumeBar.id = 'local-volume'
        local.volumeBar.name = 'local-volume'
        local.volumeBar.addEventListener('input', this.onBarChange)
        local.volumeLabel.appendChild(local.volumeBar)
        
        local.volumeSpan = document.createElement('span')
        local.volumeSpan.innerHTML = parseInt(this.config.volume)
        local.volumeSpan.classList.add('bar-span')
        local.volumeLabel.appendChild(local.volumeSpan)
        
        local.fieldset.appendChild(document.createElement('br'))
        // ----------------------------------------------------------
        
        // ----------------------------------------------------------
        // VolumeMax
        // ----------------------------------------------------------
        local.btnGlobalVolumeMax = el.btnGlobalBase.cloneNode(true)
        local.btnGlobalVolumeMax.addEventListener('click', (event) => this.onbtnGlobalClick(event))
        local.btnGlobalVolumeMax.checked = this.config.global.maxVolume
        if (this.config.global.maxVolume) {local.btnGlobalVolumeMax.classList.add('aura')
        } else {local.btnGlobalVolumeMax.classList.remove('aura')}
        local.fieldset.appendChild(local.btnGlobalVolumeMax)

        local.volumeMaxLabel = document.createElement('label')
        local.volumeMaxLabel.innerHTML = 'Volume Máximo: '
        local.fieldset.appendChild(local.volumeMaxLabel)
        
        local.volumeMaxBar = document.createElement('input')
        local.volumeMaxBar.type = 'range'
        local.volumeMaxBar.min = 0
        local.volumeMaxBar.value = parseInt(this.config.maxVolume)
        local.volumeMaxBar.max = 100
        local.volumeMaxBar.id = 'local-volume'
        local.volumeMaxBar.name = 'local-volume'
        local.volumeMaxBar.addEventListener('input', this.onBarChange)
        local.volumeMaxLabel.appendChild(local.volumeMaxBar)
        
        local.volumeMaxSpan = document.createElement('span')
        local.volumeMaxSpan.innerHTML = parseInt(this.config.maxVolume)
        local.volumeMaxLabel.appendChild(local.volumeMaxSpan)
        
        local.fieldset.appendChild(document.createElement('br'))
        // ----------------------------------------------------------

        // ----------------------------------------------------------
        // Limite Volume
        // ----------------------------------------------------------
        local.btnGlobalVolumeLimiter = el.btnGlobalBase.cloneNode(true)
        local.btnGlobalVolumeLimiter.addEventListener('click', this.onbtnGlobalClick)
        local.btnGlobalVolumeLimiter.checked = this.config.global.volumeLimiter
        if (this.config.global.volumeLimiter) {local.btnGlobalVolumeLimiter.classList.add('aura')
        } else {local.btnGlobalVolumeLimiter.classList.remove('aura')}
        local.fieldset.appendChild(local.btnGlobalVolumeLimiter)
        
        // Label
        local.volumeLimiterLabel = document.createElement('label')
        local.volumeLimiterLabel.innerHTML = 'Limitar volume: '
        local.fieldset.appendChild(local.volumeLimiterLabel)
        
        // Checkbox
        local.volumeLimiterCheckbox = document.createElement('input')
        local.volumeLimiterCheckbox.type = 'checkbox'
        local.volumeLimiterCheckbox.id = 'local-loop'
        local.volumeLimiterCheckbox.name = 'local-loop'
        local.volumeLimiterCheckbox.checked = this.config.volumeLimiter
        local.volumeLimiterLabel.appendChild(local.volumeLimiterCheckbox)
        
        local.fieldset.appendChild(document.createElement('br'))
        // ----------------------------------------------------------
        

        // bottomDiv
        el.bottomDiv = document.createElement('div')
        el.bottomDiv.id = 'div-bottom'
        el.baseDiv.appendChild(el.bottomDiv)

        // ----------------------------------------------------------
        // Botão de salvar
        // ----------------------------------------------------------
        local.btnSalvar = document.createElement('button')
        local.btnSalvar.innerHTML = 'Salvar'
        local.btnSalvar.id = 'btn-salvar'
        local.btnSalvar.addEventListener('click', (event) => this.onSalvar(event))
        el.bottomDiv.appendChild(local.btnSalvar)

        // ----------------------------------------------------------
        el.local = local
        el.global = global
        return el
    }
    onBarChange(event) {
        const bar = this
        const span = bar.parentElement.querySelector('span')
        span.innerHTML = parseInt(bar.value)

        // Efeito de preenchimento
        // const percent = (bar.value / bar.max) * 100
        // bar.style.background = `linear-gradient(to right, var(--cor-player-seekbar-fill) 0%, var(--cor-player-seekbar-fill) ${percent}%, var(--cor-player-seekbar-background) ${percent}%, var(--cor-player-seekbar-background) 100%)`

    }
    onbtnGlobalClick(event) {
        const btn = event.srcElement
        btn.checked = !btn.checked

        if (!btn.checked) {
            btn.classList.remove('aura')
        } else {
            btn.classList.add('aura')
        }
    }
    onSalvar() {
        const el = this.interface.local
        const config = {
            'loop': Boolean(el.loopCheckbox.checked),
            'volume': Number(el.volumeBar.value),
            'maxVolume': Number(el.volumeMaxBar.value),
            'volumeLimiter': Boolean(el.volumeLimiterCheckbox.checked),
            'interfaceCode': this.config.interfaceCode,
            'global': { // Se é pra seguir a configuração global
                'loop': Boolean(el.btnGlobalLoop.checked),
                'volume': Boolean(el.btnGlobalVolume.checked),
                'maxVolume': Boolean(el.btnGlobalVolumeMax.checked),
                'volumeLimiter': Boolean(el.btnGlobalVolumeLimiter.checked),
            }
        }

        // Salva os novos dados e fecha
        this.player.config = config

        if (this.player.config.global.volume) { // Passa o global
            this.player.commandSetVolumeTo(this.player.playerManager.config.volume)
        } else {
            this.player.commandSetVolumeTo(config.volume)
        }
        this.player.updateVolumeBar()
        this.player.updatebtnLoop()
        this.player.updatebtnVolumeLimiter()

        this.close()
    }
    trapFocus(e) {
        if (e.key !== 'Tab') return;

        const focusableElements = document
            .getElementById('div-base')
            .querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        const focusArray = Array.prototype.slice.call(focusableElements);
        const first = focusArray[0];
        const last = focusArray[focusArray.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
    close(event) {        
        document.body.removeEventListener('keydown', this._keydownHandler)
        this.interface.backgroundDiv.remove()
        
        // Limpa os dados da memória
        this.player.configObjeto = null
        for (const chave in this) {
            this[chave] = null;
        }
    }
}

export default Config
