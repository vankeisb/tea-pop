package com.rvkb.teapop.tests;

import com.pojosontheweb.selenium.AbstractPageObject;
import com.pojosontheweb.selenium.Findr;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import static com.pojosontheweb.selenium.Findrs.*;

public class TeaComboBox extends AbstractPageObject {

    public TeaComboBox(Findr findr) {
        super(findr);
    }

    private Findr findInput() {
        return $(".tp-combobox input");
    }

    private Findr findButton() {
        return $(".tp-combobox button");
    }

    public TeaComboBox clear() {
        findInput().clear();
        return this;
    }

    public TeaComboBox clickTrigger() {
        findButton().click();
        return this;
    }

    private Findr findItem(int index) {
        return $$(".tm-drop-down.tm-placed ")
                .expectOne()
                .$$(".tp-combobox-item")
                .at(index);
    }

    public TeaComboBox clickItem(int index) {
        findItem(index).click();
        return this;
    }

    public TeaComboBox assertComboClosed() {
        $$(".tm-drop-down").count(0).eval();
        return this;
    }

    public TeaComboBox assertValue(String expectedValue) {
        findInput()
                .where(attrEquals("value", expectedValue))
                .eval();
        return this;
    }

    public TeaComboBox sendKeys(CharSequence... keys) {
        findInput().sendKeys(keys);
        return this;
    }

    public TeaComboBox assertSelectedItem(int index) {
        findItem(index)
                .where(hasClass("tp-selected"))
                .where(WebElement::isDisplayed)
                .eval();
        return this;
    }

    public TeaComboBox assertComboOpen() {
        $$(".tm-drop-down.tm-placed").count(1).eval();
        return this;
    }

    public TeaComboBox assertItem(int index, String text) {
        findItem(index).where(textContains(text)).eval();
        return this;
    }

    public TeaComboBox assertNoItems() {
        $$(".tm-drop-down.tm-placed .tp-combobox-no-matches").count(1);
        return this;
    }
}
