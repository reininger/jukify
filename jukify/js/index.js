/**
 * JS for index page.
 */

import Player from './Player.js'
import LoginManager from './SpotifyImplicitGrantLoginManager.js'
import SpotifyClient from './SpotifyClient.js'
import Search from './Search.js'
window.onload = async () => {
  window.loginManager = new LoginManager()
  window.spotifyClient = new SpotifyClient((...args) => window.fetch(...args), window.loginManager)
  window.player = new Player(window.spotifyClient)
  window.search = new Search(window.spotifyClient)

  const pauseButton = document.getElementById('pause')
  const playButton = document.getElementById('play')
  const nameNode = document.querySelector('header h4')
  const profileImagePlaceHolder = document.querySelector('header svg')
  const skipPreviousButton = document.querySelector('#skip-previous')
  const skipNextButton = document.querySelector('#skip-next')
  const currentlyPlaying = document.querySelector('.currently-playing')
  const searchBar = document.querySelector('#searchBar')
  const searchClearButton = document.querySelector('#searchClearButton')
  const searchButton = document.querySelector('#searchButton')
  const searchResults = document.querySelector('#searchResults')
  const searchContent = document.querySelector('#searchContent')
  const searchTab = document.querySelector('#searchTab')
  const playlistContent = document.querySelector('#playlistContent')
  const playlistTab = document.querySelector('#playlistTab')
  const playlistTracks = document.querySelector('#playlistTracks')
  const logoutButton = document.querySelector('.logout-button')

  let result
  try {
    result = await window.loginManager.login()
  } catch {
    // do nothing
  }

  if (result !== true || !window.loginManager.user) {
    // redirect to login page
    window.location = 'html/login.html'
  }

  nameNode.innerHTML = window.loginManager.user.display_name
  const profileImage = document.createElement('img')
  profileImage.setAttribute('src', window.loginManager.user.images[0].url)
  profileImage.classList.add('rounded-circle', 'm-2')
  profileImagePlaceHolder.replaceWith(profileImage)

  const setPlayPauseButton = async () => {
    const playing = await window.player.isPlaying()
    playButton.style.display = playing ? 'none' : 'inline'
    pauseButton.style.display = playing ? 'inline' : 'none'
  }

  pauseButton.onclick = async () => {
    await window.player.pause()
    setPlayPauseButton()
  }

  playButton.onclick = async () => {
    await window.player.play()
    setPlayPauseButton()
  }

  skipNextButton.onclick = async () => {
    await window.player.next()
  }

  skipPreviousButton.onclick = async () => {
    await window.player.previous()
  }

  window.player.nowPlayingChanged.push(() => {
    let nowPlaying = '-'
    if (window.player.nowPlaying) {
      const {
        item: { name, artists, duration_ms: durationMillis },
        progress_ms: progressMillis
      } = window.player.nowPlaying
      nowPlaying = `${name} - ${artists[0]?.name} - ${Math.round(progressMillis / 1000)} / ${Math.round(durationMillis / 1000)}`
    }
    currentlyPlaying.innerText = nowPlaying
  })

  searchButton.onclick = async () => {
    const query = searchBar.value
    const { tracks: { items } } = await window.search.search(query, 'track')
    const tracks = items.map(x => {
      return {
        name: x.name,
        artist: x.artists[0].name,
        album: x.album.name,
        image: x.album.images.pop()?.url,
        id: x.id
      }
    })
    const resultListItems = tracks.map(x => `
    <li class="p-0 list-group-item d-flex align-items-end border rounded-end"
      data-id="${x.id}" data-image="${x.image}" data-name="${x.name}"
			data-artist="${x.artist}" data-album="${x.album}"
    >
      <img height="64" width="64" class="me-2" src="${x.image}">
      <h6 class="m-0 flex-grow-1">${x.name} by ${x.artist} - ${x.album}</h6>
			<button class="btn btn-success align-self-stretch rounded-0 rounded-end"
				onclick=""
			>+</button>
    </li>
    `)
    searchResults.innerHTML = resultListItems.join('')

    Array.from(searchResults.children).forEach(x => {
      const data = {
        id: x.getAttribute('data-id'),
        image: x.getAttribute('data-image'),
        name: x.getAttribute('data-name'),
        artist: x.getAttribute('data-artist'),
        album: x.getAttribute('data-album')
      }
      x.onclick = () => {
        playlistTracks.innerHTML += `
				<li class="p-0 list-group-item d-flex align-items-end border rounded-end"
					id="${data.id}"
				>
					<img height="64" width="64" class="me-2" src="${data.image}">
					<h6 class="m-0 flex-grow-1">${data.name} by ${data.artist} -
					${data.album}</h6>
					<button class="btn btn-danger align-self-stretch rounded-0 rounded-end">-</button>
				</li>
				`
      }
    })
  }

  searchTab.onclick = () => {
    searchTab.classList.add('active')
    searchContent.classList.add('active')
    searchContent.classList.add('show')
    searchContent.classList.remove('d-none')
    playlistTab.classList.remove('active')
    playlistContent.classList.remove('active')
    playlistContent.classList.remove('show')
    playlistContent.classList.add('d-none')
  }

  playlistTab.onclick = () => {
    playlistTab.classList.add('active')
    playlistContent.classList.add('active')
    playlistContent.classList.add('show')
    playlistContent.classList.remove('d-none')
    searchTab.classList.remove('active')
    searchContent.classList.remove('active')
    searchContent.classList.remove('show')
    searchContent.classList.add('d-none')
  }

  searchBar.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchButton.click()
    }
  })

  const handleSearchBarChange = (e) => {
    if (searchBar.value !== '' && searchBar.value !== null) {
      searchClearButton.classList.remove('d-none')
    } else {
      searchClearButton.classList.add('d-none')
    }
  }

  searchBar.addEventListener('input', handleSearchBarChange)
  searchBar.addEventListener('change', handleSearchBarChange)
  searchBar.addEventListener('keypress', handleSearchBarChange)
  searchBar.addEventListener('paste', handleSearchBarChange)

  searchClearButton.addEventListener('click', (e) => {
    searchBar.value = ''
    searchClearButton.classList.add('d-none')
  })

  logoutButton.addEventListener('click', () => {
    window.loginManager.logout()
    window.location = 'html/login.html'
  })

  setPlayPauseButton()
}
