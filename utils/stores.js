const ScrapingAlgorithm = {
  Default: "default",
  Tramontina: "Tramontina",
  MercadoLibre: "Mercado Libre",
};

const storeAlgorithmMap = {
  skechers: ScrapingAlgorithm.Default,
  tramontinastore: ScrapingAlgorithm.Tramontina,
  tramontina: ScrapingAlgorithm.Tramontina,
  rosen: ScrapingAlgorithm.Default,
  mercadolibre: ScrapingAlgorithm.MercadoLibre,
};

module.exports = { ScrapingAlgorithm, storeAlgorithmMap };
