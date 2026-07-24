const metaobjectFields = /* GraphQL */ `
  handle
  type
  fields {
    key
    value
  }
`;

export const getHomeMetaobjectByHandleQuery = /* GraphQL */ `
  query getHomeMetaobjectByHandle($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      ${metaobjectFields}
    }
  }
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
`;
