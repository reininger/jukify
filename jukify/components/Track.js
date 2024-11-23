export default class Track extends HTMLElement {
    static type = 'spotify-track'

    connectedCallback() {
        this.init()
    }

    init() {
        this.classList.add(
            "p-0", "list-group-item", "d-flex", "align-items-end", "border",
            "rounded-end"
        )

        this.id = this.dataset.id

        const trackImage = document.createElement('img')
        trackImage.height = 64;
        trackImage.width = 64;
        trackImage.classList.add('me-2')
        trackImage.src = this.dataset.image
        this.appendChild(trackImage)

        const heading = document.createElement('h6')
        heading.classList.add("m-0", "flex-grow-1")
        heading.textContent = `${this.dataset.name} by ${this.dataset.artist} - ${this.dataset.album}`
        this.appendChild(heading)

        const removeButton = document.createElement('button')
        removeButton.textContent = '-'
        removeButton.classList.add(
            "btn", "btn-danger", "align-self-stretch", "rounded-0",
            "rounded-end"
        )
        
        removeButton.addEventListener('click', (e) => {
            this.remove()
        })

        this.appendChild(removeButton)
    }
}
