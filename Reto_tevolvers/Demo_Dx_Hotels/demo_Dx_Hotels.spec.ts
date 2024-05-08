import { test, expect, Locator } from '@playwright/test';


test('Demo DX HOTELS', async ({ page }) => {

    // Go to DX HOTELS page
    await page.goto('https://demos.devexpress.com/rwa/dxhotels/');

    // Click en Location
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_LocationComboBox_I').click();
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_LocationComboBox_DDD_L_LBI8T0').click();

    // Abrir calendario check-in
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_CheckInDateEdit_B-1Img').click();

    // Se obtiene la fecha actual
    const fecha = new Date().getDate();
    const check_in = fecha + 2

    await page.locator(`//td[@class="dxeCalendarDay_Metropolis dxeCalendarSelected_Metropolis dxeDayInRange" and contains(text(), "${check_in}")]`).click();

    // Abrir calendario check-out
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_CheckOutDateEdit_B-1Img').click();

    const check_out = fecha + 7

    await page.locator(`(//td[@class="dxeCalendarDay_Metropolis" and contains(text(), "${check_out}")])[2]`).click();

    // Seleccion de numero de habitaciones
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_RoomsComboBox_B-1Img').click();
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_RoomsComboBox_DDD_L_LBI1T0').click();

    // Seleccion cantidad de adultos
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_AdultsSpinEdit_I').clear();
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_AdultsSpinEdit_I').fill('3');

    // Seleccion cantidad de niños
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_ChildrenSpinEdit_I').clear();
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_ChildrenSpinEdit_I').fill('2');

    // Click en filtrar
    await page.locator('#MainContentPlaceHolder_SearchPanel_SearchPanelLayout_SearchButton_CD').click();

    await page.waitForTimeout(3000);

    // Mover el slider de precio a 200
    let rango_min = await page.innerText('#NightyRateTrackBarLabel_L');
    let targetP = 0

    while (+rango_min.substring(1) <= 200) {
        targetP = targetP + 0.1;
        await moveSliderByClicks(page, '#MainContentPlaceHolder_FilterFormLayout_NightlyRateTrackBar_MD', targetP);
        rango_min = await page.innerText('#NightyRateTrackBarLabel_L');
    }

    await page.locator('#MainContentPlaceHolder_FilterFormLayout_OurRatingCheckBoxList_RB0_I_D').click();
    await page.locator('#MainContentPlaceHolder_FilterFormLayout_OurRatingCheckBoxList_RB1_I_D').click();

    await page.locator('#MainContentPlaceHolder_FilterFormLayout_ApplyFilterButton_CD').click();


    let bestPrice;
    let low1 = await obtainBestPrice(page, '//div[@class="price"]')

    let pag = await page.isVisible(`//a[@class="dxp-num"]`);

    if (pag) {
        await page.locator(`//a[@class="dxp-num"]`).click();

        await page.waitForTimeout(3000);

        let low2 = await obtainBestPrice(page, '//div[@class="price"]')

        if (low1[0] < low2[0]) {
            bestPrice = low1;

            await page.waitForTimeout(500);
            await page.locator(`//a[@class="dxp-num"]`).click();
            await page.waitForTimeout(1000);

        } else {
            bestPrice = low2;
        }

    } else {
        bestPrice = low1;
    }

    const valuePos = bestPrice[1] - 1;

    await page.locator(`//div[@id="MainContentPlaceHolder_HotelsDataView_IT${valuePos}_BookItButton_${valuePos}_CD"]`).click();

    await page.waitForTimeout(3000);
    await page.locator('//span[@class="dx-vam" and contains(text(), "Print Invoice")]').click();

    await page.waitForTimeout(3000);
    const message = await page.locator('//table//td[@class="cs72967B7"]//nobr');

    expect(message.isVisible);

});

async function moveSliderByClicks(page, selector, distance) {
    const sliderTrack = await page.locator(selector);
    const trackBox = await sliderTrack.boundingBox();
    const trackWidth = trackBox.width;

    const clickPositionX = trackBox.x + (distance * trackWidth);
    const clickPositionY = trackBox.y + trackBox.height / 2;

    await page.mouse.click(clickPositionX, clickPositionY);
}

async function obtainBestPrice(page, selector) {
    let position = 0;
    let new_val = '$500.00';
    let ref_val = '$200.00';

    const selec = page.locator(`${selector}`);

    const count = await selec.count();

    for (let i = 1; i <= count; i++) {
        let val = await page.innerText(`(${selector})[${i}]`);
        if (+new_val.substring(1) > +val.substring(1) && +val.substring(1) >= +ref_val.substring(1)) {
            new_val = await page.innerText(`(${selector})[${i}]`);
            position = i;
        }
    }

    return [new_val, position];
}