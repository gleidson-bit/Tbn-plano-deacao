// Reserva caso o navegador não consiga ler o TSE direto: a Vercel busca e repassa.
const UFS = ["br", "ac", "al", "ap", "am", "ba", "ce", "df", "es", "go", "ma", "mt", "ms", "mg", "pa", "pb", "pr", "pe", "pi", "rj", "rn", "rs", "ro", "rr", "sc", "sp", "se", "to"];

export default async function handler(req, res) {
  const eleicao = String(req.query.eleicao || "6258").replace(/\D/g, "");
  const uf = UFS.includes(String(req.query.uf)) ? String(req.query.uf) : "br";
  const cod = eleicao.padStart(6, "0");
  const url = `https://resultados.tse.jus.br/oficial/ele2026/${eleicao}/dados/${uf}/${uf}-c0001-e${cod}-u.json`;
  try {
    const r = await fetch(url, { cache: "no-store" });
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=20");
    res.status(r.status).setHeader("Content-Type", "application/json").send(await r.text());
  } catch (e) {
    res.status(502).json({ erro: "Não foi possível falar com o TSE." });
  }
}
