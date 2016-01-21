// @see https://api.drupal.org/api/drupal/core!modules!comment!src!Entity!Comment.php/class/Comment/8

/**
 * Given a comment id or JSON object, this Creates a new jDrupal Comment object.
 * @param {Number|Object} cid_or_comment
 * @constructor
 */
jDrupal.Comment = function(cid_or_comment) {

  // Set the entity keys.
  this.entityKeys['type'] = 'comment';
  this.entityKeys['bundle'] = 'comment_type';
  this.entityKeys['id'] = 'cid';
  this.entityKeys['label'] = 'subject';

  // Prep the entity.
  jDrupal.entityConstructorPrep(this, cid_or_comment);

};

/**
 * Extend the entity prototype.
 * @type {jDrupal.Entity}
 */
jDrupal.Comment.prototype = new jDrupal.Entity;

/**
 * Set the constructor.
 * @type {jDrupal.Comment|*}
 */
jDrupal.Comment.prototype.constructor = jDrupal.Comment;

/**
 * Returns the comment's subject.
 * @returns {*}
 */
jDrupal.Comment.prototype.getSubject = function() {
  return this.entity.subject[0].value;
};

/**
 * Set's the comment's subject.
 * @returns {*}
 */
jDrupal.Comment.prototype.setSubject = function(subject) {
  try {
    this.entity.subject[0].value = subject;
  }
  catch (e) { console.log('jDrupal.Comment.setSubject - ' + e); }
};

/**
 * OVERRIDES
 */

jDrupal.Comment.prototype.preSave = function(options) {
  return new Promise(function(resolve, reject) {
    // Remove protected fields.
    //var protected_fields = [
    //  'cid'
    //];
    //for (var i = 0; i < protected_fields.length; i++) {
    //  delete this.entity[protected_fields[i]];
    //}
    resolve();
  });
};

/**
 *
 */
jDrupal.Comment.prototype.stringify = function() {

  try {

    if (!this.isNew()) {
      var entityClone = JSON.parse(JSON.stringify(this.entity));
      // Remove protected fields.

      // @see CommentAccessControlHandler.php

      //$read_only_fields = array(
      //  'hostname',
      //  'changed',
      //  'cid',
      //  'thread',
      //);
      //// These fields can be edited during comment creation.
      //$create_only_fields = [
      //  'comment_type',
      //  'uuid',
      //  'entity_id',
      //  'entity_type',
      //  'field_name',
      //  'pid',
      //];

      var protected_fields = [
        'hostname',
        'changed',
        'cid',
        'thread',
        //'comment_type', // 403, but causes an error, bug in Drupal?
        'uuid',
        'entity_id',
        'entity_type',
        'pid',
        'field_name',
        'created',


        //'langcode',
        //'default_langcode',
        //'uid',


        //'status',
        'name', // @TODO we could probably send these fields if they weren't empty
        'mail',
        'homepage'

      ];
      for (var i = 0; i < protected_fields.length; i++) {
        if (typeof entityClone[protected_fields[i]] !== 'undefined') {
          delete entityClone[protected_fields[i]];
        }
      }
      return JSON.stringify(entityClone);
    }
    return JSON.stringify(this.entity);

  }
  catch (error) {
    console.log('jDrupal.Comment.stringify - ' + error);
  }

};
