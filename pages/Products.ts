import { Page, expect as pwExpect, Locator } from '@playwright/test';

type ExpectFn = typeof pwExpect;

export class ProductsPage {
    private page: Page;
    private readonly expect: ExpectFn;

    constructor(page: Page, expect: ExpectFn = pwExpect) {
        this.page = page;
        this.expect = expect;
    }

    getAddToCartButtons(): Locator {
        return this.page.locator("button:text('Add to cart')");
    }

    getRemoveButtons(): Locator {
        return this.page.locator("button:text('Remove')");
    }

    getPriceBars(): Locator {
        return this.page.locator('.pricebar');
    }

    async assertProductsCount(expectedCount: number): Promise<void> {
        const count = await this.getAddToCartButtons().count();
        this.expect(count).toBe(expectedCount);
    }

    async assertPriceBarButtonText(priceBarIndex: number, expectedText: string): Promise<void> {
        const button = this.getPriceBars().nth(priceBarIndex).locator('button');
        await this.expect(button).toHaveText(expectedText);
    }

    async clickAddToCartButton(buttonIndex: number): Promise<void> {
        await this.getAddToCartButtons().nth(buttonIndex).click();
    }

    async clickRemoveButton(buttonIndex: number): Promise<void> {
        await this.getRemoveButtons().nth(buttonIndex).click();
    }
}
