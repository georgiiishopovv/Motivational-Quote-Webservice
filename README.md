# Motivational-Quote-Webservice
**Short Description:** 
A responsive website that utilizes two APIs and a SPARQL query to present a motivational quote, information about the author and provides the opportunity to directly share the chosen quote to Twitter(X) using an Intent Link.

**Functionality**
- Daily Motivational Quote presented at initial access to the webpage
- Get a new quote
- Search for a quote using a specific keyword
- Author Information Modal - the button pops up only if an image or information about the author is available
- Share on Twitter - when the user presses this button a new window is opened, which leads directly to Twitter - the quote is pasted, formatted and ready to be shared
- Interactive responsiveness and minimalistic transitions
- When the author modal is opened the container of the quote shifts to the left, leaving more space for the modal
- When the author modal is closed the container moves back to its original position
- Simple animation upon each new quote load

**Technical Logistics**
The majority of the website revolves around the implementation of the API requests. The first API is used to generate the quotes and search by category. Once the quote has been generated,
a second API is used to check if there is any information about the author of the quote. Simultaneously, a SPARQL query is used to search for an image of the author. If at least one of the
two (information, image) is found, the author modal button becomes available and the user can learn more about the author.

**APIs**
- Generating the quotes and searching by category: https://api-ninjas.com/api/quotes
- Searching for author information in an API designed on the topic of celebrities: https://api-ninjas.com/api/celebrity
- Searching for an image of the author: SPARQL query utilizing https://query.wikidata.org/

**To Be Done**
- Code Optimizations
- New Pages
- Improve Functionality
- Improve Responsiveness
