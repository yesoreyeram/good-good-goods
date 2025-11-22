// Script to test clicking level 2 five times
async function testSecretUnlock() {
    const level2 = document.querySelectorAll('.level-item')[1];
    for (let i = 0; i < 5; i++) {
        level2.click();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
testSecretUnlock();
