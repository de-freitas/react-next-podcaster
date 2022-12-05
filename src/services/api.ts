const homeParameters = `episodes?_limit=12&_sort=published_at&_order=desc`

export const api = async ( { params=homeParameters } ) => {

  if (params != homeParameters) {
    const response = await fetch(`http://localhost:3333/${params}`)
    const data = await response.json() 
    return data
  } else {
    const response = await fetch(`http://localhost:3333/${homeParameters}`)
    const data = await response.json()
    return data
  }
}