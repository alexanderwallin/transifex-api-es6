## transifex-api-es6

A promise-based Transifex API client for node, written in es6.

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
