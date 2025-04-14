const ScrapingAlgorithm = {
  MercadoLibre: "Mercado Libre",
  Rosen: "Rosen",
  Skechers: "Skechers",
  Tramontina: "Tramontina",
};

const storeAlgorithmMap = {
  mercadolibre: ScrapingAlgorithm.MercadoLibre,
  rosen: ScrapingAlgorithm.Rosen,
  skechers: ScrapingAlgorithm.Skechers,
  tramontinastore: ScrapingAlgorithm.Tramontina,
  tramontina: ScrapingAlgorithm.Tramontina,
};

module.exports = { ScrapingAlgorithm, storeAlgorithmMap };
