const fs = require('fs');

const VERSION = process.env.VERSION;
const DEP_VERSION = "^" + VERSION;

console.log("Bumping to " + VERSION);

function withJsonFile(name, callback) {
    const text = fs.readFileSync(name);
    const json = JSON.parse(text);
    callback(json)
    fs.writeFileSync(name, JSON.stringify(json, null, "  "))
}

withJsonFile("./core/package.json", j => {
    j.version = VERSION;
});

withJsonFile("./dropdown/package.json", j => {
    j.version = VERSION;
    j.peerDependencies['tea-pop-core'] = DEP_VERSION;
});

withJsonFile("./menu/package.json", j => {
    j.version = VERSION;
    j.peerDependencies['tea-pop-core'] = DEP_VERSION;
});

withJsonFile("./demo/package.json", j => {
    j.dependencies['tea-pop-core'] = VERSION;
    j.dependencies['tea-pop-dropdown'] = VERSION;
    j.dependencies['tea-pop-menu'] = VERSION;
});

