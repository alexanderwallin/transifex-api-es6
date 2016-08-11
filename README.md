[![view on npm](http://img.shields.io/npm/v/transifex-api-es6.svg)](https://www.npmjs.org/package/transifex-api-es6)
[![Dependency Status](https://david-dm.org/alexanderwallin/transifex-api-es6.svg)](https://david-dm.org/alexanderwallin/transifex-api-es6)

# transifex-api-es6

A promise-based Transifex API client for node, written in es6. Promises are thenable using the [q library](https://github.com/kriskowal/q).

The motivation behind this API is that there are no modern, promise-based JS API for Transifex out there that I could find. If found those that exist being difficult to overview or understand, so I started building on a new one.

* [Installation](#Installation)
* [Usage](#Usage)
* [API Reference](#API_Reference)
* [Contributing](#Contributing)

<a name="Installation"></a>
## Installation

```bash
npm install [--save] [--save-dev] transifex-api-es6
```

<a name="Usage"></a>
## Usage

```javascript
var TransifexApi = require('transifex-api-es6');

var api = new TransifexApi({
  user: 'username',
  password: 'password',
  projectName: 'my-project',
  resourceName: 'customer-area' // optional
});

// Get resource translation
api.getResourceTranslation('en')
.then((contents) => {
  // contents -> PO contents as a string
}, (err) => console.error(err));

// Get translation strings
api.getTranslationStrings('en', 'my_resource')
.then((strings) => {
  // strings -> Set of string objects for 'my_resource'
}, (err) => console.error(err))
```

<a name="API_Reference"></a>
## API Reference


* [TransifexApi](#TransifexApi)
  * [new TransifexApi(opts)](#new_TransifexApi_new)
  * [.setResourceName(resourceName)](#TransifexApi+setResourceName)
  * [.getProject()](#TransifexApi+getProject) ⇒ <code>Object</code>
  * [.getProjectLanguages()](#TransifexApi+getProjectLanguages) ⇒ <code>Object</code>
  * [.getResources()](#TransifexApi+getResources) ⇒ <code>array</code>
  * [.getResource(resourceName)](#TransifexApi+getResource) ⇒ <code>Object</code>
  * [.createResource(resource)](#TransifexApi+createResource) ⇒ <code>Object</code>
  * [.deleteResource(resourceName)](#TransifexApi+deleteResource) ⇒ <code>Object</code>
  * [.getResourceTranslation(langCode, resourceName)](#TransifexApi+getResourceTranslation) ⇒ <code>string</code>
  * [.getTranslationStrings(langCode, resourceName)](#TransifexApi+getTranslationStrings) ⇒ <code>string</code>

<a name="new_TransifexApi_new"></a>
#### new TransifexApi(opts)

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | An object with required `projectName`, `user` and `password`                             fields. Optionally takes a `resourceName` which is stored as                             the default resource. |

<a name="TransifexApi+setResourceName"></a>
#### transifexApi.setResourceName(resourceName)
Sets the default resource slug


| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>string</code> | A resource slug |

<a name="TransifexApi+getProject"></a>
#### transifexApi.getProject() ⇒ <code>Object</code>
Returns information about the project

**Returns**: <code>Object</code> - A project instance (wrapped in a promise)
<a name="TransifexApi+getProjectLanguages"></a>
#### transifexApi.getProjectLanguages() ⇒ <code>Object</code>
Returns an list of languages that belong to the project

**Returns**: <code>Object</code> - A list of languages (wrapped in a promise)
<a name="TransifexApi+getResources"></a>
#### transifexApi.getResources() ⇒ <code>array</code>
Returns a list of resources in the project

**Returns**: <code>array</code> - A list of the project's resources (wrapped in a promise)
<a name="TransifexApi+getResource"></a>
#### transifexApi.getResource(resourceName) ⇒ <code>Object</code>
Returns a resource


| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>string</code> | (Optional) The slug of the requested resource. |

**Returns**: <code>Object</code> - A resource as JSON (wrapped in a promise)
<a name="TransifexApi+createResource"></a>
#### transifexApi.createResource(resource) ⇒ <code>Object</code>
Creates a new resources in the project


| Param | Type | Description |
| --- | --- | --- |
| resource | <code>Object</code> | Dictionary with info about the resource |

**Returns**: <code>Object</code> - A q promise
<a name="TransifexApi+deleteResource"></a>
#### transifexApi.deleteResource(resourceName) ⇒ <code>Object</code>
Deletes a resource


| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>string</code> | (Optional) The slug of the resource |

**Returns**: <code>Object</code> - A q promise
<a name="TransifexApi+getResourceTranslation"></a>
#### transifexApi.getResourceTranslation(langCode, resourceName) ⇒ <code>string</code>
Returns a translation of a given (or default) resource in a given language
in the resource translation file format.


| Param | Type | Description |
| --- | --- | --- |
| langCode | <code>string</code> | A language code, e.g. en_US |
| resourceName | <code>string</code> | (Optional) A resource slug |
| mode | <code>string</code> | (Optional) A file download mode, available values include "reviewed" and "transaltor" |

**Returns**: <code>string</code> - A file as a string in the translation file format (wrapped in a promise)
<a name="TransifexApi+getTranslationStrings"></a>
#### transifexApi.getTranslationStrings(langCode, resourceName) ⇒ <code>string</code>
Returns a set of translated strings of a given (or default) resource in a
given language.


| Param | Type | Description |
| --- | --- | --- |
| langCode | <code>string</code> | A language code, e.g. en_US |
| resourceName | <code>string</code> | (Optional) A resource slug |

**Returns**: <code>string</code> - A list of translation strings as JSON objects
                              (wrapped in a promise)

<a name="Contributing"></a>
## Contributing

This project is in early development. Issues and pull requests are more than welcome!
