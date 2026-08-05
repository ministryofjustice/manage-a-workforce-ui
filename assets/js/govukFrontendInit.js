if (typeof window.GOVUKFrontend !== 'undefined' && typeof window.GOVUKFrontend.initAll === 'function') {
  window.GOVUKFrontend.initAll()
}

document.querySelectorAll('a[data-back]').forEach(elem => {
  elem.addEventListener('click', () => window.history.back())
})
