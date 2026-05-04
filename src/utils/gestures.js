export async function swipeUp() {
  await driver.action('pointer')
    .move({ duration: 0, x: 540, y: 800 })
    .down({ button: 0 })
    .move({ duration: 1000, x: 540, y: 200 })
    .up({ button: 0 })
    .perform();
}

export async function swipeDown() {
  await driver.action('pointer')
    .move({ duration: 0, x: 540, y: 200 })
    .down({ button: 0 })
    .move({ duration: 1000, x: 540, y: 800 })
    .up({ button: 0 })
    .perform();
}

export async function swipeLeft() {
  await driver.action('pointer')
    .move({ duration: 0, x: 800, y: 400 })
    .down({ button: 0 })
    .move({ duration: 1000, x: 200, y: 400 })
    .up({ button: 0 })
    .perform();
}

export async function swipeRight() {
  await driver.action('pointer')
    .move({ duration: 0, x: 200, y: 400 })
    .down({ button: 0 })
    .move({ duration: 1000, x: 800, y: 400 })
    .up({ button: 0 })
    .perform();
}
