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
  const skipPreviousButton = document.querySelector('#skip-previous')
  const skipNextButton = document.querySelector('#skip-next')
  const currentlyPlaying = document.querySelector('.currently-playing')
  const searchBar = document.querySelector('#searchBar')
  const searchButton = document.querySelector('#searchButton')
  const searchResults = document.querySelector('#searchResults')

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
    <li class="p-0 list-group-item d-flex align-items-end border"
    id="${x.id}"
    >
    <img height="64" width="64" class="me-2" src="${x.image}">
    <h6 class="m-0">${x.name} by ${x.artist} - ${x.album}</h6>
    </li>
    `)
    searchResults.innerHTML = resultListItems.join('')
  }

  setPlayPauseButton()
}
