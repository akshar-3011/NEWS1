const buttons = document.querySelectorAll('.nav-but');
const newsGrid = document.getElementById('news-grid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const logo = document.querySelector('.logo');

let currentCategory = 'general';

document.addEventListener('DOMContentLoaded', () => {

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            fetchNews(currentCategory);
        });
    });

    if (logo) {
        logo.addEventListener('click', () => location.reload());
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterNews);
    }

    fetchNews(currentCategory);
});

async function fetchNews(category) {
    loading.style.display = 'block';
    error.style.display = 'none';
    newsGrid.innerHTML = '';

    try {
        const response = await fetch(`/api/news?category=${category}`);


        if (!response.ok) throw new Error('Network error');

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            throw new Error('No news found');
        }

        displayNews(data.articles);

    } catch (err) {
        console.error(err);
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function displayNews(articles) {
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = article.urlToImage || 'https://via.placeholder.com/400x200';
        img.onerror = () => img.src = 'https://via.placeholder.com/400x200';

        const body = document.createElement('div');
        body.className = 'card-body';
        body.innerHTML = `
            <h3>${article.title || 'No title available'}</h3>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank" class="read-more">Read More</a>
        `;

        const footer = document.createElement('div');
        footer.className = 'card-footer';
        footer.innerHTML = `
            <span class="source">${article.source?.name || 'Unknown'}</span>
            <span>${formatDate(article.publishedAt)}</span>
        `;

        card.append(img, body, footer);
        newsGrid.appendChild(card);
    });
}

function filterNews() {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(query) ? 'flex' : 'none';
    });
}

function formatDate(dateStr) {
    if (!dateStr) return 'Date unavailable';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
