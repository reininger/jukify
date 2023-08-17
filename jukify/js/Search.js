/**
* Controls the search.
*/
export default class Search {
  constructor (client) {
    this._client = client
  }

  async search (query, type) {
    const url = `search?q=${encodeURIComponent(query)}&type=${type}`
    const response = await this._client.fetch(url)
    if (!response.ok) {
      return {}
    }
    return await response.json()
  }
}
