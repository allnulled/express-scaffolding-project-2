class Test {

    constructor(title, testFunction, timeout = 10000) {
        this.title = title;
        this.test = testFunction;
        this.timeout = timeout;
    }

}

class TestingUtilities {

    static get Test() {
        return Test;
    }

    constructor() {
        this.tests = [];
    }

    addTest(title, testFunction, timeout = undefined) {
        const newTest = new this.constructor.Test(title, testFunction, timeout);
        this.tests.push(newTest);
    }

    assert(assertion, id = "?", isPrinted = 0) {
        if (assertion !== true) {
            throw new Error(`Assertion failed on «${id}»`);
        }
        if (isPrinted) {
            console.log(`   ✓ Assertion okay: ${id}`);
        }
    }

    async runTests() {
        let currentTest = undefined;
        let secondsTaken = undefined;
        const beginMoment = new Date();
        try {
            const allMetrics = [];
            const allAssertions = {};
            const generateAssert = (testName) => {
                if(!(testName in allAssertions)) {
                    allAssertions[testName] = [];
                }
                return (assertion, id, isPrinted) => {
                    const assertionResult = this.assert(assertion, id, isPrinted);
                    const currentMoment = new Date();
                    allAssertions[testName].push({
                        assertion,
                        id,
                        isPrinted,
                        moment: (currentMoment - beginMoment) / 1000
                    });
                    return assertionResult;
                }
            };
            for (let index = 0; index < this.tests.length; index++) {
                const testData = this.tests[index];
                const { title, test, timeout } = testData;
                console.log();
                console.log(` ✓ Starting test: «${title}»`);
                currentTest = title;
                const assertFunction = generateAssert(title);
                const testsPromise = test(assertFunction);
                let clearId;
                const result = await Promise.race([
                    testsPromise,
                    new Promise(ok => {
                        clearId = setTimeout(() => {
                            const timeoutError = new Error(`Timeout error on test ${title}`);
                            ok(timeoutError);
                        }, timeout);
                    }),
                ]);
                clearTimeout(clearId);
                if (result instanceof Error) {
                    throw result;
                }
                const endMoment = new Date();
                secondsTaken = (endMoment - beginMoment) / 1000;
                console.log(`   ✓ Test passed in «${secondsTaken}» seconds`);
                allMetrics.push({ id: title, time: secondsTaken });
            }
            console.log();
            console.log(` ✓ Tests summary:`);
            for (let index = 0; index < allMetrics.length; index++) {
                const testMetric = allMetrics[index];
                console.log(`   ✓ [${index + 1}] «${testMetric.id}» in second «${testMetric.time}»`);
                const testAssertions = allAssertions[testMetric.id] || [];
                for(let indexAssertions = 0; indexAssertions < testAssertions.length; indexAssertions++) {
                    const assertion = testAssertions[indexAssertions];
                    console.log(`     ✓ [${indexAssertions + 1}] @${assertion.moment}: ${assertion.id}`);
                    
                }

            }
            console.log("   ✓ [✓] OK TO ALL TESTS!!");
            console.log();
        } catch (error) {
            console.error(`Tests failed on «${currentTest}» due to:`, error);
        }
    }

}

module.exports = TestingUtilities;