//This function is used to show the charging indicator
function showLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (!loadingIndicator) {
        Toastify({
            text: 'Loading...',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'center',
        }).showToast();
    }
}
//When the button is clicked, the search for data according to the word is done.  
//I do a for each and check if everything was delivered successfully, if so I show it in separate and organized divs.
document.getElementById('scrapeButton').addEventListener('click', async () => {
    const keyword = document.getElementById('keywordInput').value;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    showLoadingIndicator();



    try {
       
        const response = await fetch(`/api/scrape?keyword=${keyword}`);
        
        const data = await response.json();

        data.forEach(product => {
            if (product.title && product.rating && product.reviews && product.image) {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product-card');

                const titleStyle = product.title.length > 50 ? 'max-height: 2em; overflow: hidden; text-overflow: ellipsis;' : '';

                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3 style="${titleStyle}">${product.title}</h3>
                    <p>Rating: ${product.rating}</p>
                    <p>Reviews: ${product.reviews}</p>
                `;

                resultsDiv.appendChild(productDiv);

                if (product.title.length > 50) {
                    productDiv.addEventListener('click', () => {
                        productDiv.querySelector('h3').style.maxHeight = 'none';
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        Toastify({
            text: 'An error occurred while scraping.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'center',
            backgroundColor: 'red',
        }).showToast();
    } 
});

