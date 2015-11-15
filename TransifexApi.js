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
 */
class TransifexApi {

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
   * Fetches some content from Transifex
   * @param {string} url An API URL relative to the project
   */
  _get(url) {
    var deferred = Q.defer();

    request({
      method: 'GET',
      url: this.baseUrl + url,
      auth: { user: this.user, pass: this.password, sendImmediately: true },
      encoding: 'utf8'
    }, function(err, response, body) {
      if (err)
        deferred.reject(err);
      else
        deferred.resolve(body);
    });

    return deferred.promise;
  }

  /**
   * Returns a GET response from Transifex as JSON
   * @param  {string} url An API URL relative to the project
   * @return {object}     The response parsed as JSON
   */
  _getJson(url) {
    return this._get(url).then(results => JSON.parse(results));
  }

  /**
   * Sets the resource slug
   * @param {string} resourceName The resource slug
   */
  setResourceName(resourceName) {
    this.resourceName = resourceName;
  }

  /**
   * Returns information about the project
   * @return {object} A project instance
   */
  getProject() {
    return this._getJson('');
  }

  /**
   * Returns an list of languages that belong to the project
   */
  getProjectLanguages() {
    return this._getJson('/languages/');
  }

  /**
   * Returns a list of resources in the project
   * @return {array} A list of the project's resources
   */
  getResources() {
    return this._getJson('/resources');
  }

  /**
   * Returns a resource
   * @param  {string} resourceName (Optional) The slug of the requested resource.
   * @return {object}              A resource as JSON
   */
  getResource(resourceName) {
    resourceName = resourceName || this.resourceName;

    return this._getJson(`/resource/${resourceName}`);
  }

  /**
   * Returns a translation of a given (or default) resource in a given language
   * as .po contents.
   */
  getResourceTranslation(langCode, resourceName) {
    resourceName = resourceName || this.resourceName;

    return this._get('/resource/' + resourceName + '/content')
    .then((results) => JSON.parse(results).content);
  }

  /**
   * Returns a set of translated strings of a given (or default) resource in a
   * given language.
   */
  getTranslationStrings(langCode, resourceName) {
    if (!langCode)
      return Q.reject('Invalid langCode: ' + langCode);

    resourceName = resourceName || this.resourceName;

    return this._getJson(`/resource/${resourceName}/translation/${langCode}/strings`);
  }
}

module.exports = TransifexApi;
