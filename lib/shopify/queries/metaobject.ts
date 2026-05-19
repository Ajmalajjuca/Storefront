import imageFragment from "../fragments/image";

const homeMetaobjectFields = /* GraphQL */ `
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
      ${homeMetaobjectFields}
    }
  }
  ${imageFragment}
`;

export const getHomeMetaobjectsByTypeQuery = /* GraphQL */ `
  query getHomeMetaobjectsByType($type: String!) {
    metaobjects(type: $type, first: 1) {
      edges {
        node {
          ${homeMetaobjectFields}
        }
      }
    }
  }
  ${imageFragment}
`;

export const getServiceBarItemsQuery = /* GraphQL */ `
  query getServiceBarItems($type: String!) {
    metaobjects(type: $type, first: 20) {
      edges {
        node {
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

export const getWhyChooseItemsQuery = /* GraphQL */ `
  query getWhyChooseItems($type: String!) {
    metaobjects(type: $type, first: 20) {
      edges {
        node {
          fields {
            key
            value
          }
        }
      }
    }
  }
`;
