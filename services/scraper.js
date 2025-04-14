const { storeAlgorithmMap, ScrapingAlgorithm } = require("../utils/stores");
const { parse } = require("tldts");
const cheerio = require("cheerio");
const axios = require("axios");

async function getPriceByUrl(url) {
  const store = parse(url).domainWithoutSuffix;
  const algorithm = storeAlgorithmMap[store] || ScrapingAlgorithm.Default;

  const priceRegex = /\$\d{1,3}(?:\.\d{3})*/g;

  try {
    const { data: html } = await axios.get(url);
    let price = "";
    let itemName = "";
    const $ = cheerio.load(html);
    $(
      'script, style, [style*="display:none"], [style*="display: none"]'
    ).remove();
    switch (algorithm) {
      case ScrapingAlgorithm.MercadoLibre:
        price = $('meta[itemprop="price"]').attr("content");
        itemName = $(".ui-pdp-title").text();
        break;
      case ScrapingAlgorithm.Rosen:
        price = $("body").text().match(priceRegex)[0];
        itemName = $('meta[property="og:title"]').attr("content");
        break;
      case ScrapingAlgorithm.Skechers:
        price = $("body").text().match(priceRegex)[0];
        itemName = $('meta[itemprop="name"]').attr("content");
        break;
      case ScrapingAlgorithm.Tramontina:
        price = $(
          ".vtex-product-price-1-x-currencyContainer.vtex-product-price-1-x-currencyContainer--productSellingPrice"
        )
          .text()
          .trim();
        itemName = $('meta[property="og:title"]')
          .attr("content")
          .replace(" - Tramontina Store", "");
        break;
      default:
        price = $("body").text().match(priceRegex)[0]; // get full visible text
        break;
    }
    return [itemName, price.replace(/[$.,]/g, "")];
  } catch (err) {
    console.error("Error scraping:", err.message);
    return [];
  }
}

module.exports = { getPriceByUrl };
