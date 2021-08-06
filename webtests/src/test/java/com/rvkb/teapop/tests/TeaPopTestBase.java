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

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TeaPopTestBase extends ManagedDriverJunit4TestBase {

    private static String WEBAPP_DIR = System.getProperty("teapop.webapp.dir");

    private ExecutorService executorService = Executors.newSingleThreadExecutor();
    private Server server;

    @Before
    public void start() {
        if (WEBAPP_DIR != null && !WEBAPP_DIR.equals("dev")) {

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
                        Thread.sleep(200);
                    } catch (InterruptedException interruptedException) {
                        // try again
                    }
                }
                retries--;
            }
        } else {
            getWebDriver().get("http://localhost:3000");
        }
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
}
