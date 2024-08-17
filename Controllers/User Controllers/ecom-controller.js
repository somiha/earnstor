const db = require("../../Utils/db_connection");
const { queryAsyncWithoutValue, queryAsync } = require("../../Utils/helper");
exports.flashSell = async (req, res) => {
  const flashSellQuery = `
    SELECT 
        fs.flashsell_id,
        p.product_id,
        p.product_name,
        p.product_price,
        p.product_details_des,
        ec.id AS category_id,
        ec.name AS category_name,
        p.quantity,
        p.unit,
        p.discount,
        p.status,
        p.variant,
        pi.product_image_url AS featured_image,
        variant.variant_id,
        variant.product_id AS variant_product_id,
        variant.variant_name,
        variant.price AS variant_price,
        variant.variant_discount
    FROM 
        ecom_flashsell fs
    INNER JOIN 
        ecom_products p ON fs.product_id = p.product_id
    LEFT JOIN 
        extra_category ec ON p.product_cat_id = ec.id
    LEFT JOIN 
        ecom_product_image pi ON p.product_id = pi.product_id AND pi.featured_image = 1
    LEFT JOIN 
        ecom_variant ON variant.product_id = p.product_id;
  `;

  try {
    const res1 = await queryAsyncWithoutValue(flashSellQuery);
    console.log("res1", res1);

    if (res1) {
      const productInfoMap = new Map();

      res1.forEach((row) => {
        const productId = row.product_id;

        if (productId) {
          // Ensure productId is not null
          if (!productInfoMap.has(productId)) {
            productInfoMap.set(productId, {
              product_id: productId,
              product_name: row.product_name,
              product_price: row.product_price,
              product_details_des: row.product_details_des,
              product_cat_id: row.category_id,
              product_cat_name: row.category_name,
              seller_id: row.seller_id,
              sell_count: row.sell_count,
              quantity: row.quantity,
              unit: row.unit,
              discount: row.discount,
              variant: [],
              productImages: [],
            });
          }

          const product = productInfoMap.get(productId);

          // Add variant details only if it hasn't been added already
          if (row.variant_id) {
            const variantExists = product.variant.some(
              (v) => v.variant_id === row.variant_id
            );
            if (!variantExists) {
              product.variant.push({
                variant_id: row.variant_id,
                product_id: row.variant_product_id,
                variant_name: row.variant_name,
                price: row.variant_price,
                variant_discount: row.variant_discount,
              });
            }
          }

          // Add product images only if it hasn't been added already
          if (row.featured_image) {
            const imageExists = product.productImages.some(
              (img) => img.product_image_url === row.featured_image
            );
            if (!imageExists) {
              product.productImages.push({
                product_image_url: row.featured_image,
              });
            }
          }
        }
      });

      const productInfo = Array.from(productInfoMap.values());

      res.status(200).json({
        status: true,
        message: `Successfully Fetched Flash Sells Product`,
        client: {
          productInfo,
        },
      });
    } else {
      res.status(500).json({
        status: false,
        message: "No products found in flash sell!",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

exports.hot_product = async (req, res) => {
  const flashSellQuery = `SELECT 
    fs.id,
    p.product_id,
    p.product_name,
    p.product_price,
    p.product_details_des,
    ec.id AS category_id,
    ec.name AS category_name,
    p.quantity,
    p.unit,
    p.discount,
    p.status,
    p.variant,
    pi.product_image_url AS featured_image,
    variant.variant_id,
        variant.product_id,
        variant.variant_name,
        variant.price,
        variant.variant_discount
FROM 
    hot_product fs
INNER JOIN 
    ecom_products p ON fs.product_id = p.product_id
LEFT JOIN 
    extra_category ec ON p.product_cat_id = ec.id
LEFT JOIN 
    ecom_product_image pi ON p.product_id = pi.product_id AND pi.featured_image = 1
    LEFT JOIN ecom_variant ON variant.product_id = fs.product_id;`;

  //   const allFlashSell = `SELECT * FROM flashsell`;

  //   const flashSell = await queryAsyncWithoutValue(allFlashSell);

  //   console.log("flashSell", flashSell);

  const res1 = await queryAsyncWithoutValue(flashSellQuery);

  console.log("res1", res1);
  if (res1) {
    const productInfoMap = new Map();

    res1.forEach((row) => {
      const productId = row.product_id;

      if (!productInfoMap.has(productId)) {
        // Initialize product entry in the map
        productInfoMap.set(productId, {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          product_details_des: row.product_details_des,
          product_cat_id: row.category_id,
          product_cat_name: row.category_name,
          seller_id: row.seller_id,
          sell_count: row.sell_count,
          quantity: row.quantity,
          unit: row.unit,
          discount: row.discount,
          variant: [],
          productImages: [],
        });
      }
      const product = productInfoMap.get(productId);
      // Product Variant
      if (row.variant_id) {
        const variantExists = product.variant.some(
          (v) => v.variant_id === row.variant_id
        );
        if (!variantExists) {
          product.variant.push({
            variant_id: row.variant_id,
            product_id: row.product_id,
            variant_name: row.variant_name,
            price: row.price,
            variant_discount: row.variant_discount,
          });
        }
      }

      // Product Images
      if (row.featured_image !== "") {
        productInfoMap.get(productId).productImages.push({
          id: row.id, // Adjust this based on your data model
          product_image_url: row.featured_image,
        });
      }
    });

    const productInfo = Array.from(productInfoMap.values());

    res.status(200).json({
      status: true,
      message: `Successfully Fetched Flash Sells Product`,
      client: {
        productInfo,
      },
    });
  } else {
    console.log(err1);
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      client: { err1 },
    });
  }
};

exports.get_product_details = async (req, res) => {
  const { product_id } = req.query;

  try {
    const productQuery = `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_price,
        p.product_details_des,
        ec.id AS category_id,
        ec.name AS category_name,
        p.quantity,
        p.unit,
        p.discount,
        p.status,
        pi.id AS image_id,
        pi.product_image_url,
        pi.featured_image,
        v.variant_id,
        v.variant_name,
        v.price AS variant_price,
        v.variant_discount
      FROM 
        ecom_products p
      LEFT JOIN 
        extra_category ec ON p.product_cat_id = ec.id
      LEFT JOIN 
        ecom_product_image pi ON p.product_id = pi.product_id
      LEFT JOIN 
        ecom_variant v ON p.product_id = v.product_id
      WHERE 
        p.product_id = ?
    `;

    const productRows = await queryAsync(productQuery, [product_id]);

    if (productRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    const productInfo = {
      product_id: productRows[0].product_id,
      product_name: productRows[0].product_name,
      product_price: productRows[0].product_price,
      product_details_des: productRows[0].product_details_des,
      category_id: productRows[0].category_id,
      category_name: productRows[0].category_name,
      quantity: productRows[0].quantity,
      unit: productRows[0].unit,
      discount: productRows[0].discount,
      status: productRows[0].status,
      variant: [],
      productImages: [],
    };

    productRows.forEach((row) => {
      // Add variant details only if it hasn't been added already
      if (row.variant_id) {
        const variantExists = productInfo.variant.some(
          (v) => v.variant_id === row.variant_id
        );
        if (!variantExists) {
          productInfo.variant.push({
            variant_id: row.variant_id,
            variant_name: row.variant_name,
            variant_price: row.variant_price,
            variant_discount: row.variant_discount,
          });
        }
      }

      // Add product images only if it hasn't been added already
      if (row.product_image_url) {
        const imageExists = productInfo.productImages.some(
          (img) => img.image_id === row.image_id
        );
        if (!imageExists) {
          if (row.featured_image === 1) {
            productInfo.productImages.push({
              image_id: row.image_id,
              product_featured_image: row.product_image_url,
            });
          } else {
            productInfo.productImages.push({
              image_id: row.image_id,
              product_image_url: row.product_image_url,
            });
          }
        }
      }
    });

    res.status(200).json({
      status: true,
      message: "Successfully Fetched Product Details",
      product: productInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

exports.all_product = async (req, res) => {
  try {
    const productQuery = `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_price,
        p.product_details_des,
        ec.id AS category_id,
        ec.name AS category_name,
        p.quantity,
        p.unit,
        p.discount,
        p.status,
        pi.id AS image_id,
        pi.product_image_url,
        pi.featured_image,
        v.variant_id,
        v.variant_name,
        v.price AS variant_price,
        v.variant_discount
      FROM 
        ecom_products p
      LEFT JOIN 
        extra_category ec ON p.product_cat_id = ec.id
      LEFT JOIN 
        ecom_product_image pi ON p.product_id = pi.product_id
      LEFT JOIN 
        ecom_variant v ON p.product_id = v.product_id
    `;

    const productRows = await queryAsyncWithoutValue(productQuery);

    if (productRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No products found",
      });
    }

    const productMap = new Map();

    productRows.forEach((row) => {
      if (!productMap.has(row.product_id)) {
        productMap.set(row.product_id, {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          product_details_des: row.product_details_des,
          category_id: row.category_id,
          category_name: row.category_name,
          seller_id: row.seller_id,
          sell_count: row.sell_count,
          quantity: row.quantity,
          unit: row.unit,
          discount: row.discount,
          status: row.status,
          variant: [],
          productImages: [],
        });
      }

      const product = productMap.get(row.product_id);

      // Product Variant
      if (row.variant_id) {
        const variantExists = product.variant.some(
          (v) => v.variant_id === row.variant_id
        );
        if (!variantExists) {
          product.variant.push({
            variant_id: row.variant_id,
            product_id: row.product_id,
            variant_name: row.variant_name,
            price: row.price,
            variant_discount: row.variant_discount,
          });
        }
      }

      // Add product images
      if (row.product_image_url) {
        if (row.featured_image === 1) {
          product.productImages.push({
            image_id: row.image_id,
            product_featured_image: row.product_image_url,
          });
        } else {
          product.productImages.push({
            image_id: row.image_id,
            product_image_url: row.product_image_url,
          });
        }
      }
    });

    const allProducts = Array.from(productMap.values());

    res.status(200).json({
      status: true,
      message: "Successfully Fetched All Products",
      products: allProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

exports.get_product_details_by_category = async (req, res) => {
  const { extra_cat_id } = req.query;

  try {
    const productQuery = `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_price,
        p.product_details_des,
           ec.id AS category_id,
        ec.name AS category_name,
        p.quantity,
        p.unit,
        p.discount,
        p.status,
        pi.id AS image_id,
        pi.product_image_url,
        pi.featured_image,
        v.variant_id,
        v.variant_name,
        v.price AS variant_price,
        v.variant_discount
      FROM 
        ecom_products p
      LEFT JOIN 
        extra_category ec ON p.product_cat_id = ec.id
      LEFT JOIN 
        ecom_product_image pi ON p.product_id = pi.product_id
      LEFT JOIN 
        ecom_variant v ON p.product_id = v.product_id
      WHERE 
        ec.id = ?
    `;

    const productRows = await queryAsync(productQuery, [extra_cat_id]);

    if (productRows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No products found for this category",
      });
    }

    const productMap = new Map();

    productRows.forEach((row) => {
      if (!productMap.has(row.product_id)) {
        productMap.set(row.product_id, {
          product_id: row.product_id,
          product_name: row.product_name,
          product_price: row.product_price,
          product_details_des: row.product_details_des,
          category_id: row.category_id,
          category_name: row.category_name,
          seller_id: row.seller_id,
          sell_count: row.sell_count,
          quantity: row.quantity,
          unit: row.unit,
          discount: row.discount,
          status: row.status,
          variant: [],
          productImages: [],
        });
      }

      const product = productMap.get(row.product_id);

      // Add variant details if not already added
      if (row.variant_id) {
        const variantExists = product.variant.some(
          (v) => v.variant_id === row.variant_id
        );
        if (!variantExists) {
          product.variant.push({
            variant_id: row.variant_id,
            variant_name: row.variant_name,
            variant_price: row.variant_price,
            variant_discount: row.variant_discount,
          });
        }
      }

      // Add product images if not already added
      if (row.product_image_url) {
        const imageExists = product.productImages.some(
          (img) => img.product_image_url === row.product_image_url
        );
        if (!imageExists) {
          if (row.featured_image === 1) {
            product.productImages.push({
              image_id: row.image_id,
              product_featured_image: row.product_image_url,
            });
          } else {
            product.productImages.push({
              image_id: row.image_id,
              product_image_url: row.product_image_url,
            });
          }
        }
      }
    });

    const products = Array.from(productMap.values());

    res.status(200).json({
      status: true,
      message: "Successfully Fetched Products by Category",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};
