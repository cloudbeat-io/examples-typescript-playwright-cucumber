import { Then, When } from '@cucumber/cucumber';
import { expect as pwExpect } from '@playwright/test';
import { wrapExpect } from '@cloudbeat/cucumber';
import { ProductsPage } from '../pages/Products';
import { CbWorld } from '../support/world';

function getProductsPage(world: CbWorld) {
    const expect = wrapExpect(pwExpect, world);
    return new ProductsPage(world.page, expect as typeof pwExpect);
}

Then('Product listing should show {int} products', async function (this: CbWorld, expectedCount: number) {
    const productsPage = getProductsPage(this);
    await productsPage.assertProductsCount(expectedCount);
});

When('Add product at index {int} to cart', async function (this: CbWorld, index: number) {
    const productsPage = getProductsPage(this);
    await productsPage.clickAddToCartButton(index);
});

When('Remove product at index {int} from cart', async function (this: CbWorld, index: number) {
    const productsPage = getProductsPage(this);
    await productsPage.clickRemoveButton(index);
});

Then('Price bar at index {int} should show button {string}', async function (this: CbWorld, index: number, expectedText: string) {
    const productsPage = getProductsPage(this);
    await productsPage.assertPriceBarButtonText(index, expectedText);
});
