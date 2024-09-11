const apiKey = '7215f73dee22495a93d04deb98f3e4d1';
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

async function fetchRandomNews() {
    try {
        const apiurl = `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiurl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    }
});

async function fetchNewsQuery(query) {
    try {
        const apiurl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiurl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        // Create img element and handle missing or broken image URLs
        const img = document.createElement("img");
        img.src = article.urlToImage ? article.urlToImage : 'https://via.placeholder.com/300x200?text=No+Image'; // Better placeholder image
        img.alt = article.title ? article.title : "No title available";

        // Handle broken image URLs by setting a fallback
        img.onerror = function() {
            this.src = 'https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=10&apiKey=${apiKey}'; // Default fallback image URL
        };

        const title = document.createElement("h2");
        const TruncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
        title.textContent = TruncatedTitle;

        const description = document.createElement("p");
        const TruncatedDes = article.description
            ? article.description.length > 120
                ? article.description.slice(0, 120) + "..."
                : article.description
            : "No description available.";

        description.textContent = TruncatedDes;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);

        blogCard.addEventListener('click', () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}

// Fetch and display random news on page load
(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
    }
})();
