import { websiteSettings } from "../config"

export default function(selected) {
  if (!window.defaultMetaData)
    window.defaultMetaData = {
      title: document.title,
      description: document
        .querySelector('meta[name="description"]')
        .getAttribute("content"),
      image: document.location.href + document
        .querySelector('meta[property="og:image"]')
        .getAttribute("content"),
      url: document.location.href,
    }
  console.log(window.defaultMetaData)

  // change social media tags and document title
  if (selected) {
    const featurePhotoUrl = selected.photos[0] ? selected.photos[0].getUrl() : null
    document.title = `${websiteSettings.friendlyName} for ${selected.name}`
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", document.title)
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", selected.formatted_address)
    document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", selected.formatted_address)
    document
      .querySelector('meta[property="og:image"]')
      .setAttribute("content", featurePhotoUrl)
    document
      .querySelector('meta[property="og:url"]')
      .setAttribute("content", window.location.href)
  } else {
    document.title = window.defaultMetaData.title
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", window.defaultMetaData.title)
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", window.defaultMetaData.description)
    document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", window.defaultMetaData.description)
    document
      .querySelector('meta[property="og:image"]')
      .setAttribute("content", window.defaultMetaData.image)
    document
      .querySelector('meta[property="og:url"]')
      .setAttribute("content", window.defaultMetaData.url)
  }
}
