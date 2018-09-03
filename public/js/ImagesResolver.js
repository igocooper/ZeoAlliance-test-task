window.ImagesResolver = (function () {
  class ImagesResolver {
     /**
     * @constructor
     */
    constructor() {
    }

    search(query, searchModuleId) {
      return new Promise( (resolve, reject) => {
        let images;

        switch(searchModuleId) {
          case 'local':
            images = window.localDB
              .filter(image => {
                const isMathingTags = image.tags
                  .split(',')
                  .map(tag => tag.trim())
                  .includes(query)
  
                  return isMathingTags
              })
              .map(image => {
                return {
                  id: image.id,
                  tags: image.tags,
                  url: image.previewURL
                }
            })
            
             resolve({
              query,
              images
            });
            break;
  
          case 'pixabay':
            const pixabayAPI = {
                url: 'https://pixabay.com/api/',
                apiKey: '9985612-508c6cca3df5c5e2b6bd16ca8',
                per_page: '100'
            };
            const url = `${pixabayAPI.url}?key=${pixabayAPI.apiKey}&q=${query}&image_type=all&per_page=${pixabayAPI.per_page}`;
  
            window.axios(url).
              then( res => {
                const { data } = res;
                images = data.hits.map(image => ({
                  id: image.id,
                  tags: image.tags,
                  url: image.previewURL,
                }));
                resolve({
                  query,
                  images
                });
              })
              .catch(err => {
                reject(err)
              })
        }
      });
    }
  }

  return ImagesResolver;
})();