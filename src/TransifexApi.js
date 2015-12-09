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

    this.baseUrl      = `http://www.transifex.com/api/2/project/${this.projectName}`;
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
   * @param  {string} langCode     A language code, e.g. en_US
   * @param  {string} resourceName (Optional) A resource slug
   * @return {string}              A PO file as a string (wrapped in a promise)
   */
  getResourceTranslation(langCode, resourceName) {
    resourceName = resourceName || this.resourceName;

    return this._get('/resource/' + resourceName + '/content')
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
}

module.exports = TransifexApi;
