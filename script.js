document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;
    const savedTheme = localStorage.getItem('app_theme') || 'dark';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('app_theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('app_theme', 'dark');
        }
    }

    const apiKeyInput = document.getElementById('apiKeyInput');
    if (localStorage.getItem('gemini_api_key')) apiKeyInput.value = localStorage.getItem('gemini_api_key');

    document.getElementById('saveKeyBtn').addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) { localStorage.setItem('gemini_api_key', key); alert('API Key Saved!'); }
    });

    const proModal = document.getElementById('proModal');
    const dealsModal = document.getElementById('dealsModal');
    document.getElementById('navProUpgrade').addEventListener('click', () => proModal.classList.add('active'));
    document.getElementById('sidebarCheckDeals').addEventListener('click', () => dealsModal.classList.add('active'));
    document.getElementById('topLearnMore').addEventListener('click', (e) => { e.preventDefault(); dealsModal.classList.add('active'); });

    document.getElementById('closeProModal').addEventListener('click', () => proModal.classList.remove('active'));
    document.getElementById('closeDealsModal').addEventListener('click', () => dealsModal.classList.remove('active'));

    document.getElementById('buyProBtn').addEventListener('click', () => alert('Redirecting to Pro Payment...'));

    const generateBtn = document.getElementById('generateBtn');
    const outputContainer = document.getElementById('outputContainer');
    const outputActions = document.getElementById('outputActions');

    generateBtn.addEventListener('click', async () => {
        const apiKey = localStorage.getItem('gemini_api_key') || apiKeyInput.value.trim();
        const pageTitle = document.getElementById('pageTitle').value.trim();
        const targetKeywords = document.getElementById('targetKeywords').value.trim();
        const pageSummary = document.getElementById('pageSummary').value.trim();

        if (!apiKey || !pageTitle) { alert('API Key and Page Title required.'); return; }

        generateBtn.innerText = 'Generating SEO Package...';
        generateBtn.disabled = true;

        const prompt = `Act as a Senior SEO Engineer. Generate:
1. SEO Title Tag (under 60 chars)
2. Meta Description Tag (under 155 chars)
3. JSON-LD Schema Script (<script type="application/ld+json">)
For:
Title: ${pageTitle}
Keywords: ${targetKeywords}
Summary: ${pageSummary}`;

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await res.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                outputContainer.innerText = data.candidates[0].content.parts[0].text;
                outputActions.style.display = 'flex';
            } else { outputContainer.innerText = 'Error generating SEO data.'; }
        } catch (e) { outputContainer.innerText = 'Network Connection Error.'; }
        finally { generateBtn.innerText = 'Generate SEO Package'; generateBtn.disabled = false; }
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(outputContainer.innerText);
        alert('Copied to clipboard!');
    });
});
