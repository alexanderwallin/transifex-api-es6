'use strict';

var Q         = require('q');
var request   = require('request');


/**
 * Transifex node/js API
 *
 * A promise-based Transifex API client for node, written in es6.
 *
 * @author Alexander Wallin <office@alexanderwallin.com>
 * @url https://github.com/alexanderwallin/node-transifex-api
 * @class
 */
class TransifexApi {

  /**
   * @param  {Object}       opts An object with required `projectName`, `user` and `password`
   *                             fields. Optionally takes a `resourceName` which is stored as
   *                             the default resource.
   * @return {TransifexApi}      A new TransifexApi instance
   */
  constructor(opts) {

    if (!opts.projectName)
      throw new Error('No projectName option provided.');
    if (!opts.user)
      throw new Error('No user option provided.');
    if (!opts.password)
      throw new Error('No password option provided.');

    this.projectName  = opts.projectName;
    this.user         = opts.user;
    this.password     = opts.password;
    this.resourceName = opts.resourceName;

    this.baseUrl      = `https://www.transifex.com/api/2/project/${this.projectName}`;
  }

  /**
   * Sends a request
   * 
   * @param  {string} url     Project relative URL
   * @param  {Object} options Request parameters
   * @return {Object}         A q promise
   * @private
   */
  _send(url, options = {}) {
    const deferred = Q.defer();

    // Build request options
    let requestOptions = {
      method: 'GET',
      url: `${this.baseUrl}${url}`,
      auth: { user: this.user, pass: this.password, sendImmediately: true },
    };
    for (let key in options)
      requestOptions[key] = options[key];

    request(requestOptions, (err, response, body) => {
      if (err)
        deferred.reject(err);
      else
        deferred.resolve(body);
    });

    return deferred.promise;
  }

  /**
   * Fetches some content from Transifex
   * 
   * @param {string}   url An API URL relative to the project
   * @return {Object}      A q promise
   * @private
   */
  _get(url) {
    return this._send(url);
  }

  /**
   * Returns a GET response from Transifex as JSON
   * 
   * @param  {string}  url An API URL relative to the project
   * @return {Object}      The response parsed as JSON
   * @private
   */
  _getJson(url) {
    return this._get(url).then(results => JSON.parse(results));
  }

  /**
   * Sends a PUT request with the given set of options
   * 
   * @param  {String} url  An API URL relative to the project
   * @param  {Object} opts A set of options to pass to request()
   * @return {Object}      The response (wrapped in a promise)
   * @private
   */
  _put(url, opts = {}) {
    let options = {
      method: 'PUT'
    };

    for (let i in opts)
      options[i] = opts[i];

    console.log('sending put request with options:', url, options);

    return this._send(url, options);
  }

  /**
   * Send a POST request with the given data
   * 
   * @param  {string}  url  The request URL
   * @param  {Object}  data Key/value request parameters
   * @return {Object}       A q promise
   * @private
   */
  _post(url, data = {}) {
    return this._send(url, {
      method: 'POST',
      json: true,
      body: data,
    });
  }

  /**
   * Sends a DELETE request
   * 
   * @param  {string}  url The relative request URL
   * @return {Object}      A q promise
   * @private
   */
  _delete(url) {
    return this._send(url, {
      method: 'DELETE',
    });
  }

  /**
   * Sets the default resource slug
   * 
   * @param {string} resourceName A resource slug
   */
  setResourceName(resourceName) {
    this.resourceName = resourceName;
  }

  /**
   * Returns information about the project
   * 
   * @return {Object} A project instance (wrapped in a promise)
   */
  getProject() {
    return this._getJson('');
  }

  /**
   * Returns an list of languages that belong to the project
   * 
   * @return {Object} A list of languages (wrapped in a promise)
   */
  getProjectLanguages() {
    return this._getJson('/languages/');
  }

  /**
   * Returns a list of resources in the project
   * 
   * @return {array} A list of the project's resources (wrapped in a promise)
   */
  getResources() {
    return this._getJson('/resources');
  }

  /**
   * Returns a resource
   * 
   * @param  {string} resourceName (Optional) The slug of the requested resource.
   * @return {Object}              A resource as JSON (wrapped in a promise)
   */
  getResource(resourceName) {
    resourceName = resourceName || this.resourceName;

    return this._getJson(`/resource/${resourceName}`);
  }

  /**
   * Creates a new resources in the project
   * 
   * @param  {Object} resource Dictionary with info about the resource
   * @return {Object}          A q promise
   */
  createResource(resource) {
    return this._post('/resources', resource);
  }

  /**
   * Deletes a resource
   * 
   * @param  {string} resourceName (Optional) The slug of the resource
   * @return {Object}              A q promise
   */
  deleteResource(resourceName) {
    resourceName = resourceName || this.resourceName;

    return this._delete(`/resource/${resourceName}`);
  }

  /**
   * Returns a translation of a given (or default) resource in a given language
   * as .po contents.
   *
   * TODO: Support the file option
   * 
   * @param  {string} langCode     A language code, e.g. en_US
   * @param  {boolean} toFile      Whether to fetch as string contents or file
   * @param  {string} resourceName (Optional) A resource slug
   * @param  {string} mode         (Optional) A file download mode, available values include
   +                               "reviewed" and "transaltor"
   * @return {string}              A PO file as a string (wrapped in a promise)
   */
  getResourceTranslation(langCode, resourceName, mode = 'default') {
    resourceName = resourceName || this.resourceName;

    return this._get(`/resource/${resourceName}/translation/${langCode}/?mode=${mode}`)
    .then((results) => JSON.parse(results).content);
  }

  /**
   * Returns a set of translated strings of a given (or default) resource in a
   * given language.
   * 
   * @param  {string} langCode     A language code, e.g. en_US
   * @param  {string} resourceName (Optional) A resource slug
   * @return {string}              A list of translation strings as JSON objects  
   *                               (wrapped in a promise)
   */
  getTranslationStrings(langCode, resourceName) {
    if (!langCode)
      return Q.reject('Invalid langCode: ' + langCode);

    resourceName = resourceName || this.resourceName;

    return this._getJson(`/resource/${resourceName}/translation/${langCode}/strings`);
  }

  /**
   * Uploads or overrides a resource
   *
   * The `resourceData` object needs the following properties:
   *
   *  - i18n_type
   *  - name
   *  - slug
   *  - content (a string or a stream) 
   *
   * @see http://docs.transifex.com/api/resources/#put_1
   * 
   * @param  {Object} resourceData Resource data
   * @param  {String} resourceName (Optional) A resource slug
   * @return {Object}              A results object (wrapped in a promise)
   */
  updateResource(resourceData, resourceName) {
    resourceName = resourceName || this.resourceName;

    return this._put(`/resource/${resourceName}/content`, {
      formData: resourceData,
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }).then((results) => JSON.parse(results));
  }
}

module.exports = TransifexApi;
