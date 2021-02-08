const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://erp.voanet.com.br/users/login')
    await page.waitForSelector('#UserLogin')
    await page.type('#UserLogin', 'marcos.bispo')
    await page.type('#UserPassword2', '863578')
    await page.keyboard.press('Enter')
    await page.setViewport({
        width: 1200,
        height: 800
    })

    await autoScroll(page)

    // const imgList = await page.evaluate(() => {
    //     const nodeList = document.querySelectorAll('article img')

    //     const imgArray = [...nodeList]

    //     const imgList = imgArray.map( ({src}) => ({
    //         src
    //     }))
    //     console.log(imgList)
    //     return imgList
    // })

    const companyList = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('.in-table-description')

        const companyArray = [...nodeList]

        const companyList = companyArray.map( ({innerHTML}) => ({
            innerHTML
        }))

        setInterval(() => {
            companyList.forEach((item, index) => {
                let company = /[0-9]{14}/g.exec(item.innerHTML)

                if (company !== null) {
                    console.log(company.input)
                } else {
                    console.log('sem empresa no momento')
                }
            })
        }, 5000);
    })

    

    // fs.writeFile('instagram.json', JSON.stringify(imgList, null, 2), err => {
    //     if (err) throw new Error('something went wrong')

    //     console.log('well done!')
    // })

    // await browser.close()
})();

async function autoScroll(page) {
    await page.waitForSelector('.in-table-description')
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 100
            let timer = setInterval(() => {
                let scrollHeight = document.querySelector('.dataTables_scrollBody').scrollHeight;
                console.log(scrollHeight.scrollHeight)
                document.querySelector('.dataTables_scrollBody').scrollBy(0, distance)
                totalHeight += distance

                if(totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100);
        })
    })

}