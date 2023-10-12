import type { Schema, Attribute } from '@strapi/strapi';

export interface PageChunk extends Schema.Component {
  collectionName: 'components_page_chunks';
  info: {
    displayName: 'Chunk';
  };
  attributes: {
    Title: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'page.chunk': PageChunk;
    }
  }
}
