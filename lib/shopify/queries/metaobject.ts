import imageFragment from "../fragments/image";

const metaobjectFields = /* GraphQL */ `
  handle
  type
  fields {
    key
    value
    reference {
      ... on MediaImage {
        image {
          ...image
        }
      }
    }
  }
`;

export const getHomeMetaobjectByHandleQuery = /* GraphQL */ `
  query getHomeMetaobjectByHandle($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      ${metaobjectFields}
    }
  }
  ${imageFragment}
`;

export const getHomeMetaobjectsByTypeQuery = /* GraphQL */ `
  query getHomeMetaobjectsByType($type: String!) {
    metaobjects(type: $type, first: 1) {
      edges {
        node {
          ${metaobjectFields}
        }
      }
    }
  }
  ${imageFragment}
`;

export const getMetaobjectsByTypeQuery = /* GraphQL */ `
  query getMetaobjectsByType($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          ${metaobjectFields}
        }
      }
    }
  }
  ${imageFragment}
`;
