"use strict";
var _ = require("lodash");

/**
 * Determines if chunk content is being updated in a beforeUpdate event
 * @param {*} event
 * @returns boolean
 */
async function shouldUpdate(event) {
  const { model } = event;
  const { data } = event.params;

  const oldData = await strapi
    .query(model.uid)
    .findOne({ where: { id: data.id } });

  const prunedData = _.omit(data, ["__component", "__temp_key__", "updatedAt"]);

  return !_.isEqual(prunedData, oldData);
}

module.exports = {
  shouldUpdate,
};
