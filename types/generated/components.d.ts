import type { Schema, Attribute } from '@strapi/strapi';

export interface PageGlossaryTerm extends Schema.Component {
  collectionName: 'components_page_glossary_terms';
  info: {
    displayName: 'GlossaryTerm';
  };
  attributes: {
    Term: Attribute.String;
    Definition: Attribute.Text;
  };
}

export interface PageLearningObjectives extends Schema.Component {
  collectionName: 'components_page_learning_objectives';
  info: {
    displayName: 'LearningObjectives';
  };
  attributes: {
    Objectives: Attribute.RichText;
  };
}

export interface PagePlainText extends Schema.Component {
  collectionName: 'components_page_plain_texts';
  info: {
    displayName: 'PlainText';
  };
  attributes: {
    Content: Attribute.RichText;
  };
}

export interface PageQuote extends Schema.Component {
  collectionName: 'components_page_quotes';
  info: {
    displayName: 'Quote';
  };
  attributes: {
    Text: Attribute.RichText;
  };
}

export interface PageTable extends Schema.Component {
  collectionName: 'components_page_tables';
  info: {
    displayName: 'Table';
  };
  attributes: {
    TableContent: Attribute.JSON;
    Caption: Attribute.RichText;
  };
}

export interface PageVideo extends Schema.Component {
  collectionName: 'components_page_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    Text: Attribute.RichText;
    Title: Attribute.String;
    url: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'page.glossary-term': PageGlossaryTerm;
      'page.learning-objectives': PageLearningObjectives;
      'page.plain-text': PagePlainText;
      'page.quote': PageQuote;
      'page.table': PageTable;
      'page.video': PageVideo;
    }
  }
}
