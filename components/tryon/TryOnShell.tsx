import { TryOnExperienceClient } from "components/tryon/TryOnExperienceClient";
import {
  mapShopifyTryOnProduct,
  sampleBottomwearProducts,
  sampleTopwearProducts,
} from "components/tryon/tryon-products";
import styles from "components/tryon/tryon.module.css";
import { getProductGlbUrlForAvatar } from "lib/tryon/getProductGlbUrl";
import type { TryOnProduct } from "types/tryon";

type Props = {
  products: TryOnProduct[];
};

function hasAnyAvatarModel(product: TryOnProduct) {
  return Boolean(
    getProductGlbUrlForAvatar(product, "female") ||
      getProductGlbUrlForAvatar(product, "male"),
  );
}

export function TryOnShell({ products }: Props) {
  const topwearProducts = products
    .filter(
      (product) => product.category === "top" && hasAnyAvatarModel(product),
    )
    .map(mapShopifyTryOnProduct);
  const bottomwearProducts = products
    .filter(
      (product) => product.category === "bottom" && hasAnyAvatarModel(product),
    )
    .map(mapShopifyTryOnProduct);

  return (
    <>
      <div className={styles.stageBackgroundLayer} aria-hidden="true">
        <img
          className={styles.stageBackgroundImage}
          src="/tryon-stage-bg.png"
          alt=""
          fetchPriority="high"
        />
        <div className={styles.stageAtmosphere} />
      </div>
      <TryOnExperienceClient
        topwearProducts={
          topwearProducts.length > 0 ? topwearProducts : sampleTopwearProducts
        }
        bottomwearProducts={
          bottomwearProducts.length > 0
            ? bottomwearProducts
            : sampleBottomwearProducts
        }
      />
    </>
  );
}
