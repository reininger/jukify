export default class Track extends HTMLElement {
    static type = 'spotify-track'

    connectedCallback() {
        this.classList.add(
            "p-0", "list-group-item", "d-flex", "align-items-end", "border",
            "rounded-end"
        )

        this.replaceChildren(
            this.trackImageFactory(),
            this.headingFactory(),
            this.removeButtonFactory()
        )
    }

    headingFactory() {
        const heading = document.createElement('h6')
        heading.classList.add("m-0", "flex-grow-1")
        heading.textContent = `${this.dataset.name} by ${this.dataset.artist} - ${this.dataset.album}`
        return heading
    }

    removeButtonFactory() {
        const removeButton = document.createElement('button')
        removeButton.textContent = '-'
        removeButton.classList.add(
            "btn", "btn-danger", "align-self-stretch", "rounded-0",
            "rounded-end"
        )

        removeButton.addEventListener('click', (e) => {
            this.remove()
        })

        return removeButton
    }

    trackImageFactory() {
        const trackImage = document.createElement('img')
        trackImage.height = 64;
        trackImage.width = 64;
        trackImage.classList.add('me-2')
        trackImage.src = this.dataset.image
        return trackImage
    }
}
