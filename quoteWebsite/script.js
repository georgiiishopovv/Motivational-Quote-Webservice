document.addEventListener('DOMContentLoaded', function () {
    var quoteElement;
    var authorElement;
    function getQuote() {
        var auth = document.querySelector(".authorModal");
        auth.style.display = 'none';
        var quoteBox = document.querySelector('.quote-box');
        quoteElement = document.getElementById('quote');
        authorElement = document.getElementById('author');
        var headerElement = document.getElementById('header');
        var searchElement = document.querySelector('.search-bar');
        quoteBox.classList.remove('moved');
        searchElement.classList.remove('moved');

        quoteBox.classList.remove('loaded');

        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/quotes',
            headers: { 'X-Api-Key': 'QsxVyX7wM50HqEGllquIJg==fZmXr0ng6VsTv6N5' },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                quoteElement.innerHTML = result[0].quote;
                authorElement.innerHTML = result[0].author;
                var authorName = result[0].author;
                authorName = fixName(authorName);
                headerElement.innerHTML = 'Motivational Quote of the Day';
                quoteBox.classList.add('loaded');
                authorFetch(authorName);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }
    function categoryQuote() {
        var auth = document.querySelector(".authorModal");
        auth.style.display = 'none';
        var category = document.getElementById('categoryInput').value;
        console.log(category)
        var quoteBox = document.querySelector('.quote-box');
        quoteElement = document.getElementById('quote');
        authorElement = document.getElementById('author');
        var headerElement = document.getElementById('header');
        var searchElement = document.querySelector('.search-bar');
        quoteBox.classList.remove('moved');
        searchElement.classList.remove('moved');

        quoteBox.classList.remove('loaded');

        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
            headers: { 'X-Api-Key': 'QsxVyX7wM50HqEGllquIJg==fZmXr0ng6VsTv6N5' },
            contentType: 'application/json',
            success: function (result) {
                if (result.length > 0) {
                    quoteElement.innerHTML = result[0].quote;
                    authorElement.innerHTML = result[0].author;
                    var authorName = result[0].author;
                    authorName = fixName(authorName);
                    headerElement.innerHTML = 'Quote about ' + category;
                    console.log(result);
                    authorFetch(authorName);
                } else {
                    quoteElement.innerHTML = 'No quotes found for the category: ' + category;
                    authorElement.innerHTML = 'N/A';
                    headerElement.innerHTML = '';
                    authorFetch(authorName);
                }
                quoteBox.classList.add('loaded');
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }
    function fetchNewQuoteDaily() {
        var now = new Date();
        var startOfNextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        var timeUntilNextDay = startOfNextDay - now;
        getQuote();
        setInterval(getQuote, timeUntilNextDay);
    }

    function authorFetch(authorName) {
        var personName = authorName;
        var condition;
        var occ = "Occupation: ";
        var nac = "Nacionality: ";
        var gen = "Gender: ";
        var age = "Age: ";
        var imageElement = document.getElementById('authorImage');
        var authorElement = document.getElementById('name');
        var authorBirth = document.getElementById('birth')
        var authorDescription = document.getElementById('description')
        imageElement.src = "";
        authorElement.innerHTML = "";
        authorBirth.innerHTML = "";
        authorDescription.innerHTML = "";
        const sparqlQuery = `
            SELECT ?image
            WHERE {
            ?person rdfs:label "${personName}"@en.
            ?person wdt:P18 ?image.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }`;

        const encodedQuery = encodeURIComponent(sparqlQuery);
        const url = `https://query.wikidata.org/sparql?format=json&query=${encodedQuery}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const imageData = data.results.bindings[0];
                if (imageData && imageData.image) {
                    const imageUrl = imageData.image.value;
                    console.log('Image URL:', imageUrl);
                    imageElement.src = imageUrl;
                    condition = true;
                } else {
                    console.log('No image found for', authorName);
                    imageElement.src = "";
                }
                showButton(condition);
            })
            .catch(error => {
                console.error('Error fetching image data:', error);
            });

        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/celebrity?name=' + authorName,
            headers: { 'X-Api-Key': 'QsxVyX7wM50HqEGllquIJg==fZmXr0ng6VsTv6N5' },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
                authorElement.innerHTML = authorName;
                if (result[0].birthday) {
                    if (result[0].death) {
                        authorBirth.innerHTML = result[0].birthday + " - " + result[0].death;
                    }
                    else {
                        authorBirth.innerHTML = result[0].birthday;
                    }
                }
                if (result[0].occupation && result[0].occupation.length > 0) {
                    for (let i = 0; i < result[0].occupation.length; i++) {
                        occ += result[0].occupation[i].replace(/_/g, ' ');
                        if ((i + 1) !== result[0].occupation.length) {
                            occ += ", ";
                        }
                    }
                    occ += '\n';
                }
                if (result[0].nationality) {
                    nac += result[0].nationality;
                }
                if (result[0].gender) {
                    gen += result[0].gender;
                }
                if (result[0].age) {
                    age += result[0].age;
                }
                authorDescription.innerHTML = gen + '<br>' + nac + '<br>' + age + '<br>' + occ;
                if (authorName !== "undefined") {
                    condition = true;
                }
                showButton(condition)
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
                showButton(condition);
            }
        });
        showButton(condition);
    }

    function showButton(condition) {
        var authorButton = document.getElementById('authorButton');
        if (condition) {
            authorButton.style.display = 'block';
        } else {
            authorButton.style.display = 'none';
        }
    }

    function informationShow() {
        document.querySelector('.authorModal').style.display = 'block';
        var box = document.querySelector('.quote-box');
        box.classList.add('moved');
        var search = document.querySelector('.search-bar');
        search.classList.add('moved');
    }

    function closeModal() {
        document.querySelector('.authorModal').style.display = 'none';
        var box = document.querySelector('.quote-box');
        box.classList.remove('moved');
        var search = document.querySelector('.search-bar');
        search.classList.remove('moved');
    }

    function fixName(authorName) {
        if (authorName && authorName.trim() !== '') {
            const nameParts = authorName.split(',');

            if (nameParts.length >= 2) {
                const lastName = nameParts[0].trim();
                const firstAndMiddleNames = nameParts[1].trim().split(' ');

                const firstName = firstAndMiddleNames[0];
                const lastNames = lastName.split(" ");
                lastName = lastNames[0];

                const rearrangedName = `${firstName} ${lastNamePart}`;
                return rearrangedName;
            }
            else {
                return authorName;
            }
        }
    }
    function tweet() {
        window.open("https://twitter.com/intent/tweet?text=" + quoteElement.innerHTML + " (" + authorElement.innerHTML + ")", "Tweet Windown", "width = 600px", "height=400px");
    }

    document.getElementById('getQuoteButton').addEventListener('click', function () {
        getQuote();
    });
    document.getElementById('authorButton').addEventListener('click', function () {
        informationShow();
    });
    document.getElementById('searchButton').addEventListener('click', function () {
        categoryQuote();
    });
    document.getElementById('tweetButton').addEventListener('click', function () {
        tweet();
    });
    document.getElementById('closeModal').addEventListener('click', function () {
        closeModal();
    });

    fetchNewQuoteDaily();
});