window.addEventListener('load', function () {
  const technicalUpdateReadVersion = localStorage['technicalUpdateReadVersion']
  const technicalUpdatesBanner = this.document.getElementById('technical-updates-banner')
  const currentBannerVersion = technicalUpdatesBanner.dataset.bannerVersion

  if (technicalUpdateReadVersion !== currentBannerVersion) {
    technicalUpdatesBanner.classList.remove('moj-hidden')
  }
})
