export const isMissingInformationProduct = (product) => {
    const images = product.images;
    const name = product.name;
    const storeId = product.storeId;
    const arrayPrice = product.arrayPrice;
    const categoryObject = product.categoryObject;

    if (!images || !name || !storeId || !arrayPrice || !categoryObject) {
        return true;
    }
    return false;
};
