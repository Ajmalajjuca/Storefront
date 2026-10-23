import type { SupportedCountryCode } from "lib/currency";

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type HomeContent = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
};

export type ServiceBarItem = {
  title: string;
  description: string;
  sortOrder: number;
};

export type WhyChooseItem = {
  title: string;
  subtitle: string;
  description: string;
  sortOrder: number;
};

export type BrandQuoteContent = {
  quote?: string;
  cite?: string;
};

export type FooterContent = {
  tagline?: string;
  copyright?: string;
  instagramLabel?: string;
  instagramLink?: string;
};

export type ShopPageContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

type VideoSource = {
  url: string;
  mimeType: string;
};

export type ProductMedia =
  | { mediaContentType: "VIDEO"; sources: VideoSource[]; previewImage?: Image }
  | { mediaContentType: "IMAGE"; image: Image }
  | { mediaContentType: string };

export type ShopifyProductMedia =
  | {
      mediaContentType: "VIDEO";
      sources: VideoSource[];
      previewImage: {
        url: string;
        altText: string;
        width: number;
        height: number;
      };
    }
  | { mediaContentType: "IMAGE" }
  | { mediaContentType: string };

export type Menu = {
  title: string;
  path: string;
};

type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, "variants" | "images" | "media"> & {
  variants: ProductVariant[];
  images: Image[];
  media: ProductMedia[];
};

type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  buyerIdentity: {
    countryCode?: SupportedCountryCode | null;
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  image?: Image | null;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  media: Connection<ShopifyProductMedia>;
  seo: SEO;
  tags: string[];
  productType: string;
  updatedAt: string;
};

export type ShopifyMetaobjectField = {
  key: string;
  value: string | null;
};

export type ShopifyMetaobject = {
  handle?: string;
  type?: string;
  fields: ShopifyMetaobjectField[];
};

export type ShopifyHomeMetaobjectByHandleOperation = {
  data: {
    metaobject: ShopifyMetaobject | null;
  };
  variables: {
    handle: {
      handle: string;
      type: string;
    };
  };
};

export type ShopifyHomeMetaobjectsByTypeOperation = {
  data: {
    metaobjects: Connection<ShopifyMetaobject>;
  };
  variables: {
    type: string;
  };
};

export type ShopifyMetaobjectsByTypeOperation = {
  data: {
    metaobjects: Connection<ShopifyMetaobject>;
  };
  variables: {
    type: string;
    first: number;
  };
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
  variables: {
    input?: {
      lines?: {
        merchandiseId: string;
        quantity: number;
      }[];
      buyerIdentity?: {
        countryCode: SupportedCountryCode;
      };
    };
  };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCartBuyerIdentityUpdateOperation = {
  data: {
    cartBuyerIdentityUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    buyerIdentity: {
      countryCode: SupportedCountryCode;
    };
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page | null };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
    country?: SupportedCountryCode;
  };
};

type ProductRecommendationIntent = "RELATED" | "COMPLEMENTARY";

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
    intent?: ProductRecommendationIntent;
    country?: SupportedCountryCode;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
    country?: SupportedCountryCode;
  };
};

export type ShopPolicy = {
  id: string;
  title: string;
  handle: string;
  body: string;
  url: string;
} | null;

export type ShopifyShopPoliciesOperation = {
  data: {
    shop: {
      privacyPolicy: ShopPolicy;
      refundPolicy: ShopPolicy;
      termsOfService: ShopPolicy;
      shippingPolicy: ShopPolicy;
    };
  };
};

type ShopifyCustomerUserError = {
  code:
    | "BLANK"
    | "INVALID"
    | "TAKEN"
    | "TOO_LONG"
    | "TOO_SHORT"
    | "UNIDENTIFIED_CUSTOMER"
    | "CUSTOMER_DISABLED"
    | "PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE"
    | "CONTAINS_HTML_TAGS"
    | string;
  field: string[] | null;
  message: string;
};

export type ShopifyCustomerCreateOperation = {
  data: {
    customerCreate: {
      customer: {
        id: string;
        email: string;
      } | null;
      customerUserErrors: ShopifyCustomerUserError[];
    };
  };
  variables: {
    input: {
      email: string;
      password: string;
      acceptsMarketing: boolean;
    };
  };
};
