const { storeAlgorithmMap, ScrapingAlgorithm } = require("../utils/stores");
const { parse } = require("tldts");
const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

async function getPriceByUrl(url) {
  const store = parse(url).domainWithoutSuffix;
  const algorithm = storeAlgorithmMap[store] || ScrapingAlgorithm.Default;

  const priceRegex = /\$\d{1,3}(?:\.\d{3})*/g;

  try {
    let { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "es-CL,es;q=0.9,en;q=0.8",
      },
    });
    let price = "";
    let itemName = "";
    let $ = cheerio.load(html);

    $(
      'script, style, [style*="display:none"], [style*="display: none"]'
    ).remove();
    switch (algorithm) {
      case ScrapingAlgorithm.MercadoLibre:
        [itemName, price] = $('meta[property="og:title"]')
          .attr("content")
          .split(" - ");
        console.log($('meta[property="og:title"]').attr("content"));
        console.log($('meta[itemprop="price"]').attr("content"));
        break;
      case ScrapingAlgorithm.Rosen:
        price = $('meta[itemprop="price"]').attr("content");
        itemName = $('meta[property="og:title"]').attr("content");
        break;
      case ScrapingAlgorithm.Skechers:
        price = $('meta[itemprop="price"]').attr("content");
        itemName = $('meta[itemprop="name"]').attr("content");
        break;
      case ScrapingAlgorithm.Tramontina:
        price = $('meta[property="product:price:amount"]').attr("content");
        itemName = $('meta[property="og:title"]')
          .attr("content")
          .replace(" - Tramontina Store", "");
        break;
      case ScrapingAlgorithm.Jumbo:
        let browserJumbo = await puppeteer.launch({ headless: "new" });
        let pageJumbo = await browserJumbo.newPage();
        await pageJumbo.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        );
        await pageJumbo.goto(url, { waitUntil: "networkidle2" });
        html = await pageJumbo.content();
        $ = cheerio.load(html);
        price = $(".prices-main-price").first().text();
        itemName = $('meta[property="og:title"]').attr("content");
        break;
      case ScrapingAlgorithm.CruzVerde:
        let browserCruzVerde = await puppeteer.launch({ headless: "new" });
        let pageCruzVerde = await browserCruzVerde.newPage();
        await pageCruzVerde.goto(url, { waitUntil: "networkidle2" });
        html = await pageCruzVerde.content();
        $ = cheerio.load(html);
        price = $(".font-bold.text-prices").text();
        itemName = $('meta[property="og:title"]')
          .attr("content")
          .replace(" | Cruz Verde", "");
        break;
      case ScrapingAlgorithm.Salcobrand:
        price = $('meta[property="product:sale_price:amount"]').attr("content");
        itemName = $('meta[property="og:title"]').attr("content");
        break;
      case ScrapingAlgorithm.DrSimi:
        price = $('meta[property="product:price:amount"]').attr("content");
        itemName = $('meta[property="og:title"]').attr("content");
        break;
      default:
        price = $("body").text().match(priceRegex)[0]; // get full visible text
        break;
    }
    return [itemName, price.replace(/[$.,\s]/g, "")];
  } catch (err) {
    console.error("Error scraping:", err.message);
    return [];
  }
}

module.exports = { getPriceByUrl };
