const searchInput = document.getElementById('search');
const postsList = document.getElementById('posts-list');
const loadingIndicator = document.getElementById('loading');
const emptyMessage = document.getElementById('empty');
const errorMessage = document.getElementById('error');
const loadMoreButton = document.getElementById('load-more');

let currentPage = 1;
let currentSearch = '';
let limit = 10;

function debounce(fn, delay) {
    let timerId;
    return function() {
        clearTimeout(timerId);
        timerId = setTimeout(fn, delay);
    }
}

async function fetchPosts(page, limit, search) {
    try {
        let url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
        if (search.length > 0) {
            url += `&title=${search}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Ошибка сервера");
        }
        const data = await response.json();
        return data;
    } catch {
        throw new Error('Не удалось загрузить посты');
    }
}

function renderPosts(posts, append) {
    if (append == false) {
        postsList.innerHTML = '';
    }
    posts.forEach(post => {
        postsList.innerHTML += `<div class="post-card">
        <p>${post.title}</p>
        <p>${post.body}</p>
        </div>`;
    });
}

async function main(append) {
    try {
        loadingIndicator.classList.remove('hidden');
        const data = await fetchPosts(currentPage, limit, currentSearch);
        if (data.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            renderPosts(data, append);
        }
        if (data.length < limit) {
            loadMoreButton.disabled = true;
        }
    } catch {
        errorMessage.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}


const debouncedSearch = debounce(() => {
    currentSearch = searchInput.value; 
    currentPage = 1;                
    loadMoreButton.disabled = false;   
    emptyMessage.classList.add('hidden'); 
    errorMessage.classList.add('hidden');
    main(false);
}, 300);


searchInput.addEventListener('input', debouncedSearch);

loadMoreButton.addEventListener('click', () => {
    currentPage++;
    main(true);
});


main(false);
