package com.rvkb.teapop.tests;

import com.pojosontheweb.selenium.Findr;
import com.pojosontheweb.selenium.ManagedDriverJunit4TestBase;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Function;

public class TeaPopTest extends ManagedDriverJunit4TestBase {

    private static String WEBAPP_DIR = System.getProperty("teapop.webapp.dir");

    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Server server;

    private Findr fDemo() {
        return findr().$(".demo");
    }

    @Before
    public void start() throws Exception {
        server = new Server(8080);

        ResourceHandler resource_handler = new ResourceHandler();
        resource_handler.setDirectoriesListed(true);
        resource_handler.setWelcomeFiles(new String[]{"index.html"});
        resource_handler.setResourceBase(WEBAPP_DIR);

        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[]{resource_handler, new DefaultHandler()});
        server.setHandler(handlers);

        executorService.submit(() -> {
            try {
                server.start();
                server.join();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
        int retries = 30;
        while (retries > 0) {
            System.out.println("Ping jetty #" + retries);
            // wait for page to be up
            try {
                getWebDriver().get("http://localhost:8080");
                System.out.println("Jetty responding");
                break;
            } catch (Exception e) {
                try {
                    Thread.sleep(100);
                } catch (InterruptedException interruptedException) {
                    // try again
                }
            }
            retries--;
        }
        assertNoMenu();
    }

    @After
    public void stop() {
        if (this.server != null) {
            try {
                this.server.stop();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void assertNoMenu() {
        fDemo()
                .$$("span")
                .where(e -> e.getText().startsWith("Right-click anywhere"))
                .expectOne()
                .eval();
        fDemo().$$(".tm").count(0).eval();
    }

    private Findr.ListFindr findMenus() {
        return $$(".tm");
    }

    @Test
    public void mouseScenario() {
        assertNoMenu();
        fDemo().eval(contextClick);
        findMenus().expectOne().eval();

        TeaMenu menu1 = new TeaMenu(findMenus().at(0));
        menu1
                .assertItems(
                        "Copy",
                        "Cut",
                        "Paste",
                        "Yalla",
                        "I am a bit longer"
                )
                .assertSelectedItem(0, 5)
                .assertItemHasSubMenu("Copy", false)
                .assertItemHasSubMenu("Yalla", true)
                .mouseOverItem("Paste")
                .assertSelectedItem(2, 5)
                .mouseOverItem("Yalla");

        TeaMenu menu2 = new TeaMenu(findMenus().at(1));

        menu2
                .assertItems("Do this", "Do that", "Another sub menu...")
                .assertSelectedItem(0, 3)
                .mouseOverItem("Do that")
                .assertSelectedItem(1, 3);

        findMenus().count(2).eval();

        menu2
                .mouseOverItem("Another sub menu...")
                .assertItemHasSubMenu("Do this", false)
                .assertItemHasSubMenu("Do that", false)
                .assertItemHasSubMenu("Another sub menu...", true)
                .assertSelectedItem(2, 3);

        findMenus().count(3).eval();

        new TeaMenu(findMenus().at(2))
                .assertItems("Try", "Finally")
                .assertItemHasSubMenu("Try", false)
                .assertItemHasSubMenu("Finally", false)
                .assertItemActive("Try", true)
                .assertItemActive("Finally", false)
                .mouseOverItem("Try")
                .assertItemActive("Try", true)
                .assertItemActive("Finally", false)
                .mouseOverItem("Finally")
                .assertItemActive("Try", false)
                .assertItemActive("Finally", true);

        menu2.mouseOverItem("Do that");
        findMenus().count(2).eval();

        menu2
                .assertItemActive("Do this", false)
                .assertItemActive("Do that", true)
                .assertItemActive("Another sub menu...", false);

        menu1.mouseOverItem("Cut");
        findMenus().count(1).eval();

        menu1
                .assertItemActive("Copy", false)
                .assertItemActive("Cut", true);

        fDemo().eval(e -> {
            new Actions(getWebDriver()).moveToElement(e, 10, 10).click().perform();
            return true;
        });

        findMenus().count(0).eval();
    }

    @Test
    public void keyboardScenario() {
        assertNoMenu();
        fDemo().eval(contextClick); // no context menu key in Selenium ??
        findMenus().count(1).eval();

        TeaMenu menu1 = new TeaMenu(findMenus().at(0));
        menu1.assertSelectedItem(0, 5);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(1, 5);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(2, 5);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(3, 5);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(4, 5);
        // cycle !
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(0, 5);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(1, 5);
        // now up
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(0, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(4, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(3, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(2, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(1, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(0, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(4, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(3, 5);

        // expand to the right
        sendKeys(Keys.ARROW_RIGHT);
        findMenus().count(2).eval();

        TeaMenu menu2 = new TeaMenu(findMenus().at(1));
        menu2.assertSelectedItem(0, 3);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(1, 3);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(2, 3);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(0, 3);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(1, 3);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(2, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(1, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(0, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(2, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(1, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(0, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(2, 3);

        // expand to the right
        sendKeys(Keys.ARROW_RIGHT);
        findMenus().count(3).eval();
        TeaMenu menu3 = new TeaMenu(findMenus().at(2));
        menu3.assertSelectedItem(0, 2);

        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(3).eval();
        menu3.assertSelectedItem(1, 2);
        sendKeys(Keys.ARROW_DOWN);
        findMenus().count(3).eval();
        menu3.assertSelectedItem(0, 2);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(3).eval();
        menu3.assertSelectedItem(1, 2);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(3).eval();
        menu3.assertSelectedItem(0, 2);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(3).eval();
        menu3.assertSelectedItem(1, 2);

        // collapse 3rd menu
        sendKeys(Keys.ARROW_LEFT);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(2, 3);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(2).eval();
        menu2.assertSelectedItem(1, 3);

        // collapse 2nd menu
        sendKeys(Keys.ARROW_LEFT);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(3, 5);
        sendKeys(Keys.ARROW_UP);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(2, 5);

        // last arrow left has no effect
        sendKeys(Keys.ARROW_LEFT);
        findMenus().count(1).eval();
        menu1.assertSelectedItem(2, 5);

        // and close with ESC
        sendKeys(Keys.ESCAPE);
        assertNoMenu();
    }

    private void sendKeys(CharSequence... keys) {
        new Actions(getWebDriver()).sendKeys(keys).perform();
    }

    private final Function<WebElement, Boolean> contextClick = (WebElement e) -> {
        new Actions(getWebDriver()).contextClick(e).perform();
        return true;
    };

}
