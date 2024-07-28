export const isMissingInformationProduct = (product) => {
    const images = product.images;
    const name = product.name;
    const storeId = product.storeId;
    const arrayPrice = product.arrayPrice;
    const categoryId = product.categoryId;

    if (!images || !name || !storeId || !arrayPrice || !categoryId) {
        return true;
    }
    return false;
};
