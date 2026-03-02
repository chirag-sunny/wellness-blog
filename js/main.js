// My Wellbeing Hub - Main JavaScript

// Load posts from posts.json
async function loadPosts() {
  try {
    const response = await fetch('posts.json');
    const posts = await response.json();
    renderPosts(posts);
  } catch (e) {
    console.error('Error loading posts:', e);
    document.getElementById('posts-grid').innerHTML = '<p>Articles loading...</p>';
  }
}

// Render post cards
function renderPosts(posts, category = null) {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  const filtered = category ? posts.filter(p => p.category === category) : posts;
  const recent = filtered.slice(0, 9);

  grid.innerHTML = recent.map(post => `
    <article class="post-card" onclick="window.location='article.html?id=${post.id}'">
      <div class="post-card-img">${getCategoryEmoji(post.category)}</div>
      <div class="post-card-body">
        <span class="post-category">${post.category}</span>
        <p class="post-meta">${formatDate(post.date)} &bull; ${post.readTime} min read</p>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <span class="read-more">Read More &rarr;</span>
      </div>
    </article>
  `).join('');
}

// Filter posts by category
function filterPosts(category) {
  fetch('posts.json')
    .then(r => r.json())
    .then(posts => renderPosts(posts, category));
}

// Get emoji for category
function getCategoryEmoji(cat) {
  const emojis = {
    nutrition: '🥗', medications: '💊', fitness: '🏃',
    'mental-health': '🧠', supplements: '🌿', diabetes: '🩺',
    'heart-health': '❤️', 'weight-loss': '⚖️', general: '🌿'
  };
  return emojis[cat] || '🌿';
}

// Format date
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Article page loader
async function loadArticle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  try {
    const res = await fetch('posts.json');
    const posts = await res.json();
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) return;

    document.title = post.title + ' | My Wellbeing Hub';
    const container = document.getElementById('article-content');
    if (container) {
      container.innerHTML = `
        <div class="article-header">
          <span class="post-category">${post.category}</span>
          <h1 class="article-title">${post.title}</h1>
          <p class="article-meta">${formatDate(post.date)} &bull; ${post.readTime} min read</p>
        </div>
        <div class="article-body">${post.content}</div>
      `;
    }
  } catch(e) {
    console.error('Error loading article:', e);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('posts-grid')) {
    loadPosts();
  }
  if (document.getElementById('article-content')) {
    loadArticle();
  }
});
