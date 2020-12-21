package com.rvkb.teapop.tests;

import com.pojosontheweb.selenium.AbstractPageObject;
import com.pojosontheweb.selenium.Findr;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.pojosontheweb.selenium.Findrs.*;

public class TeaMenu extends AbstractPageObject {

    public TeaMenu(Findr f) {
        super(f);
    }

    private Predicate<WebElement> hasLabel(String label) {
        return e -> e.findElement(By.className("tm-item__content")).getText().equals(label);
    }

    public TeaMenu assertItems(String item, String... items) {
        List<String> all = Stream.concat(Stream.of(item), Stream.of(items))
                .collect(Collectors.toList());
        for (int i = 0 ; i < all.size() ; i++) {
            findItem(i, all.size())
                    .where(hasLabel(all.get(i)))
                    .eval();
        }
        return this;
    }

    private Findr findItem(String label) {
        return $$(".tm-item").where(hasLabel(label)).expectOne();
    }

    public TeaMenu assertItemHasSubMenu(String label, boolean hasSubMenu) {
        Findr f = findItem(label);
        if (hasSubMenu) {
            f.$$(".tm-item__submenu").expectOne().eval();
        } else {
            f.$$(".tm-item__submenu").count(0).eval();
        }
        return this;
    }

    private final Predicate<WebElement> isActive = hasClass("tm-active");

    public TeaMenu assertItemActive(String label, boolean selected) {
        findItem(label).where(selected ? isActive : not(isActive)).eval();
        return this;
    }

    public TeaMenu mouseOverItem(String label) {
        findItem(label).eval(e -> {
            new Actions(getDriver()).moveToElement(e).perform();
            return true;
        });
        return this;
    }

    public Findr findItem(int index, int itemCount) {
        return $$(".tm-item")
                .count(itemCount)
                .at(index);
    }

    public TeaMenu assertSelectedItem(int index, int itemCount) {
        for (int i = 0; i < itemCount; i++) {
            findItem(i, itemCount)
                    .where(index == i ? isActive : not(isActive))
                    .eval();
        }
        return this;
    }
}
