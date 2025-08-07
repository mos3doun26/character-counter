// elemtents locators
const toggleEl = document.getElementById('dark-light-toggle')
const html = document.querySelector('html')
const characterCount = document.getElementById('character-count')
const wordCount = document.getElementById('word-count')
const sentenceCount = document.getElementById('sentence-count')
const userInput = document.getElementById('user-input')
const lettersDesityDiv = document.getElementById('letters-density')

// Event Listeners
document.addEventListener('DOMContentLoaded', renderTheme)

document.addEventListener('click', (e) => {
    if (e.target.id === 'dark-light-toggle' || e.target.id === 'theme-icon') {
        switchTheme()
    } else if (e.target.id === 'more-btn' || e.target.id === 'more-btn-icon') {
        showMoreResults()
    }
})

userInput.addEventListener('input', function () {
    const exculedSpaceOpt = document.getElementById('exclude-spaces')
    setTimeout(() => {
        renderCharacterCount(userInput.value, exculedSpaceOpt.checked)
        renderWordCount(userInput.value)
        renderSentencescount(userInput.value)
    }, 200);
    const characters = getArrOfcharactersObjs(userInput.value)
    showLetterDensity(getLetterDesityHtml(characters))
})

// switch between dark and light theme
function switchTheme() {
    const currentTheme = localStorage.getItem('theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    html.dataset.theme = newTheme
    localStorage.setItem('theme', newTheme)
    updateThemeIcon(newTheme)
}

// update the theme toggle icon
function updateThemeIcon(theme) {
    const icon = theme === 'dark' ? '<i id="theme-icon" class="fa-solid fa-sun"></i>' : '<i id="theme-icon" class="fa-solid fa-moon"></i>'
    document.getElementById('dark-light-toggle').innerHTML = icon
}


// render the theme
function renderTheme() {
    // load the current theme from the local storage if found not show dark one
    if (localStorage.getItem('theme') === null) {
        localStorage.setItem('theme', html.dataset.theme)
    }
    const localTheme = localStorage.getItem('theme')
    html.dataset.theme = localTheme
    // theme toggle icon
    updateThemeIcon(localTheme)
}

// count the total characters
function renderCharacterCount(text, exculedSpace = false) {
    const count = exculedSpace ? text.replaceAll(' ', '').length : text.length
    characterCount.textContent = count
}

// count the words
function renderWordCount(text) {
    const count = text.split(' ').length
    wordCount.textContent = count
}

// count the sentences
function renderSentencescount(text) {
    const count = text.split('.').length
    sentenceCount.textContent = count
}

// get the array of the characters objects
function getArrOfcharactersObjs(text) {
    const result = []
    for (const char of text.toUpperCase()) {
        const index = result.findIndex(obj => obj.character === char)
        index !== -1 ? result[index].count++ : result.push({ character: char, count: 1 })
    }
    return result
}

// get the html of the letters density div
function getLetterDesityHtml(characters) {
    return characters.map((char, index) => {
        // hanel the user issue when the see more button is clicked,
        // should render the letter density without giving it hidden class.
        const hide = index > 4 && document.getElementById('more-btn').textContent === 'See more'
        const charPercentage = (char.count / userInput.value.length) * 100
        return `<div class="letter-holder ${hide ? 'hidden' : ''}">
                    <span class="letter">${char.character}</span>
                    <div class="preview">
                        <span class="preview-result" style='width: ${charPercentage}%'></span>
                    </div>
                    <span class="percentage">${char.count}(${charPercentage.toFixed(2)}%)</span>
                </div>`
    })
}

// render html of the Letters density div
function showLetterDensity(charsHtmlArr) {
    let html = ''
    if (charsHtmlArr.length === 0) {
        document.getElementById('more-btn-holder').classList.add('hidden')
        html = '<p>No characters found, Start typing to see er density.</p>'
    } else {
        html = charsHtmlArr.join('')
        if (charsHtmlArr.length > 5) {
            document.getElementById('more-btn-holder').classList.remove('hidden')
        } else {
            document.getElementById('more-btn-holder').classList.add('hidden')

        }
    }
    lettersDesityDiv.innerHTML = html
}

// handel clicking on See more button and see less
// and presenting of reults
function showMoreResults() {
    // get the element will hidden class only
    const lettersHolder = Array.from(document.querySelectorAll('.letter-holder')).slice(5)
    lettersHolder.forEach(holder => {
        holder.classList.toggle('hidden')
    })

    const moreBtn = document.getElementById('more-btn')
    moreBtn.textContent = moreBtn.textContent === 'See more' ? 'See less' : 'See more'
}