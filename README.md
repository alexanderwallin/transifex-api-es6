## transifex-api-es6

A promise-based Transifex API client for node, written in es6. Promises are thenable using the [q library][q].

[q]: https://github.com/kriskowal/q

The motivation behind this API is that there are no modern, promise-based JS API for Transifex out there that I could find. If found those that exist being difficult to overview or understand, so I started building on a new one.

### Installation

`npm install transifex-api-es6`

### Usage

```javascript
var TransifexApi = require('transifex-api-es6');

var api = new TransifexApi({
  user: 'username',
  password: 'password',
  projectName: 'my-project',
  resourceName: 'customer-area'
});

// Get languages
api.getProjectLanguages()
.then((languages) => {
  // language -> List of language objects
});

// Get resource translation
api.getResourceTranslation('en')
.then((contents) => {
  // contents -> PO contents as a string
})

// Get translation strings
api.getTranslationStrings('en')
.then((strings) => {
  // strings -> Set of string objects
})
```

### Development

This project is in early development. Pull requests are more than welcome!
