package com.rvkb.teapop.tests;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Keys;

import static com.pojosontheweb.selenium.Findrs.textEquals;

public class TeaPopComboBoxTest extends TeaPopTestBase {

    @Before
    public void start() {
        super.start();
        findr().$$("a").where(textEquals("Combobox")).expectOne().click();
    }

    private TeaComboBox findCombo()  {
        return new TeaComboBox(findr().setTimeout(5));
    }

    @Test
    public void simple() {
        findCombo()
                .clickTrigger()
                .clickItem(0)
                .assertComboClosed()
                .assertValue("i0 is my item 0");
    }

    @Test
    public void filtering() {
        findCombo()
                .clickTrigger()
                .assertItem(0, "i0 is my item 0")
                .sendKeys("1")
                .assertItem(0, "i1 is my item 1")
                .sendKeys("2")
                .assertItem(0, "i12 is my item 12")
                .sendKeys("3")
                .assertNoItems();
    }

    @Test
    public void keyNav() {
        findCombo()
                .sendKeys(Keys.ARROW_DOWN) // to trigger
                .sendKeys(Keys.ARROW_DOWN) // to select 1st
                .assertSelectedItem(0)
                .sendKeys(Keys.ARROW_DOWN)
                .assertSelectedItem(1)
                .sendKeys(Keys.ARROW_DOWN)
                .assertSelectedItem(2)
                .sendKeys(Keys.ARROW_UP)
                .assertSelectedItem(1)
                .sendKeys(Keys.ARROW_UP)
                .assertSelectedItem(0)
                .sendKeys(Keys.ARROW_UP)
                .assertSelectedItem(99)
                .sendKeys(Keys.ARROW_UP)
                .assertSelectedItem(98)
                .sendKeys(Keys.ARROW_DOWN)
                .assertSelectedItem(99)
                .sendKeys(Keys.ARROW_DOWN)
                .assertSelectedItem(0)
                .sendKeys(Keys.ARROW_DOWN)
                .assertSelectedItem(1)
                .sendKeys(Keys.ENTER)
                .assertValue("i1 is my item 1")
                .assertComboClosed()
                .sendKeys(Keys.ARROW_DOWN)
                .assertComboOpen()
                .sendKeys(Keys.ESCAPE)
                .assertComboClosed();
    }

}
