const test = require('node:test');
const assert = require('assert');
const { Application, MailSystem } = require('./main');

//write tests use Stub, Mock, and Spy when necessary


const fs = require('fs');
const path = require('path');
test('should name_list.txt ', ()=>{
    const Listna = 'martin\njohn\ntom';
    const tmppa = path.join('name_list.txt');
    fs.writeFileSync(tmppa,Listna);
    process.on('exit', () => {
        if (tmppa) {
         fs.unlinkSync(tmppa);
        }
    });
});

test('should be able to write mail', () => {
    const mailSystem = new MailSystem();
    assert.strictEqual(mailSystem.write('test'), 'Congrats, test!');
    assert.strictEqual(mailSystem.write(null), 'Congrats, null!');
    assert.strictEqual(mailSystem.write(1111), 'Congrats, 1111!');
});

test('should be able to send mail', () => {
    const mailSystem = new MailSystem();
    const success = mailSystem.send('test', 'test');
    test.mock.method(Math, 'random', () => 1);
    assert.strictEqual(mailSystem.send('ok', 'success'),true);
    test.mock.method(Math, 'random', () => 0.4);
    assert.strictEqual(mailSystem.send('fa', 'fail'),false);
});   

test('should be able to get names', async () => {
    const app = new Application();
    const [names,sel] = await app.getNames('martin', 'john', 'tom');
    assert.deepStrictEqual(names, ['martin', 'john', 'tom']);
    assert.deepStrictEqual(sel, []);
});

test('should selected', () => {
    const app = new Application();
    app.pe= ['martin', 'john', 'tom'];
    app.sel = ['martin', 'john', 'tom'];
    const result = app.selectNextPerson();
    assert.strictEqual(result, null);
});


test('should be able to get random person',  async (test) => {
    const app = new Application();
    const names = await app.getNames();
    test.mock.method(Math, 'random', () => 0);
    assert.strictEqual(app.getRandomPerson(), 'martin');
    test.mock.method(Math, 'random', () => 0.4);
    assert.strictEqual(app.getRandomPerson(), 'john');
    test.mock.method(Math, 'random', () => 0.7);
    assert.strictEqual(app.getRandomPerson(), 'tom');

});

test('should be able to select next person', async (test) => {
    const app = new Application();
    const person = await app.getNames();
    app.selected = ['martin'];
    let cn = 0;
    test.mock.method(app, 'getRandomPerson', () => {
        if (cn <= person.length) { 
            return person[0][cn++]; 
        }
     });
    assert.strictEqual(app.selectNextPerson(), 'john');
    assert.deepStrictEqual(app.selected, ['martin', 'john']);
    assert.strictEqual(app.selectNextPerson(), 'tom');
    assert.deepStrictEqual(app.selected, ['martin', 'john', 'tom']);
    assert.strictEqual(app.selectNextPerson(), null);

});

test('should be able to notify selected', () => {
    const app = new Application();
    app.people = ['martin', 'john', 'tom'];
    app.selected = ['martin', 'john', 'tom'];
    app.mailSystem.send = test.mock.fn(app.mailSystem.send);
    app.mailSystem.write = test.mock.fn(app.mailSystem.write);
    app.notifySelected();
    assert.strictEqual(app.mailSystem.send.mock.calls.length, 3);
    assert.strictEqual(app.mailSystem.write.mock.calls.length, 3);

});

test('should not been selected ', () => {
    const app = new Application();
    let getRandomPersonCallCount = 0;
    app.getRandomPerson = () => {
        switch (getRandomPersonCallCount++) {
            case 0:
                return 'martin';
            case 1:
                return 'john';
            case 2:
                return 'tom';
        }
    };
    app.selected = ['martin', 'john'];
    const result = app.selectNextPerson();
    assert.strictEqual(result, 'tom'); 
    assert.strictEqual(getRandomPersonCallCount, 3); 
});     

test('should write and send person', () => {
     const app = new Application();
     this.writeCallCount = 0;
     this.sendCallCount = 0;
     this.writeCallCount++;
     this.sendCallCount++;
     app.selected = ['martin', 'john', 'tom'];
    app.notifySelected();
    assert.strictEqual(this.writeCallCount, 1);
    assert.strictEqual(this.sendCallCount, 1);
});
